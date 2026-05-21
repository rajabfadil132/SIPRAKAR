import StatCard from "@/Components/StatCard";
import StatusBadge from "@/Components/StatusBadge";
import AppLayout from "@/Layouts/AppLayout";
import { formatDate } from "@/Utils/date";
import { Link, router } from "@inertiajs/react";
import { CalendarCheck, CheckCircle2, Eye, FileSpreadsheet, Wrench } from "lucide-react";

const rupiah = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value ?? 0));

export default function Dashboard({ stats, recentPekerjaan = [], runningItems = [], trend = [], selectedYear, yearOptions = [] }) {
    const changeYear = (event) => {
        router.get("/dashboard", { year: event.target.value }, { preserveScroll: true, preserveState: false, replace: true });
    };

    return (
        <AppLayout title="Dashboard">
            <p className="mb-6 text-sm text-slate-500">Ringkasan operasional program kerja sarana prasarana kampus.</p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Program Kerja" value={stats.total_program} hint="tahun berjalan" icon={<CalendarCheck />} />
                <StatCard label="Sedang Berjalan" value={stats.berjalan} hint="perlu dipantau" icon={<Wrench />} />
                <StatCard label="Selesai" value={stats.selesai} hint={`${stats.avg_progress}% rata-rata progress`} icon={<CheckCircle2 />} />
                <StatCard label="Total RAB" value={rupiah(stats.total_rab)} hint={`${stats.dengan_rab} pekerjaan dengan RAB`} icon={<FileSpreadsheet />} />
            </div>

            <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                <div className="page-card min-w-0">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-bold">Trend Program Kerja</h2>
                            <p className="text-xs text-slate-500">Line chart per tahun: program dibuat dan pekerjaan selesai.</p>
                        </div>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            Tahun
                            <select value={selectedYear ?? new Date().getFullYear()} onChange={changeYear} className="input min-w-[110px] py-1.5 text-xs">
                                {(yearOptions.length ? yearOptions : [new Date().getFullYear()]).map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <TrendLineChart data={trend} />
                </div>

                <div className="page-card min-w-0">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="font-bold">Pekerjaan Sedang Berjalan</h2>
                        <Link href="/pekerjaan?status=Sedang%20berjalan" className="shrink-0 text-xs font-bold text-[#4cceac]">Lihat semua</Link>
                    </div>
                    <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1 sm:max-h-[420px]">
                        {runningItems.length === 0 && <p className="text-sm text-slate-500">Tidak ada pekerjaan yang sedang berjalan.</p>}
                        {runningItems.map((item) => (
                            <Link href={`/pekerjaan/${item.id}`} key={item.id} className="block min-w-0 rounded-xl border border-[#29314b] p-3 transition hover:bg-[#141b2d]">
                                <div className="flex min-w-0 items-start justify-between gap-3">
                                    <b className="line-clamp-2 min-w-0 text-sm leading-snug">{item.nama_pekerjaan}</b>
                                    <span className="shrink-0 text-xs font-bold text-[#4cceac]">{item.progress}%</span>
                                </div>
                                <p className="mt-1 min-w-0 break-words text-xs text-slate-500">Target: {formatDate(item.target_selesai)} · {item.petugas?.name ?? "-"}</p>
                                <div className="mt-2 h-2 rounded-full bg-[#29314b]"><div className="h-2 rounded-full bg-[#4cceac]" style={{ width: `${item.progress}%` }} /></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 page-card min-w-0">
                <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Pekerjaan Terbaru</h2><Link href="/pekerjaan" className="text-sm font-semibold text-sky-950">Lihat semua</Link></div>
                <div className="table-shell"><table className="data-table min-w-[980px] table-fixed"><thead><tr><th className="w-36">Kode</th><th>Pekerjaan</th><th className="w-40">Cabang</th><th className="w-36">Kategori</th><th className="w-40">Progress</th><th className="w-32 text-center">Status</th><th className="w-24">Aksi</th></tr></thead><tbody>{recentPekerjaan.map((p) => <tr key={p.id}><td className="table-nowrap font-medium text-[#4cceac]">{p.kode_pekerjaan}</td><td><div className="truncate" title={p.nama_pekerjaan}>{p.nama_pekerjaan}</div></td><td>{p.cabang?.nama_cabang ?? "-"}</td><td>{p.kategori?.nama_kategori ?? "-"}</td><td><div className="progress-cell"><div className="progress-bar"><div className="h-2 rounded-full bg-[#4cceac]" style={{ width: `${p.progress}%` }} /></div><span className="progress-value">{p.progress}%</span></div></td><td className="text-center"><StatusBadge value={p.status} /></td><td><Link href={`/pekerjaan/${p.id}`} className="icon-btn" title="Lihat detail"><Eye size={15} /></Link></td></tr>)}</tbody></table></div>
            </div>
        </AppLayout>
    );
}

function TrendLineChart({ data = [] }) {
    const width = 760;
    const height = 240;
    const padding = 36;
    const max = Math.max(1, ...data.map((row) => Math.max(row.program ?? 0, row.selesai ?? 0)));
    const x = (index) => padding + (index * (width - padding * 2)) / Math.max(1, data.length - 1);
    const y = (value) => height - padding - (Number(value ?? 0) / max) * (height - padding * 2);
    const line = (key) => data.map((row, index) => `${x(index)},${y(row[key])}`).join(" ");

    return (
        <div className="min-w-0 overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full max-w-full sm:h-64" role="img" aria-label="Trend program kerja dan pekerjaan selesai">
                {[0, 1, 2, 3, 4].map((step) => {
                    const value = Math.round((max / 4) * step);
                    const yy = y(value);
                    return <g key={step}><line x1={padding} x2={width - padding} y1={yy} y2={yy} stroke="currentColor" className="text-slate-200" strokeWidth="1" /><text x={8} y={yy + 4} className="fill-slate-400 text-[11px]">{value}</text></g>;
                })}
                <polyline points={line("program")} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={line("selesai")} fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {data.map((row, index) => <g key={row.month}><circle cx={x(index)} cy={y(row.program)} r="4" fill="#2563eb" /><circle cx={x(index)} cy={y(row.selesai)} r="4" fill="#16a34a" /><text x={x(index)} y={height - 8} textAnchor="middle" className="fill-slate-500 text-[11px]">{row.month}</text></g>)}
            </svg>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500"><span><b className="text-blue-600">—</b> Program dibuat</span><span><b className="text-green-600">—</b> Pekerjaan selesai</span></div>
        </div>
    );
}
