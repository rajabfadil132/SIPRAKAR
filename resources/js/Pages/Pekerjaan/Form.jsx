import AuditInfo from "@/Components/AuditInfo";
import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";

const dateValue = (value) => value?.slice?.(0, 10) ?? "";
const defaultChecklist = ["Survey lokasi dan kebutuhan", "Persiapan alat/material", "Pelaksanaan pekerjaan", "Pemeriksaan hasil pekerjaan"];

export default function Form({ item, programs = [], cabangs = [], lokasis = [], kategoris = [], users = [] }) {
    const isEdit = Boolean(item?.id);
    const existingChecklist = (item?.checklists ?? []).map((row) => row.deskripsi);
    const form = useForm({
        program_kerja_id: item?.program_kerja_id ?? "",
        nama_pekerjaan: item?.nama_pekerjaan ?? "",
        deskripsi: item?.deskripsi ?? "",
        cabang_id: item?.cabang_id ?? "",
        lokasi_id: item?.lokasi_id ?? "",
        kategori_id: item?.kategori_id ?? "",
        penanggung_jawab_id: item?.penanggung_jawab_id ?? "",
        petugas_id: item?.petugas_id ?? "",
        tanggal_mulai: dateValue(item?.tanggal_mulai),
        target_selesai: dateValue(item?.target_selesai),
        tanggal_selesai: dateValue(item?.tanggal_selesai),
        status: item?.status ?? "Belum dilaksanakan",
        catatan: item?.catatan ?? "",
        checklists: existingChecklist.length ? existingChecklist : defaultChecklist,
    });

    const setChecklist = (index, value) => {
        const next = [...form.data.checklists];
        next[index] = value;
        form.setData("checklists", next);
    };

    const addChecklist = () => form.setData("checklists", [...form.data.checklists, ""]);
    const removeChecklist = (index) => form.setData("checklists", form.data.checklists.filter((_, i) => i !== index));

    const submit = (e) => {
        e.preventDefault();
        isEdit ? form.put(`/pekerjaan/${item.id}`) : form.post("/pekerjaan");
    };

    return (
        <AppLayout title={isEdit ? "Edit Pekerjaan" : "Tambah Pekerjaan"}>
            <form onSubmit={submit} className="space-y-6">
                <div className="page-card grid gap-4 md:grid-cols-2">
                    <label className="md:col-span-2">Nama Pekerjaan<input className="input mt-1" value={form.data.nama_pekerjaan} onChange={(e) => form.setData("nama_pekerjaan", e.target.value)} required />{form.errors.nama_pekerjaan && <Error>{form.errors.nama_pekerjaan}</Error>}</label>
                    <label>Program Kerja<select className="input mt-1" value={form.data.program_kerja_id} onChange={(e) => form.setData("program_kerja_id", e.target.value)}><option value="">Pilih program</option>{programs.map((x) => <option key={x.id} value={x.id}>{x.nama_program}</option>)}</select></label>
                    <label>Cabang<select className="input mt-1" value={form.data.cabang_id} onChange={(e) => form.setData("cabang_id", e.target.value)}><option value="">Ikuti user login</option>{cabangs.map((x) => <option key={x.id} value={x.id}>{x.nama_cabang}</option>)}</select></label>
                    <label>Lokasi<select className="input mt-1" value={form.data.lokasi_id} onChange={(e) => form.setData("lokasi_id", e.target.value)}><option value="">Pilih lokasi</option>{lokasis.map((x) => <option key={x.id} value={x.id}>{x.nama_gedung} {x.ruangan}</option>)}</select></label>
                    <label>Kategori<select className="input mt-1" value={form.data.kategori_id} onChange={(e) => form.setData("kategori_id", e.target.value)}><option value="">Pilih kategori</option>{kategoris.map((x) => <option key={x.id} value={x.id}>{x.nama_kategori}</option>)}</select></label>
                    <label>Penanggung Jawab<select className="input mt-1" value={form.data.penanggung_jawab_id} onChange={(e) => form.setData("penanggung_jawab_id", e.target.value)}><option value="">Pilih penanggung jawab</option>{users.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
                    <label>Petugas<select className="input mt-1" value={form.data.petugas_id} onChange={(e) => form.setData("petugas_id", e.target.value)}><option value="">Pilih petugas</option>{users.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
                    <label>Tanggal Mulai<input type="date" className="input mt-1" value={form.data.tanggal_mulai} onChange={(e) => form.setData("tanggal_mulai", e.target.value)} /></label>
                    <label>Target Selesai<input type="date" className="input mt-1" value={form.data.target_selesai} onChange={(e) => form.setData("target_selesai", e.target.value)} /></label>
                    {isEdit && <label>Tanggal Selesai<input type="date" className="input mt-1" value={form.data.tanggal_selesai} onChange={(e) => form.setData("tanggal_selesai", e.target.value)} /></label>}
                    <label>Status<select className="input mt-1" value={form.data.status} onChange={(e) => form.setData("status", e.target.value)}><option>Belum dilaksanakan</option><option>Sedang berjalan</option><option>Selesai</option><option>Tertunda</option><option>Dibatalkan</option></select><span className="mt-1 block text-xs text-slate-500">Progress tidak diisi manual. Nilainya dimulai dari 0 dan naik otomatis saat checklist dicentang.</span></label>
                    <label className="md:col-span-2">Deskripsi<textarea className="input mt-1" rows="4" value={form.data.deskripsi} onChange={(e) => form.setData("deskripsi", e.target.value)} /></label>
                    <label className="md:col-span-2">Catatan<textarea className="input mt-1" rows="3" value={form.data.catatan} onChange={(e) => form.setData("catatan", e.target.value)} /></label>
                </div>

                <div className="page-card">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="font-bold">Detail Pekerjaan / Checklist</h2>
                            <p className="text-sm text-slate-500">Tuliskan rincian pekerjaan yang harus dilakukan saat pengajuan. Centang checklist di halaman detail untuk menghitung progress otomatis.</p>
                        </div>
                        <button type="button" className="btn-light" onClick={addChecklist}><Plus size={16} className="mr-2" />Tambah Detail</button>
                    </div>
                    <div className="space-y-3">
                        {form.data.checklists.map((value, index) => (
                            <div key={index} className="flex gap-2">
                                <input className="input" value={value} onChange={(e) => setChecklist(index, e.target.value)} placeholder={`Detail pekerjaan ${index + 1}`} />
                                <button type="button" className="icon-btn-danger" onClick={() => removeChecklist(index)} title="Hapus detail"><Trash2 size={15} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {Object.keys(form.errors).length > 0 && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">Periksa kembali data yang wajib diisi.</div>}
                {isEdit && <div className="page-card"><h2 className="mb-4 font-bold">Riwayat</h2><AuditInfo item={item} /></div>}
                <div className="flex justify-end gap-2"><Link href={isEdit ? `/pekerjaan/${item.id}` : "/pekerjaan"} className="btn-light">Batal</Link><button className="btn-primary" disabled={form.processing}>Simpan</button></div>
            </form>
        </AppLayout>
    );
}

function Error({ children }) { return <p className="mt-1 text-xs text-red-300">{children}</p>; }
