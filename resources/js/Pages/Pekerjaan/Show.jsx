import AuditInfo from "@/Components/AuditInfo";
import StatusBadge from "@/Components/StatusBadge";
import AppLayout from "@/Layouts/AppLayout";
import { formatDate } from "@/Utils/date";
import { Link, router } from "@inertiajs/react";
import { CheckCircle2, Edit3, FileSpreadsheet, Trash2 } from "lucide-react";

const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value ?? 0));

export default function Show({ item, permissions = {} }) {
    const toggleChecklist = (checklist) => {
        router.patch(`/pekerjaan/${item.id}/checklist/${checklist.id}`, { is_done: !checklist.is_done }, { preserveScroll: true });
    };

    return (
        <AppLayout title={item.nama_pekerjaan}>
            <div className="mb-5 flex flex-wrap justify-between gap-2">
                <Link href="/pekerjaan" className="btn-light">Kembali</Link>
                <div className="flex flex-wrap gap-2">
                    {item.rab && permissions["rab.view"] && <Link href={`/rab/${item.rab.id}`} className="btn-light"><FileSpreadsheet size={16} className="mr-2" />Detail RAB</Link>}
                    {!item.rab && permissions["rab.create"] && <Link href={`/rab/create?pekerjaan_id=${item.id}`} className="btn-light"><FileSpreadsheet size={16} className="mr-2" />Buat RAB</Link>}
                    {permissions["pekerjaan.edit"] && <Link href={`/pekerjaan/${item.id}/edit`} className="btn-light"><Edit3 size={16} className="mr-2" />Edit</Link>}
                    {permissions["pekerjaan.delete"] && <button type="button" className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10" onClick={() => confirm("Hapus pekerjaan ini?") && router.delete(`/pekerjaan/${item.id}`)}><Trash2 size={16} className="mr-2 inline" />Hapus</button>}
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-6">
                    <div className="page-card">
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                            <div><b className="text-[#4cceac]">{item.kode_pekerjaan}</b><p className="mt-1 text-sm text-slate-500">{item.program_kerja?.nama_program ?? "Tanpa program kerja"}</p></div>
                            <StatusBadge value={item.status} />
                        </div>
                        <p className="text-slate-600">{item.deskripsi ?? "Belum ada deskripsi."}</p>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <Info label="Cabang" value={item.cabang?.nama_cabang} />
                            <Info label="Lokasi" value={[item.lokasi?.nama_gedung, item.lokasi?.lantai, item.lokasi?.ruangan].filter(Boolean).join(" · ")} />
                            <Info label="Kategori" value={item.kategori?.nama_kategori} />
                            <Info label="Penanggung Jawab" value={item.penanggung_jawab?.name} />
                            <Info label="Petugas" value={item.petugas?.name} />
                            <Info label="Target Selesai" value={formatDate(item.target_selesai)} />
                        </div>
                        <div className="mt-6">
                            <div className="mb-2 flex justify-between text-sm"><span>Progress</span><b>{item.progress}%</b></div>
                            <div className="h-3 rounded-full bg-[#29314b]"><div className="h-3 rounded-full bg-[#4cceac]" style={{ width: `${item.progress}%` }} /></div>
                        </div>
                    </div>

                    <div className="page-card">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div><h2 className="font-bold">Checklist Detail Pekerjaan</h2><p className="text-sm text-slate-500">Mencentang checklist akan langsung menghitung ulang progress pekerjaan.</p></div>
                            <CheckCircle2 className="text-[#4cceac]" />
                        </div>
                        <div className="space-y-3">
                            {(item.checklists ?? []).map((checklist) => (
                                <label key={checklist.id} className="flex items-start gap-3 rounded-2xl border border-[#29314b] bg-[#141b2d] p-4">
                                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-[#29314b] bg-[#141b2d] text-[#6870fa] focus:ring-[#6870fa]" checked={Boolean(checklist.is_done)} disabled={!permissions["pekerjaan.progress"]} onChange={() => toggleChecklist(checklist)} />
                                    <span className="flex-1">
                                        <b className={checklist.is_done ? "line-through opacity-70" : ""}>{checklist.deskripsi}</b>
                                        <span className="mt-1 block text-xs text-slate-500">{checklist.is_done ? `Selesai oleh ${checklist.completer?.name ?? "-"} pada ${formatDate(checklist.completed_at)}` : "Belum selesai"}</span>
                                    </span>
                                </label>
                            ))}
                            {(item.checklists ?? []).length === 0 && <p className="text-sm text-slate-500">Belum ada checklist. Tambahkan dari form edit pekerjaan.</p>}
                        </div>
                    </div>

                    <div className="page-card">
                        <h2 className="mb-4 font-bold">RAB</h2>
                        {item.rab ? (
                            <div className="space-y-4">
                                <div className="grid gap-3 md:grid-cols-3"><Info label="Nomor RAB" value={item.rab.nomor_rab} /><Info label="Status RAB" value={item.rab.status_rab} /><Info label="Total RAB" value={rupiah(item.rab.total_rab)} /></div>
                                <div className="table-shell">
                                    <table className="data-table min-w-[760px] table-fixed">
                                        <thead><tr><th>Item</th><th className="w-28 text-right">Volume</th><th className="w-36 text-right">Harga</th><th className="w-36 text-right">Subtotal</th></tr></thead>
                                        <tbody>{(item.rab.details ?? []).map((d) => <tr key={d.id}><td><b>{d.nama_item}</b><p className="text-xs text-slate-500">{d.spesifikasi ?? "-"}</p></td><td className="text-right">{d.volume} {d.satuan}</td><td className="text-right">{rupiah(d.harga_satuan)}</td><td className="text-right font-bold">{rupiah(d.subtotal)}</td></tr>)}</tbody>
                                    </table>
                                </div>
                            </div>
                        ) : <p className="text-sm text-slate-500">Pekerjaan ini belum memiliki data RAB.</p>}
                    </div>

                    <div className="page-card">
                        <h2 className="mb-4 font-bold">Riwayat Progress</h2>
                        {(item.progress_logs ?? []).length === 0 && <p className="text-sm text-slate-500">Belum ada riwayat progress.</p>}
                        <div className="space-y-3">
                            {(item.progress_logs ?? []).map((log) => (
                                <div className="rounded-2xl border border-[#29314b] bg-[#141b2d] p-4" key={log.id}>
                                    <div className="flex flex-wrap items-center justify-between gap-3"><b>{log.progress}% - {log.status}</b><span className="text-xs text-slate-500">{formatDate(log.tanggal_update)} · {log.updater?.name ?? "-"}</span></div>
                                    <p className="mt-2 text-sm text-slate-500">{log.catatan ?? "-"}</p>
                                    {(log.kendala || log.solusi) && <div className="mt-3 grid gap-3 text-sm md:grid-cols-2"><p><b>Kendala:</b> {log.kendala ?? "-"}</p><p><b>Solusi:</b> {log.solusi ?? "-"}</p></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function Info({ label, value }) { return <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><b>{value || "-"}</b></div>; }
