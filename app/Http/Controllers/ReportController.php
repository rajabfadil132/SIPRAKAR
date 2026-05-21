<?php

namespace App\Http\Controllers;

use App\Models\Pekerjaan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function __invoke(Request $request)
    {
        $filtered = Pekerjaan::query()
            ->forCurrentUser()
            ->when($request->filled('search'), function ($q) use ($request) {
                $s = $request->string('search');
                $q->where(function ($sub) use ($s) {
                    $sub->where('nama_pekerjaan', 'like', "%$s%")
                        ->orWhere('kode_pekerjaan', 'like', "%$s%")
                        ->orWhereHas('cabang', fn ($c) => $c->where('nama_cabang', 'like', "%$s%"))
                        ->orWhereHas('kategori', fn ($c) => $c->where('nama_kategori', 'like', "%$s%"))
                        ->orWhereHas('petugas', fn ($c) => $c->where('name', 'like', "%$s%"));
                });
            })
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->when($request->filled('kategori_id'), fn ($q) => $q->where('kategori_id', $request->kategori_id));

        $items = (clone $filtered)
            ->with(['cabang', 'kategori', 'petugas', 'rab', 'creator:id,name', 'updater:id,name'])
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Reports/Index', [
            'items' => $items,
            'summary' => [
                'total' => (clone $filtered)->count(),
                'avg_progress' => round((clone $filtered)->avg('progress') ?? 0),
            ],
            'filters' => $request->only('search', 'status', 'kategori_id'),
        ]);
    }
}
