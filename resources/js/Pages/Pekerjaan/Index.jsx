import EmptyState from "@/Components/EmptyState";
import Pagination from "@/Components/Pagination";
import StatusBadge from "@/Components/StatusBadge";
import AppLayout from "@/Layouts/AppLayout";
import { formatDate } from "@/Utils/date";
import { Link, router } from "@inertiajs/react";
import { Edit3, Eye, FileSpreadsheet, Plus, Search, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { useServerTableFilter } from "@/Utils/useServerTableFilter";

const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value ?? 0));
function RabInfo({ pekerjaan }) {
    if (!pekerjaan.rab) {
        return <div className="flex h-full min-h-10 items-center justify-start"><span className="badge bg-slate-500/15 text-slate-300">Tanpa RAB</span></div>;
    }

    return (
        <div className="flex min-w-0 flex-col items-start justify-center gap-1 leading-tight">
            <span className="badge bg-emerald-500/15 text-emerald-300">{pekerjaan.rab.status_rab}</span>
            <span className="table-currency max-w-full truncate font-semibold text-slate-500" title={rupiah(pekerjaan.rab.total_rab)}>
                {rupiah(pekerjaan.rab.total_rab)}
            </span>
        </div>
    );
}

export default function Index({ items, filters = {}, permissions = {} }) {
    const rows = items?.data ?? [];
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");
    useServerTableFilter("/pekerjaan", { search, status }, filters);

    return (
        <AppLayout title="Data Pekerjaan">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <p className="text-sm text-slate-500">Kelola pekerjaan sarana prasarana, petugas, status, progress, dan RAB.</p>
                {permissions["pekerjaan.create"] && <Link href="/pekerjaan/create" className="btn-primary"><Plus size={16} className="mr-2" />Tambah Pekerjaan</Link>}
            </div>

            <div className="page-card">
                <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px_auto]">
                    <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" placeholder="Cari kode, pekerjaan, cabang, kategori, petugas..." type="search" /></div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="input"><option value="">Semua status</option><option>Belum dilaksanakan</option><option>Sedang berjalan</option><option>Selesai</option><option>Tertunda</option><option>Dibatalkan</option></select>
                    <button className="btn-light justify-center" type="button" onClick={() => { setSearch(""); setStatus(""); }}><XCircle size={16} className="mr-2" />Reset</button>
                </div>

                {rows.length === 0 ? <EmptyState /> : (
                    <div className="table-shell">
                        <table className="data-table min-w-[1420px] table-fixed">
                            <thead>
                                <tr>
                                    <th className="w-40">Kode</th>
                                    <th className="w-[320px]">Nama Pekerjaan</th>
                                    <th className="w-44">Cabang</th>
                                    <th className="w-44">Petugas</th>
                                    <th className="w-36">Target</th>
                                    <th className="w-40">Progress</th>
                                    <th className="w-48">RAB</th>
                                    <th className="w-36 text-center">Status</th>
                                    <th className="w-48 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((p) => (
                                    <tr key={p.id}>
                                        <td className="table-nowrap font-semibold text-[#4cceac]">{p.kode_pekerjaan}</td>
                                        <td><div className="max-w-[300px] truncate font-bold" title={p.nama_pekerjaan}>{p.nama_pekerjaan}</div><p className="line-clamp-1 text-xs text-slate-500">{p.kategori?.nama_kategori ?? "-"}</p></td>
                                        <td><div className="max-w-[160px] truncate" title={p.cabang?.nama_cabang}>{p.cabang?.nama_cabang ?? "-"}</div></td>
                                        <td><div className="max-w-[160px] truncate" title={p.petugas?.name}>{p.petugas?.name ?? "-"}</div></td>
                                        <td className="table-nowrap">{formatDate(p.target_selesai)}</td>
                                        <td><div className="progress-cell"><div className="progress-bar"><div className="h-2 rounded-full bg-[#4cceac]" style={{ width: `${p.progress}%` }} /></div><span className="progress-value">{p.progress}%</span></div></td>
                                        <td><RabInfo pekerjaan={p} /></td>
                                        <td className="text-center"><StatusBadge value={p.status} /></td>
                                        <td className="text-right">
                                            <div className="table-actions">
                                                {permissions["pekerjaan.show"] && <Link className="icon-btn" href={`/pekerjaan/${p.id}`} title="Lihat detail"><Eye size={15} /></Link>}
                                                {p.rab && permissions["rab.view"] && <Link className="icon-btn" href={`/rab/${p.rab.id}`} title="Detail RAB"><FileSpreadsheet size={15} /></Link>}
                                                {!p.rab && permissions["rab.create"] && <Link className="icon-btn" href={`/rab/create?pekerjaan_id=${p.id}`} title="Buat RAB"><FileSpreadsheet size={15} /></Link>}
                                                {permissions["pekerjaan.edit"] && <Link className="icon-btn" href={`/pekerjaan/${p.id}/edit`} title="Edit"><Edit3 size={15} /></Link>}
                                                {permissions["pekerjaan.delete"] && <button type="button" className="icon-btn-danger" onClick={() => confirm("Hapus pekerjaan ini?") && router.delete(`/pekerjaan/${p.id}`, { preserveScroll: true })} title="Hapus"><Trash2 size={15} /></button>}
                                            </div>
                                        </td>
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
