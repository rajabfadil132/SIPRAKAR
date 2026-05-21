import AppLayout from '@/Layouts/AppLayout';
import AuditInfo from '@/Components/AuditInfo';
import { Link, useForm } from '@inertiajs/react';

const dateValue = (value) => value?.slice?.(0, 10) ?? '';

export default function Form({ item, cabangs = [], lembagas = [], kategoris = [] }) {
  const isEdit = Boolean(item?.id);
  const form = useForm({ tahun: item?.tahun ?? new Date().getFullYear(), nama_program: item?.nama_program ?? '', deskripsi: item?.deskripsi ?? '', cabang_id: item?.cabang_id ?? '', lembaga_id: item?.lembaga_id ?? '', kategori_id: item?.kategori_id ?? '', prioritas: item?.prioritas ?? 'Sedang', target_mulai: dateValue(item?.target_mulai), target_selesai: dateValue(item?.target_selesai), estimasi_anggaran: item?.estimasi_anggaran ?? 0, status: item?.status ?? 'Direncanakan', keterangan: item?.keterangan ?? '' });
  const submit = (e) => { e.preventDefault(); isEdit ? form.put(`/program-kerja/${item.id}`) : form.post('/program-kerja'); };

  return (
    <AppLayout title={isEdit ? 'Edit Program Kerja' : 'Tambah Program Kerja'}>
      <form onSubmit={submit} className="page-card grid gap-4 md:grid-cols-2">
        <label>Tahun<input className="input mt-1" value={form.data.tahun} onChange={(e) => form.setData('tahun', e.target.value)} required disabled={isEdit} /></label>
        <label>Nama Program<input className="input mt-1" value={form.data.nama_program} onChange={(e) => form.setData('nama_program', e.target.value)} required /></label>
        <label>Cabang<select className="input mt-1" value={form.data.cabang_id} onChange={(e) => form.setData('cabang_id', e.target.value)} disabled={isEdit}><option value="">Ikuti user login</option>{cabangs.map((x) => <option key={x.id} value={x.id}>{x.nama_cabang}</option>)}</select></label>
        <label>Lembaga<select className="input mt-1" value={form.data.lembaga_id} onChange={(e) => form.setData('lembaga_id', e.target.value)}><option value="">Pilih lembaga</option>{lembagas.map((x) => <option key={x.id} value={x.id}>{x.nama_lembaga}</option>)}</select></label>
        <label>Kategori<select className="input mt-1" value={form.data.kategori_id} onChange={(e) => form.setData('kategori_id', e.target.value)}><option value="">Pilih kategori</option>{kategoris.map((x) => <option key={x.id} value={x.id}>{x.nama_kategori}</option>)}</select></label>
        <label>Prioritas<select className="input mt-1" value={form.data.prioritas} onChange={(e) => form.setData('prioritas', e.target.value)}><option>Rendah</option><option>Sedang</option><option>Tinggi</option><option>Mendesak</option></select></label>
        <label>Target Mulai<input type="date" className="input mt-1" value={form.data.target_mulai} onChange={(e) => form.setData('target_mulai', e.target.value)} /></label>
        <label>Target Selesai<input type="date" className="input mt-1" value={form.data.target_selesai} onChange={(e) => form.setData('target_selesai', e.target.value)} /></label>
        <label>Estimasi Anggaran<input type="number" className="input mt-1" value={form.data.estimasi_anggaran} onChange={(e) => form.setData('estimasi_anggaran', e.target.value)} /></label>
        <label>Status<select className="input mt-1" value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}><option>Draft</option><option>Direncanakan</option><option>Disetujui</option><option>Berjalan</option><option>Selesai</option><option>Tertunda</option><option>Dibatalkan</option></select></label>
        <label className="md:col-span-2">Deskripsi<textarea className="input mt-1" rows="4" value={form.data.deskripsi} onChange={(e) => form.setData('deskripsi', e.target.value)} /></label>
        <label className="md:col-span-2">Keterangan<textarea className="input mt-1" rows="3" value={form.data.keterangan} onChange={(e) => form.setData('keterangan', e.target.value)} /></label>
        {Object.keys(form.errors).length > 0 && <div className="md:col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">Periksa kembali data yang wajib diisi.</div>}
        {isEdit && <div className="md:col-span-2"><AuditInfo item={item} /></div>}
        <div className="md:col-span-2 flex justify-end gap-2"><Link href="/program-kerja" className="btn-light">Batal</Link><button className="btn-primary" disabled={form.processing}>Simpan</button></div>
      </form>
    </AppLayout>
  );
}
