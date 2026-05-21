import AuditInfo from "@/Components/AuditInfo";
import EmptyState from "@/Components/EmptyState";
import AppLayout from "@/Layouts/AppLayout";
import { router, useForm } from "@inertiajs/react";
import { Edit3, Eye, Plus, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

const tabs = [
    { key: "cabangs", label: "Cabang Kampus" },
    { key: "lembagas", label: "Lembaga" },
    { key: "lokasis", label: "Lokasi/Ruangan" },
    { key: "kategoris", label: "Kategori Pekerjaan" },
];

const emptyByType = {
    cabangs: { nama_cabang: "", kode: "", alamat: "", keterangan: "", status: "active" },
    lembagas: { cabang_id: "", nama_lembaga: "", penanggung_jawab: "", keterangan: "", status: "active" },
    lokasis: { cabang_id: "", nama_gedung: "", lantai: "", ruangan: "", keterangan: "", status: "active" },
    kategoris: { nama_kategori: "", keterangan: "", status: "active" },
};

function StatusPill({ value }) { return <span className={`badge ${value === "active" ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-300"}`}>{value === "active" ? "Aktif" : "Nonaktif"}</span>; }
function nameOf(row) { return row.nama_cabang ?? row.nama_lembaga ?? row.nama_gedung ?? row.nama_kategori ?? "-"; }
function relationOf(row, active) { if (active === "cabangs") return row.kode; if (active === "lokasis") return [row.cabang?.nama_cabang, row.lantai, row.ruangan].filter(Boolean).join(" · "); return row.cabang?.nama_cabang ?? "-"; }

function MasterForm({ type, cabangs, item, onClose }) {
    const form = useForm(item ? { ...emptyByType[type], ...item } : emptyByType[type]);
    const submit = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: onClose };
        item ? form.put(`/master-data/${type}/${item.id}`, options) : form.post(`/master-data/${type}`, options);
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
            <form onSubmit={submit} className="w-full max-w-2xl rounded-3xl border border-[#29314b] bg-[#1F2A40] p-6 text-[#e0e0e0] shadow-2xl">
                <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="text-xl font-black">{item ? "Edit" : "Tambah"} {tabs.find((tab) => tab.key === type)?.label}</h2><p className="text-sm text-slate-500">Master data menjadi referensi relasi sistem.</p></div><button type="button" onClick={onClose} className="rounded-xl border border-[#29314b] p-2 hover:border-[#6870fa]"><X size={18} /></button></div>
                <div className="grid gap-3 md:grid-cols-2">
                    {["lembagas", "lokasis"].includes(type) && <label className="block text-sm md:col-span-2">Cabang Kampus<select className="input mt-1" value={form.data.cabang_id ?? ""} onChange={(e) => form.setData("cabang_id", e.target.value)} required><option value="">Pilih cabang</option>{cabangs.map((c) => <option key={c.id} value={c.id}>{c.nama_cabang}</option>)}</select></label>}
                    {type === "cabangs" && <><label className="block text-sm">Nama Cabang<input className="input mt-1" value={form.data.nama_cabang} onChange={(e) => form.setData("nama_cabang", e.target.value)} required /></label><label className="block text-sm">Kode<input className="input mt-1" value={form.data.kode} onChange={(e) => form.setData("kode", e.target.value.toUpperCase())} maxLength="10" required /></label><label className="block text-sm md:col-span-2">Alamat<textarea className="input mt-1 min-h-24" value={form.data.alamat ?? ""} onChange={(e) => form.setData("alamat", e.target.value)} /></label></>}
                    {type === "lembagas" && <><label className="block text-sm">Nama Lembaga<input className="input mt-1" value={form.data.nama_lembaga} onChange={(e) => form.setData("nama_lembaga", e.target.value)} required /></label><label className="block text-sm">Penanggung Jawab<input className="input mt-1" value={form.data.penanggung_jawab ?? ""} onChange={(e) => form.setData("penanggung_jawab", e.target.value)} /></label></>}
                    {type === "lokasis" && <><label className="block text-sm">Nama Gedung<input className="input mt-1" value={form.data.nama_gedung} onChange={(e) => form.setData("nama_gedung", e.target.value)} required /></label><label className="block text-sm">Lantai<input className="input mt-1" value={form.data.lantai ?? ""} onChange={(e) => form.setData("lantai", e.target.value)} /></label><label className="block text-sm">Ruangan<input className="input mt-1" value={form.data.ruangan ?? ""} onChange={(e) => form.setData("ruangan", e.target.value)} /></label></>}
                    {type === "kategoris" && <label className="block text-sm md:col-span-2">Nama Kategori<input className="input mt-1" value={form.data.nama_kategori} onChange={(e) => form.setData("nama_kategori", e.target.value)} required /></label>}
                    <label className="block text-sm">Status<select className="input mt-1" value={form.data.status} onChange={(e) => form.setData("status", e.target.value)}><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></label>
                    <label className="block text-sm md:col-span-2">Keterangan<textarea className="input mt-1 min-h-24" value={form.data.keterangan ?? ""} onChange={(e) => form.setData("keterangan", e.target.value)} /></label>
                </div>
                {Object.keys(form.errors).length > 0 && <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">Periksa kembali field yang wajib diisi.</div>}
                <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="btn-light">Batal</button><button className="btn-primary" disabled={form.processing}>Simpan</button></div>
            </form>
        </div>
    );
}

