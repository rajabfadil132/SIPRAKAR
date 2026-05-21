import EmptyState from "@/Components/EmptyState";
import Pagination from "@/Components/Pagination";
import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { Edit3, Eye, Plus, Search, ShieldCheck, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { useServerTableFilter } from "@/Utils/useServerTableFilter";


function StatusPill({ value }) {
    const active = value === "active" || value === 1 || value === true;
    const suspended = value === "suspended";
    return <span className={`badge ${active ? "bg-emerald-500/15 text-emerald-300" : suspended ? "bg-amber-500/15 text-amber-300" : "bg-red-500/15 text-red-300"}`}>{value ?? "-"}</span>;
}

export default function Index({ items, filters = {}, permissions = {}, canManagePermissions = false }) {
    const rows = items?.data ?? [];
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");
    useServerTableFilter("/users-management", { search, status }, filters);

    return (
        <AppLayout title="User Management">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <p className="text-sm text-slate-500">Kelola pengguna, role, cabang, status akun, dan hak akses role.</p>
                <div className="flex flex-wrap gap-2">
                    {canManagePermissions && <Link href="/role-permissions" className="btn-light"><ShieldCheck size={16} className="mr-2" />Hak Akses Role</Link>}
                    {permissions["users.create"] && <Link href="/users-management/create" className="btn-primary"><Plus size={16} className="mr-2" />Tambah User</Link>}
                </div>
            </div>
            <div className="page-card">
                <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px_auto]">
                    <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" placeholder="Cari nama, email, role, cabang..." type="search" /></div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="input"><option value="">Semua status</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option></select>
                    <button className="btn-light justify-center" type="button" onClick={() => { setSearch(""); setStatus(""); }}><XCircle size={16} className="mr-2" />Reset</button>
                </div>
                {rows.length === 0 ? <EmptyState /> : (
                    <div className="table-shell">
                        <table className="data-table min-w-[1080px] table-fixed">
                            <thead><tr><th>User</th><th className="w-64">Email</th><th className="w-36">Role</th><th className="w-44">Cabang</th><th className="w-28 text-center">Status</th><th className="w-40 text-right">Aksi</th></tr></thead>
                            <tbody>{rows.map((u) => <tr key={u.id}><td><b>{u.name}</b><p className="text-xs text-slate-500">{u.phone ?? "-"}</p></td><td className="table-nowrap">{u.email}</td><td>{u.role?.nama_role ?? "-"}</td><td>{u.cabang?.nama_cabang ?? "-"}</td><td className="text-center"><StatusPill value={u.status} /></td><td className="text-right"><div className="table-actions">{permissions["users.show"] && <Link href={`/users-management/${u.id}`} className="icon-btn" title="Lihat detail"><Eye size={15} /></Link>}{permissions["users.edit"] && <Link href={`/users-management/${u.id}/edit`} className="icon-btn" title="Edit"><Edit3 size={15} /></Link>}{permissions["users.delete"] && <button type="button" className="icon-btn-danger" onClick={() => confirm("Hapus user ini?") && router.delete(`/users-management/${u.id}`, { preserveScroll: true })} title="Hapus"><Trash2 size={15} /></button>}</div></td></tr>)}</tbody>
                        </table>
                    </div>
                )}
                <Pagination meta={items} />
            </div>
        </AppLayout>
    );
}
