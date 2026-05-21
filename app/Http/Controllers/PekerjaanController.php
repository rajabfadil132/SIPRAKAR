<?php

namespace App\Http\Controllers;

use App\Models\{Cabang, KategoriPekerjaan, Lokasi, Pekerjaan, PekerjaanChecklist, ProgramKerja, User};
use Illuminate\Http\Request;
use Inertia\Inertia;

class PekerjaanController extends Controller
{
    public function index(Request $request)
    {
        $items = Pekerjaan::query()
            ->forCurrentUser()
            ->with(['programKerja', 'cabang', 'lokasi', 'kategori', 'petugas', 'rab', 'creator:id,name', 'updater:id,name', 'deleter:id,name'])
            ->when($request->filled('search'), function ($q) use ($request) {
                $s = $request->string('search');
                $q->where(function ($sub) use ($s) {
                    $sub->where('nama_pekerjaan', 'like', "%$s%")
                        ->orWhere('kode_pekerjaan', 'like', "%$s%")
                        ->orWhereHas('programKerja', fn ($c) => $c->where('nama_program', 'like', "%$s%"))
                        ->orWhereHas('cabang', fn ($c) => $c->where('nama_cabang', 'like', "%$s%"))
                        ->orWhereHas('kategori', fn ($c) => $c->where('nama_kategori', 'like', "%$s%"))
                        ->orWhereHas('petugas', fn ($c) => $c->where('name', 'like', "%$s%"));
                });
            })
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Pekerjaan/Index', [
            'items' => $items,
            'filters' => $request->only('search', 'status'),
            'permissions' => $request->user()->permissionMap(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Pekerjaan/Form', $this->formData());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'program_kerja_id' => ['nullable', 'exists:program_kerjas,id'],
            'nama_pekerjaan' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'cabang_id' => ['nullable', 'exists:cabangs,id'],
            'lokasi_id' => ['nullable', 'exists:lokasis,id'],
            'kategori_id' => ['nullable', 'exists:kategori_pekerjaans,id'],
            'penanggung_jawab_id' => ['nullable', 'exists:users,id'],
            'petugas_id' => ['nullable', 'exists:users,id'],
            'tanggal_mulai' => ['nullable', 'date'],
            'target_selesai' => ['nullable', 'date'],
            'status' => ['required', 'string'],
            'catatan' => ['nullable', 'string'],
            'checklists' => ['nullable', 'array'],
            'checklists.*' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();
        if (strtolower($user->role?->nama_role ?? '') !== 'superadmin') {
            $data['cabang_id'] = $user->cabang_id;
        }

        $checklists = $this->normalizeChecklist($data['checklists'] ?? []);
        unset($data['checklists']);

        $data['kode_pekerjaan'] = $this->generateKode('PKR', $data['cabang_id']);
        $data['progress'] = 0;
        $data['is_rab'] = false;
        $data['created_by'] = $user->id;

        $pekerjaan = Pekerjaan::create($data);
        $this->syncChecklists($pekerjaan, $checklists, $user->id);
        $this->recalculateProgressFromChecklist($pekerjaan, $user->id, false);

        return redirect()->route('pekerjaan.index')->with('success', 'Pekerjaan berhasil dibuat. Tambahkan RAB dari tombol aksi jika pekerjaan memerlukan RAB.');
    }

    public function show(Request $request, Pekerjaan $pekerjaan)
    {
        $pekerjaan->load([
            'programKerja', 'cabang', 'lokasi', 'kategori', 'petugas', 'penanggungJawab',
            'rab.details.creator:id,name', 'rab.details.updater:id,name', 'rab.details.deleter:id,name',
            'rab.creator:id,name', 'rab.updater:id,name', 'rab.deleter:id,name',
            'progressLogs.updater:id,name',
            'checklists.creator:id,name', 'checklists.updater:id,name', 'checklists.deleter:id,name', 'checklists.completer:id,name',
            'creator:id,name', 'updater:id,name', 'deleter:id,name',
        ]);

        return Inertia::render('Pekerjaan/Show', [
            'item' => $pekerjaan,
            'permissions' => $request->user()->permissionMap(),
        ]);
    }

    public function edit(Pekerjaan $pekerjaan)
    {
        $pekerjaan->load(['creator:id,name', 'updater:id,name', 'checklists', 'rab']);
        return Inertia::render('Pekerjaan/Form', array_merge($this->formData(), ['item' => $pekerjaan]));
    }

    public function update(Request $request, Pekerjaan $pekerjaan)
    {
        $data = $request->validate([
            'nama_pekerjaan' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'lokasi_id' => ['nullable', 'exists:lokasis,id'],
            'kategori_id' => ['nullable', 'exists:kategori_pekerjaans,id'],
            'penanggung_jawab_id' => ['nullable', 'exists:users,id'],
            'petugas_id' => ['nullable', 'exists:users,id'],
            'tanggal_mulai' => ['nullable', 'date'],
            'target_selesai' => ['nullable', 'date'],
            'tanggal_selesai' => ['nullable', 'date'],
            'status' => ['required', 'string'],
            'catatan' => ['nullable', 'string'],
            'checklists' => ['nullable', 'array'],
            'checklists.*' => ['nullable', 'string', 'max:255'],
        ]);

        $checklists = $this->normalizeChecklist($data['checklists'] ?? []);
        unset($data['checklists']);

        $data['updated_by'] = $request->user()->id;
        $data['is_rab'] = $pekerjaan->rab()->exists();

        $pekerjaan->update($data);
        $this->syncChecklists($pekerjaan, $checklists, $request->user()->id);
        $this->recalculateProgressFromChecklist($pekerjaan, $request->user()->id, false);

        return redirect()->route('pekerjaan.show', $pekerjaan)->with('success', 'Pekerjaan diperbarui.');
    }

    public function destroy(Pekerjaan $pekerjaan)
    {
        $pekerjaan->update(['deleted_by' => auth()->id()]);
        $pekerjaan->checklists()->update(['deleted_by' => auth()->id()]);
        $pekerjaan->delete();

        return redirect()->route('pekerjaan.index')->with('success', 'Pekerjaan dihapus secara soft delete.');
    }

    public function storeProgress(Request $request, Pekerjaan $pekerjaan)
    {
        return back()->with('warning', 'Progress manual dinonaktifkan. Gunakan checklist detail pekerjaan untuk memperbarui progress.');
    }

    public function toggleChecklist(Request $request, Pekerjaan $pekerjaan, PekerjaanChecklist $checklist)
    {
        abort_unless($checklist->pekerjaan_id === $pekerjaan->id, 404);

        $data = $request->validate([
            'is_done' => ['required', 'boolean'],
        ]);

        $checklist->update([
            'is_done' => $data['is_done'],
            'completed_by' => $data['is_done'] ? $request->user()->id : null,
            'completed_at' => $data['is_done'] ? now() : null,
            'updated_by' => $request->user()->id,
        ]);

        $this->recalculateProgressFromChecklist($pekerjaan, $request->user()->id, true);

        return back()->with('success', 'Checklist pekerjaan diperbarui dan progress dihitung otomatis.');
    }

    private function formData(): array
    {
        return [
            'programs' => ProgramKerja::forCurrentUser()->get(),
            'cabangs' => Cabang::where('status', 'active')->get(),
            'lokasis' => Lokasi::where('status', 'active')->get(),
            'kategoris' => KategoriPekerjaan::where('status', 'active')->get(),
            'users' => User::query()->where('status', 'active')->get(),
        ];
    }

    private function generateKode(string $prefix, mixed $cabangId): string
    {
        $cabang = Cabang::find($cabangId);
        $count = Pekerjaan::whereYear('created_at', now()->year)->count() + 1;
        return sprintf('%s/%s/%s/%04d', $prefix, $this->branchCode($cabang), now()->format('y'), $count);
    }

    private function branchCode(?Cabang $cabang): string
    {
        $source = $cabang?->kode ?: $cabang?->nama_cabang ?: 'CBG';
        $code = substr(preg_replace('/[^A-Z0-9]/', '', strtoupper($source)), 0, 3);
        return $code ?: 'CBG';
    }

    private function normalizeChecklist(array $items): array
    {
        return collect($items)
            ->map(fn ($item) => trim((string) $item))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    private function syncChecklists(Pekerjaan $pekerjaan, array $items, int $userId): void
    {
        $existing = $pekerjaan->checklists()->get()->keyBy('deskripsi');
        $wanted = collect($items);

        foreach ($wanted as $deskripsi) {
            if ($existing->has($deskripsi)) {
                $existing[$deskripsi]->update(['updated_by' => $userId]);
            } else {
                $pekerjaan->checklists()->create([
                    'deskripsi' => $deskripsi,
                    'created_by' => $userId,
                ]);
            }
        }

        $pekerjaan->checklists()
            ->whereNotIn('deskripsi', $wanted->all())
            ->get()
            ->each(function (PekerjaanChecklist $checklist) use ($userId) {
                $checklist->update(['deleted_by' => $userId]);
                $checklist->delete();
            });
    }

    private function recalculateProgressFromChecklist(Pekerjaan $pekerjaan, int $userId, bool $writeLog): void
    {
        $total = $pekerjaan->checklists()->count();
        $done = $pekerjaan->checklists()->where('is_done', true)->count();
        $progress = $total > 0 ? (int) round(($done / $total) * 100) : 0;
        $status = $progress >= 100 ? 'Selesai' : ($progress > 0 ? 'Sedang berjalan' : 'Belum dilaksanakan');

        $pekerjaan->update([
            'progress' => $progress,
            'status' => $status,
            'tanggal_selesai' => $progress >= 100 ? now()->toDateString() : null,
            'updated_by' => $userId,
        ]);

        if ($writeLog) {
            $pekerjaan->progressLogs()->create([
                'tanggal_update' => now(),
                'progress' => $progress,
                'status' => $status,
                'catatan' => 'Progress diperbarui otomatis dari checklist pekerjaan.',
                'updated_by' => $userId,
            ]);
        }
    }
}