function DetailModal({ type, item, onClose }) {
    if (!item) return null;
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-3xl border border-[#29314b] bg-[#1F2A40] p-6 text-[#e0e0e0] shadow-2xl">
                <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="text-xl font-black">Detail {tabs.find((tab) => tab.key === type)?.label}</h2><p className="text-sm text-slate-500">{nameOf(item)}</p></div><button type="button" onClick={onClose} className="rounded-xl border border-[#29314b] p-2 hover:border-[#6870fa]"><X size={18} /></button></div>
                <div className="grid gap-4 md:grid-cols-2"><Info label="Nama" value={nameOf(item)} /><Info label="Relasi/Kode" value={relationOf(item, type)} /><Info label="Status" value={item.status === "active" ? "Aktif" : "Nonaktif"} /><Info label="Keterangan" value={item.keterangan ?? item.alamat} /></div>
                <div className="mt-6"><h3 className="mb-3 font-bold">Riwayat</h3><AuditInfo item={item} /></div>
            </div>
        </div>
    );
}

function Info({ label, value }) { return <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><b>{value || "-"}</b></div>; }

export default function Index({ cabangs = [], lembagas = [], lokasis = [], kategoris = [], permissions = {} }) {
    const [active, setActive] = useState("cabangs");
    const [editing, setEditing] = useState(null);
    const [detail, setDetail] = useState(null);
    const [search, setSearch] = useState("");
    const data = useMemo(() => ({ cabangs, lembagas, lokasis, kategoris }), [cabangs, lembagas, lokasis, kategoris]);
    const rows = (data[active] ?? []).filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));

    return (
        <AppLayout title="Master Data">
            <p className="mb-6 text-sm text-slate-500">Kelola data referensi seperti cabang kampus, lembaga, lokasi/ruangan, dan kategori.</p>
            <div className="page-card">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab.key} onClick={() => setActive(tab.key)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${active === tab.key ? "bg-[#6870fa] text-white" : "bg-[#29314b] text-[#a3a3a3] hover:text-white"}`}>{tab.label}</button>)}</div>{permissions["master_data.create"] && <button className="btn-primary" onClick={() => setEditing({ type: active, item: null })}><Plus size={16} className="mr-2" />Tambah Data</button>}</div>
                <div className="relative mb-5 max-w-xl"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="input pl-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari data master pada tab aktif..." type="search" /></div>
                {rows.length === 0 ? <EmptyState /> : <div className="table-shell"><table className="data-table min-w-[980px] table-fixed"><thead><tr><th>Nama</th><th className="w-56">Relasi/Kode</th><th>Keterangan</th><th className="w-28 text-center">Status</th><th className="w-36 text-right">Aksi</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td className="font-semibold"><div className="truncate" title={nameOf(row)}>{nameOf(row)}</div></td><td>{relationOf(row, active)}</td><td className="max-w-md text-slate-500"><div className="truncate" title={row.keterangan ?? row.alamat}>{row.keterangan ?? row.alamat ?? "-"}</div></td><td className="text-center"><StatusPill value={row.status} /></td><td className="text-right"><div className="table-actions"><button className="icon-btn" onClick={() => setDetail({ type: active, item: row })} title="Lihat detail"><Eye size={14} /></button>{permissions["master_data.edit"] && <button className="icon-btn" onClick={() => setEditing({ type: active, item: row })} title="Edit"><Edit3 size={14} /></button>}{permissions["master_data.delete"] && <button className="icon-btn-danger" onClick={() => confirm("Hapus master data ini?") && router.delete(`/master-data/${active}/${row.id}`, { preserveScroll: true })} title="Hapus"><Trash2 size={14} /></button>}</div></td></tr>)}</tbody></table></div>}
            </div>
            {editing && <MasterForm type={editing.type} item={editing.item} cabangs={cabangs} onClose={() => setEditing(null)} />}
            {detail && <DetailModal type={detail.type} item={detail.item} onClose={() => setDetail(null)} />}
        </AppLayout>
    );
}
