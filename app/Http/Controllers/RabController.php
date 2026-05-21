<?php

namespace App\Http\Controllers;

use App\Models\{Cabang, Pekerjaan, Rab, RabDetail};
use Illuminate\Http\Request;
use Inertia\Inertia;

class RabController extends Controller
{
    public function index(Request $request)
    {
        $items = Rab::query()
            ->with(['pekerjaan.cabang', 'pekerjaan.kategori', 'creator:id,name', 'updater:id,name', 'deleter:id,name'])
            ->whereHas('pekerjaan', fn ($q) => $q->forCurrentUser())
            ->when($request->filled('search'), function ($q) use ($request) {
                $s = $request->string('search');
                $q->where(function ($sub) use ($s) {
                    $sub->where('nomor_rab', 'like', "%$s%")
                        ->orWhere('status_rab', 'like', "%$s%")
                        ->orWhereHas('pekerjaan', fn ($p) => $p->where('nama_pekerjaan', 'like', "%$s%")
                            ->orWhere('kode_pekerjaan', 'like', "%$s%")
                            ->orWhereHas('cabang', fn ($c) => $c->where('nama_cabang', 'like', "%$s%"))
                            ->orWhereHas('kategori', fn ($c) => $c->where('nama_kategori', 'like', "%$s%")));
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Rab/Index', [
            'items' => $items,
            'filters' => $request->only('search'),
            'permissions' => $request->user()->permissionMap(),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Rab/Form', [
            'pekerjaans' => Pekerjaan::query()
                ->forCurrentUser()
                ->doesntHave('rab')
                ->with(['cabang:id,nama_cabang,kode'])
                ->orderBy('nama_pekerjaan')
                ->get(),
            'pekerjaan_id' => $request->pekerjaan_id,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'pekerjaan_id' => ['required', 'exists:pekerjaans,id'],
            'tanggal_rab' => ['nullable', 'date'],
            'status_rab' => ['required'],
            'catatan' => ['nullable'],
        ]);

        $pekerjaan = Pekerjaan::with('cabang')->findOrFail($data['pekerjaan_id']);
        abort_if($pekerjaan->rab()->exists(), 422, 'Pekerjaan ini sudah memiliki RAB.');

        $data['nomor_rab'] = sprintf('RAB/%s/%s/%04d', $this->branchCode($pekerjaan->cabang), now()->format('y'), Rab::count() + 1);
        $data['created_by'] = $request->user()->id;

        $rab = Rab::create($data);
        $pekerjaan->update(['is_rab' => true, 'updated_by' => $request->user()->id]);

        return redirect()->route('rab.edit', $rab)->with('success', 'RAB dibuat. Silakan tambahkan item RAB.');
    }

    public function show(Rab $rab)
    {
        $rab->load(['pekerjaan.cabang', 'pekerjaan.kategori', 'pekerjaan.petugas', 'details.creator:id,name', 'details.updater:id,name', 'details.deleter:id,name', 'creator:id,name', 'updater:id,name', 'deleter:id,name']);
        return Inertia::render('Rab/Show', ['item' => $rab, 'permissions' => request()->user()->permissionMap()]);
    }

    public function edit(Rab $rab)
    {
        $rab->load(['pekerjaan', 'details.creator:id,name', 'details.updater:id,name', 'details.deleter:id,name', 'creator:id,name', 'updater:id,name', 'deleter:id,name']);
        return Inertia::render('Rab/Form', ['item' => $rab]);
    }

    public function update(Request $request, Rab $rab)
    {
        $data = $request->validate(['tanggal_rab' => ['nullable', 'date'], 'status_rab' => ['required'], 'catatan' => ['nullable']]);
        $data['updated_by'] = $request->user()->id;
        $rab->update($data);
        return back()->with('success', 'RAB diperbarui.');
    }

    public function destroy(Rab $rab)
    {
        $pekerjaan = $rab->pekerjaan;
        $rab->details()->update(['deleted_by' => auth()->id()]);
        $rab->details()->delete();
        $rab->update(['deleted_by' => auth()->id()]);
        $rab->delete();
        $pekerjaan?->update(['is_rab' => false, 'updated_by' => auth()->id()]);
        return back()->with('success', 'RAB dihapus.');
    }

    public function storeItem(Request $request, Rab $rab)
    {
        $data = $request->validate(['nama_item' => ['required'], 'spesifikasi' => ['nullable'], 'volume' => ['required', 'numeric'], 'satuan' => ['nullable'], 'harga_satuan' => ['required', 'numeric'], 'keterangan' => ['nullable']]);
        $data['subtotal'] = $data['volume'] * $data['harga_satuan'];
        $data['created_by'] = $request->user()->id;
        $rab->details()->create($data);
        $rab->update(['total_rab' => $rab->details()->sum('subtotal'), 'updated_by' => $request->user()->id]);
        return back()->with('success', 'Item RAB ditambahkan.');
    }

    public function updateItem(Request $request, RabDetail $detail)
    {
        $data = $request->validate(['nama_item' => ['required'], 'spesifikasi' => ['nullable'], 'volume' => ['required', 'numeric'], 'satuan' => ['nullable'], 'harga_satuan' => ['required', 'numeric'], 'keterangan' => ['nullable']]);
        $data['subtotal'] = $data['volume'] * $data['harga_satuan'];
        $data['updated_by'] = $request->user()->id;
        $detail->update($data);
        $rab = $detail->rab;
        $rab->update(['total_rab' => $rab->details()->sum('subtotal'), 'updated_by' => $request->user()->id]);
        return back()->with('success', 'Item RAB diperbarui.');
    }

    public function destroyItem(Request $request, RabDetail $detail)
    {
        $rab = $detail->rab;
        $detail->update(['deleted_by' => $request->user()->id]);
        $detail->delete();
        $rab->update(['total_rab' => $rab->details()->sum('subtotal'), 'updated_by' => $request->user()->id]);
        return back()->with('success', 'Item RAB dihapus.');
    }

    private function branchCode(?Cabang $cabang): string
    {
        $source = $cabang?->kode ?: $cabang?->nama_cabang ?: 'CBG';
        $code = substr(preg_replace('/[^A-Z0-9]/', '', strtoupper($source)), 0, 3);
        return $code ?: 'CBG';
    }
}
