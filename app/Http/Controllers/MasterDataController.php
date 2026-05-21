<?php

namespace App\Http\Controllers;

use App\Models\{Cabang, KategoriPekerjaan, Lembaga, Lokasi};
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterDataController extends Controller
{
    public function index()
    {
        return Inertia::render('Master/Index', [
            'cabangs' => Cabang::query()->with(['creator:id,name','updater:id,name','deleter:id,name'])->latest()->get(),
            'lembagas' => Lembaga::query()->with(['cabang','creator:id,name','updater:id,name','deleter:id,name'])->latest()->get(),
            'lokasis' => Lokasi::query()->with(['cabang','creator:id,name','updater:id,name','deleter:id,name'])->latest()->get(),
            'kategoris' => KategoriPekerjaan::query()->with(['creator:id,name','updater:id,name','deleter:id,name'])->latest()->get(),
            'permissions' => request()->user()->permissionMap(),
        ]);
    }

    public function store(Request $request, string $type)
    {
        [$model, $rules] = $this->definition($type);
        $data = $request->validate($rules);
        $data['created_by'] = $request->user()->id;
        $model::create($data);

        return back()->with('success', 'Master data berhasil ditambahkan.');
    }

    public function update(Request $request, string $type, int $id)
    {
        [$model, $rules] = $this->definition($type, $id);
        $item = $model::findOrFail($id);
        $data = $request->validate($rules);
        $data['updated_by'] = $request->user()->id;
        $item->update($data);

        return back()->with('success', 'Master data berhasil diperbarui.');
    }

    public function destroy(Request $request, string $type, int $id)
    {
        [$model] = $this->definition($type);
        $item = $model::findOrFail($id);
        $item->update(['deleted_by' => $request->user()->id]);
        $item->delete();

        return back()->with('success', 'Master data berhasil dihapus.');
    }

    private function definition(string $type, ?int $id = null): array
    {
        return match ($type) {
            'cabangs' => [Cabang::class, [
                'nama_cabang' => ['required', 'string', 'max:255'],
                'kode' => ['required', 'string', 'max:10', 'unique:cabangs,kode,' . $id],
                'alamat' => ['nullable', 'string'],
                'keterangan' => ['nullable', 'string'],
                'status' => ['required', 'in:active,inactive'],
            ]],
            'lembagas' => [Lembaga::class, [
                'cabang_id' => ['required', 'exists:cabangs,id'],
                'nama_lembaga' => ['required', 'string', 'max:255'],
                'penanggung_jawab' => ['nullable', 'string', 'max:255'],
                'keterangan' => ['nullable', 'string'],
                'status' => ['required', 'in:active,inactive'],
            ]],
            'lokasis' => [Lokasi::class, [
                'cabang_id' => ['required', 'exists:cabangs,id'],
                'nama_gedung' => ['required', 'string', 'max:255'],
                'lantai' => ['nullable', 'string', 'max:100'],
                'ruangan' => ['nullable', 'string', 'max:255'],
                'keterangan' => ['nullable', 'string'],
                'status' => ['required', 'in:active,inactive'],
            ]],
            'kategoris' => [KategoriPekerjaan::class, [
                'nama_kategori' => ['required', 'string', 'max:255'],
                'keterangan' => ['nullable', 'string'],
                'status' => ['required', 'in:active,inactive'],
            ]],
            default => abort(404, 'Jenis master data tidak tersedia.'),
        };
    }
}
