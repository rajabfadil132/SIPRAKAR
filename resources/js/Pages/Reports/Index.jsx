import EmptyState from "@/Components/EmptyState";
import Pagination from "@/Components/Pagination";
import StatusBadge from "@/Components/StatusBadge";
import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import { Eye, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { useServerTableFilter } from "@/Utils/useServerTableFilter";

const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value ?? 0));

export default function Index({ items, summary, filters = {} }) {
    const rows = items?.data ?? [];
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");
    useServerTableFilter("/reports", { search, status }, filters);

    return (
        <AppLayout title="Laporan & Statistik">
            <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="stat-card"><p className="text-sm text-slate-500">Total data laporan</p><h3 className="text-3xl font-black">{summary.total}</h3></div>
                <div className="stat-card"><p className="text-sm text-slate-500">Rata-rata progress</p><h3 className="text-3xl font-black">{summary.avg_progress}%</h3></div>
            </div>
            <div className="page-card">
                <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px_auto]">
                    <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" placeholder="Cari pekerjaan, kode, cabang, kategori, petugas..." type="search" /></div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="input"><option value="">Semua status</option><option>Belum dilaksanakan</option><option>Sedang berjalan</option><option>Selesai</option><option>Tertunda</option><option>Dibatalkan</option></select>
                    <button className="btn-light justify-center" type="button" onClick={() => { setSearch(""); setStatus(""); }}><XCircle size={16} className="mr-2" />Reset</button>
                </div>
                {rows.length === 0 ? <EmptyState /> : (
                    <div className="table-shell">
                        <table className="data-table min-w-[1320px] table-fixed">
                            <thead>
                                <tr>
                                    <th className="w-40">Kode</th>
                                    <th className="w-[320px]">Pekerjaan</th>
                                    <th className="w-44">Cabang</th>
                                    <th className="w-44">Kategori</th>
                                    <th className="w-44">Petugas</th>
                                    <th className="w-40">Progress</th>
                                    <th className="w-44">Total RAB</th>
                                    <th className="w-36 text-center">Status</th>
                                    <th className="w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((p) => (
                                    <tr key={p.id}>
                                        <td className="table-nowrap font-semibold text-[#4cceac]">{p.kode_pekerjaan}</td>
                                        <td><div className="max-w-[300px] truncate font-semibold" title={p.nama_pekerjaan}>{p.nama_pekerjaan}</div></td>
                                        <td><div className="max-w-[160px] truncate" title={p.cabang?.nama_cabang}>{p.cabang?.nama_cabang ?? "-"}</div></td>
                                        <td><div className="max-w-[160px] truncate" title={p.kategori?.nama_kategori}>{p.kategori?.nama_kategori ?? "-"}</div></td>
                                        <td><div className="max-w-[160px] truncate" title={p.petugas?.name}>{p.petugas?.name ?? "-"}</div></td>
                                        <td><div className="progress-cell"><div className="progress-bar"><div className="h-2 rounded-full bg-[#4cceac]" style={{ width: `${p.progress}%` }} /></div><span className="progress-value">{p.progress}%</span></div></td>
                                        <td><div className="table-currency max-w-[160px] truncate font-semibold" title={rupiah(p.rab?.total_rab)}>{rupiah(p.rab?.total_rab)}</div></td>
                                        <td className="text-center"><StatusBadge value={p.status} /></td>
                                        <td><Link className="icon-btn" href={`/pekerjaan/${p.id}`} title="Lihat detail"><Eye size={15} /></Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination meta={items} />
            </div>
        </AppLayout>
    );
}
