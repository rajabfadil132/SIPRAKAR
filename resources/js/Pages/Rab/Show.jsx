import AuditInfo from "@/Components/AuditInfo";
import StatusBadge from "@/Components/StatusBadge";
import AppLayout from "@/Layouts/AppLayout";
import { formatDate } from "@/Utils/date";
import { Link } from "@inertiajs/react";
import { Edit3, Eye } from "lucide-react";

const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value ?? 0));
function Info({ label, value }) { return <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><b>{value || "-"}</b></div>; }

export default function Show({ item, permissions = {} }) {
    return (
        <AppLayout title="Detail RAB">
            <div className="mb-5 flex flex-wrap justify-between gap-3">
                <Link href="/rab" className="btn-light">Kembali</Link>
                <div className="flex gap-2">{permissions["pekerjaan.show"] && <Link href={`/pekerjaan/${item.pekerjaan_id}`} className="btn-light"><Eye size={16} className="mr-2" />Detail Pekerjaan</Link>}{permissions["rab.edit"] && <Link href={`/rab/${item.id}/edit`} className="btn-primary"><Edit3 size={16} className="mr-2" />Edit RAB</Link>}</div>
            </div>
            <div className="space-y-6">
                <div className="space-y-6">
                    <div className="page-card">
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-slate-500">{item.nomor_rab}</p><h2 className="text-2xl font-black">{item.pekerjaan?.nama_pekerjaan ?? "-"}</h2></div><StatusBadge value={item.status_rab} /></div>
                        <div className="grid gap-4 md:grid-cols-3"><Info label="Tanggal RAB" value={formatDate(item.tanggal_rab)} /><Info label="Total RAB" value={rupiah(item.total_rab)} /><Info label="Cabang" value={item.pekerjaan?.cabang?.nama_cabang} /><Info label="Kategori" value={item.pekerjaan?.kategori?.nama_kategori} /><Info label="Petugas" value={item.pekerjaan?.petugas?.name} /><Info label="Catatan" value={item.catatan} /></div>
                    </div>
                    <div className="page-card">
                        <h2 className="mb-4 font-bold">Detail Item RAB</h2>
                        <div className="table-shell"><table className="data-table min-w-[900px] table-fixed"><thead><tr><th>Item</th><th className="w-28 text-right">Volume</th><th className="w-36 text-right">Harga</th><th className="w-36 text-right">Subtotal</th></tr></thead><tbody>{(item.details ?? []).map((d) => <tr key={d.id}><td><b>{d.nama_item}</b><p className="text-xs text-slate-500">{d.spesifikasi ?? "-"}</p></td><td className="text-right">{d.volume} {d.satuan}</td><td className="text-right">{rupiah(d.harga_satuan)}</td><td className="text-right font-bold">{rupiah(d.subtotal)}</td></tr>)}</tbody></table></div>
                    </div>
                </div>
                <div className="space-y-6"><div className="page-card"><h2 className="mb-4 font-bold">Riwayat RAB</h2><AuditInfo item={item} /></div><div className="page-card"><h2 className="mb-4 font-bold">Riwayat Item RAB</h2><div className="space-y-3">{(item.details ?? []).map((d) => <div key={d.id} className="rounded-2xl border border-[#29314b] bg-[#141b2d] p-3"><b>{d.nama_item}</b><AuditInfo item={d} /></div>)}</div></div></div>
            </div>
        </AppLayout>
    );
}
