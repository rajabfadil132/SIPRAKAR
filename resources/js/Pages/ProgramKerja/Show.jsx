import AuditInfo from "@/Components/AuditInfo";
import PriorityBadge from "@/Components/PriorityBadge";
import StatusBadge from "@/Components/StatusBadge";
import AppLayout from "@/Layouts/AppLayout";
import { formatDate } from "@/Utils/date";
import { Link } from "@inertiajs/react";
import { Edit3, Eye } from "lucide-react";

const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value ?? 0));

function Info({ label, value }) {
    return <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><b>{value || "-"}</b></div>;
}

export default function Show({ item, permissions = {} }) {
    const pekerjaan = item?.pekerjaans ?? [];
    return (
        <AppLayout title="Detail Program Kerja">
            <div className="mb-5 flex flex-wrap justify-between gap-3">
                <Link href="/program-kerja" className="btn-light">Kembali</Link>
                {permissions["program_kerja.edit"] && <Link href={`/program-kerja/${item.id}/edit`} className="btn-primary"><Edit3 size={16} className="mr-2" />Edit Program</Link>}
            </div>

            <div className="space-y-6">
                <div className="space-y-6">
                    <div className="page-card">
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                            <div><p className="text-sm text-slate-500">{item.kode_program}</p><h2 className="text-2xl font-black">{item.nama_program}</h2></div>
                            <StatusBadge value={item.status} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Info label="Tahun" value={item.tahun} />
                            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prioritas</p><div className="mt-1"><PriorityBadge value={item.prioritas} /></div></div>
                            <Info label="Estimasi Anggaran" value={rupiah(item.estimasi_anggaran)} />
                            <Info label="Cabang" value={item.cabang?.nama_cabang} />
                            <Info label="Lembaga" value={item.lembaga?.nama_lembaga} />
                            <Info label="Kategori" value={item.kategori?.nama_kategori} />
                            <Info label="Target Mulai" value={formatDate(item.target_mulai)} />
                            <Info label="Target Selesai" value={formatDate(item.target_selesai)} />
                        </div>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <Info label="Deskripsi" value={item.deskripsi} />
                            <Info label="Keterangan" value={item.keterangan} />
                        </div>
                    </div>

                    <div className="page-card">
                        <h2 className="mb-4 font-bold">Pekerjaan dalam Program Ini</h2>
                        <div className="table-shell">
                            <table className="data-table min-w-[900px] table-fixed">
                                <thead><tr><th className="w-40">Kode</th><th>Pekerjaan</th><th className="w-40">Petugas</th><th className="w-36 text-center">Progress</th><th className="w-36 text-center">Status</th><th className="w-24 text-right">Aksi</th></tr></thead>
                                <tbody>
                                    {pekerjaan.map((p) => (
                                        <tr key={p.id}>
                                            <td className="text-[#4cceac] font-semibold table-nowrap">{p.kode_pekerjaan}</td>
                                            <td><div className="truncate" title={p.nama_pekerjaan}>{p.nama_pekerjaan}</div><p className="text-xs text-slate-500">{p.kategori?.nama_kategori ?? "-"}</p></td>
                                            <td>{p.petugas?.name ?? "-"}</td>
                                            <td className="text-center font-bold">{p.progress}%</td>
                                            <td className="text-center"><StatusBadge value={p.status} /></td>
                                            <td className="text-right">{permissions["pekerjaan.show"] && <Link href={`/pekerjaan/${p.id}`} className="icon-btn"><Eye size={15} /></Link>}</td>
                                        </tr>
                                    ))}
                                    {pekerjaan.length === 0 && <tr><td colSpan="6" className="text-center text-slate-500">Belum ada pekerjaan.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="page-card h-fit">
                    <h2 className="mb-4 font-bold">Riwayat</h2>
                    <AuditInfo item={item} />
                </div>
            </div>
        </AppLayout>
    );
}
