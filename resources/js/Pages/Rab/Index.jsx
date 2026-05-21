import EmptyState from "@/Components/EmptyState";
import Pagination from "@/Components/Pagination";
import StatusBadge from "@/Components/StatusBadge";
import AppLayout from "@/Layouts/AppLayout";
import { formatDate } from "@/Utils/date";
import { Link, router } from "@inertiajs/react";
import { Edit3, Eye, Plus, Search, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { useServerTableFilter } from "@/Utils/useServerTableFilter";

const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value ?? 0));

export default function Index({ items, filters = {}, permissions = {} }) {
    const rows = items?.data ?? [];
    const [search, setSearch] = useState(filters.search ?? "");
    useServerTableFilter("/rab", { search }, filters);

    return (
        <AppLayout title="RAB Pekerjaan">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <p className="text-sm text-slate-500">Kelola pengajuan dan detail item RAB pekerjaan.</p>
                {permissions["rab.create"] && <Link href="/rab/create" className="btn-primary"><Plus size={16} className="mr-2" />Tambah RAB</Link>}
            </div>
            <div className="page-card">
                <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto]">
                    <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" placeholder="Cari nomor RAB, pekerjaan, cabang, status..." type="search" /></div>
                    <button className="btn-light justify-center" type="button" onClick={() => setSearch("")}><XCircle size={16} className="mr-2" />Reset</button>
                </div>
                {rows.length === 0 ? <EmptyState /> : (
                    <div className="table-shell">
                        <table className="data-table min-w-[1080px] table-fixed">
                            <thead><tr><th className="w-44">Nomor</th><th>Pekerjaan</th><th className="w-44">Cabang</th><th className="w-32">Tanggal</th><th className="w-40 text-right">Total</th><th className="w-32 text-center">Status</th><th className="w-36 text-right">Aksi</th></tr></thead>
                            <tbody>{rows.map((x) => <tr key={x.id}><td className="table-nowrap font-semibold text-[#4cceac]">{x.nomor_rab}</td><td><div className="truncate font-semibold" title={x.pekerjaan?.nama_pekerjaan}>{x.pekerjaan?.nama_pekerjaan ?? "-"}</div><p className="text-xs text-slate-500">{x.pekerjaan?.kategori?.nama_kategori ?? "-"}</p></td><td>{x.pekerjaan?.cabang?.nama_cabang ?? "-"}</td><td className="table-nowrap">{formatDate(x.tanggal_rab)}</td><td className="table-currency font-semibold">{rupiah(x.total_rab)}</td><td className="text-center"><StatusBadge value={x.status_rab} /></td><td className="text-right"><div className="table-actions">{permissions["rab.view"] && <Link className="icon-btn" href={`/rab/${x.id}`} title="Lihat detail"><Eye size={15} /></Link>}{permissions["rab.edit"] && <Link className="icon-btn" href={`/rab/${x.id}/edit`} title="Edit"><Edit3 size={15} /></Link>}{permissions["rab.delete"] && <button type="button" className="icon-btn-danger" title="Hapus" onClick={() => confirm("Hapus RAB ini?") && router.delete(`/rab/${x.id}`, { preserveScroll: true })}><Trash2 size={15} /></button>}</div></td></tr>)}</tbody>
                        </table>
                    </div>
                )}
                <Pagination meta={items} />
            </div>
        </AppLayout>
    );
}
