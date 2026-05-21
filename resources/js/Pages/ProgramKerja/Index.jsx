import EmptyState from "@/Components/EmptyState";
import Pagination from "@/Components/Pagination";
import PriorityBadge from "@/Components/PriorityBadge";
import StatusBadge from "@/Components/StatusBadge";
import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { Edit3, Eye, Plus, Search, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { useServerTableFilter } from "@/Utils/useServerTableFilter";

const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value ?? 0));

export default function Index({ items, filters = {}, permissions = {} }) {
    const rows = items?.data ?? [];
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");
    useServerTableFilter("/program-kerja", { search, status }, filters);

    return (
        <AppLayout title="Program Kerja">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <p className="text-sm text-slate-500">Rencana tahunan, target, prioritas, estimasi anggaran, dan status program kerja.</p>
                {permissions["program_kerja.create"] && (
                    <Link href="/program-kerja/create" className="btn-primary"><Plus size={16} className="mr-2" />Tambah Program</Link>
                )}
            </div>

            <div className="page-card">
                <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px_auto]">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" placeholder="Cari kode, nama program, cabang, kategori..." type="search" />
                    </div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
                        <option value="">Semua status</option>
                        <option>Draft</option><option>Direncanakan</option><option>Disetujui</option><option>Berjalan</option><option>Selesai</option><option>Tertunda</option><option>Dibatalkan</option>
                    </select>
                    <button className="btn-light justify-center" type="button" onClick={() => { setSearch(""); setStatus(""); }}><XCircle size={16} className="mr-2" />Reset</button>
                </div>

                {rows.length === 0 ? <EmptyState /> : (
                    <div className="table-shell">
                        <table className="data-table min-w-[1240px] table-fixed">
                            <thead>
                                <tr>
                                    <th className="w-40">Kode</th>
                                    <th className="w-[320px]">Program</th>
                                    <th className="w-48">Cabang</th>
                                    <th className="w-40">Kategori</th>
                                    <th className="w-36">Prioritas</th>
                                    <th className="w-44 text-right">Anggaran</th>
                                    <th className="w-36 text-center">Status</th>
                                    <th className="w-40 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((x) => (
                                    <tr key={x.id}>
                                        <td className="table-nowrap font-semibold text-[#4cceac]">{x.kode_program}</td>
                                        <td><div className="max-w-[300px] truncate font-bold" title={x.nama_program}>{x.nama_program}</div></td>
                                        <td><div className="max-w-[170px] truncate" title={x.cabang?.nama_cabang}>{x.cabang?.nama_cabang ?? "-"}</div></td>
                                        <td><div className="max-w-[140px] truncate" title={x.kategori?.nama_kategori}>{x.kategori?.nama_kategori ?? "-"}</div></td>
                                        <td className="table-nowrap"><PriorityBadge value={x.prioritas} /></td>
                                        <td className="table-currency font-semibold">{rupiah(x.estimasi_anggaran)}</td>
                                        <td className="text-center"><StatusBadge value={x.status} /></td>
                                        <td className="text-right">
                                            <div className="table-actions">
                                                {permissions["program_kerja.show"] && <Link className="icon-btn" href={`/program-kerja/${x.id}`} title="Lihat detail"><Eye size={15} /></Link>}
                                                {permissions["program_kerja.edit"] && <Link className="icon-btn" href={`/program-kerja/${x.id}/edit`} title="Edit"><Edit3 size={15} /></Link>}
                                                {permissions["program_kerja.delete"] && <button className="icon-btn-danger" type="button" onClick={() => confirm("Hapus program kerja ini?") && router.delete(`/program-kerja/${x.id}`, { preserveScroll: true })} title="Hapus"><Trash2 size={15} /></button>}
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
