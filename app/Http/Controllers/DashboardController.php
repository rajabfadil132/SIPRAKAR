<?php

namespace App\Http\Controllers;

use App\Models\{Cabang, Pekerjaan, ProgramKerja, Rab};
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $selectedYear = (int) $request->integer('year', now()->year);
        if ($selectedYear < 2000 || $selectedYear > ((int) now()->year + 5)) {
            $selectedYear = now()->year;
        }

        $pekerjaan = Pekerjaan::query()->forCurrentUser();
        $program = ProgramKerja::query()->forCurrentUser();

        $yearOptions = collect()
            ->merge(ProgramKerja::query()->forCurrentUser()->selectRaw('DISTINCT tahun')->pluck('tahun'))
            ->map(fn ($year) => (int) $year)
            ->filter(fn ($year) => $year >= 2000)
            ->push((int) now()->year)
            ->unique()
            ->sortDesc()
            ->values();

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'total_program' => (clone $program)->count(),
                'belum' => (clone $pekerjaan)->where('status', 'Belum dilaksanakan')->count(),
                'berjalan' => (clone $pekerjaan)->where('status', 'Sedang berjalan')->count(),
                'selesai' => (clone $pekerjaan)->where('status', 'Selesai')->count(),
                'tertunda' => (clone $pekerjaan)->where('status', 'Tertunda')->count(),
                'dengan_rab' => (clone $pekerjaan)->whereHas('rab')->count(),
                'tanpa_rab' => (clone $pekerjaan)->doesntHave('rab')->count(),
                'avg_progress' => round((clone $pekerjaan)->avg('progress') ?? 0),
                'total_rab' => Rab::whereHas('pekerjaan', fn ($q) => $q->forCurrentUser())->sum('total_rab'),
            ],
            'recentPekerjaan' => Pekerjaan::query()->forCurrentUser()->with(['cabang','kategori','petugas'])->latest()->limit(6)->get(),
            'runningItems' => Pekerjaan::query()
                ->forCurrentUser()
                ->with(['cabang:id,nama_cabang','kategori:id,nama_kategori','petugas:id,name'])
                ->where('status', 'Sedang berjalan')
                ->orderByDesc('updated_at')
                ->limit(24)
                ->get(),
            'byCabang' => Cabang::query()->withCount(['pekerjaans as total_pekerjaan'])->get(),
            'trend' => collect(range(1, 12))->map(fn ($m) => [
                'month' => now()->month($m)->format('M'),
                'program' => ProgramKerja::query()->forCurrentUser()->where('tahun', $selectedYear)->whereMonth('created_at', $m)->count(),
                'selesai' => Pekerjaan::query()->forCurrentUser()->where('status','Selesai')->whereYear('updated_at', $selectedYear)->whereMonth('updated_at', $m)->count(),
            ]),
            'selectedYear' => $selectedYear,
            'yearOptions' => $yearOptions,
        ]);
    }
}
