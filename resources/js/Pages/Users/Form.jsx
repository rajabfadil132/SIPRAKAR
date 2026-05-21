import AppLayout from '@/Layouts/AppLayout';
import AuditInfo from '@/Components/AuditInfo';
import { Link, useForm } from '@inertiajs/react';

export default function Form({ item, roles = [], cabangs = [] }) {
  const isEdit = Boolean(item?.id);
  const form = useForm({
    name: item?.name ?? '',
    email: item?.email ?? '',
    password: '',
    role_id: item?.role_id ?? '',
    cabang_id: item?.cabang_id ?? '',
    phone: item?.phone ?? '',
    status: item?.status ?? 'active',
  });

  const submit = (e) => {
    e.preventDefault();
    isEdit ? form.put(`/users-management/${item.id}`) : form.post('/users-management');
  };

  return (
    <AppLayout title={isEdit ? 'Edit User' : 'Tambah User'}>
      <form onSubmit={submit} className="page-card grid gap-4 md:grid-cols-2">
        <label>Nama<input className="input mt-1" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} required />{form.errors.name && <p className="mt-1 text-xs text-red-300">{form.errors.name}</p>}</label>
        <label>Email<input className="input mt-1" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} required />{form.errors.email && <p className="mt-1 text-xs text-red-300">{form.errors.email}</p>}</label>
        <label>Password<input className="input mt-1" type="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} placeholder={isEdit ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'} required={!isEdit} />{form.errors.password && <p className="mt-1 text-xs text-red-300">{form.errors.password}</p>}</label>
        <label>No. HP<input className="input mt-1" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} /></label>
        <label>Role<select className="input mt-1" value={form.data.role_id} onChange={(e) => form.setData('role_id', e.target.value)} required><option value="">Pilih role</option>{roles.map((x) => <option key={x.id} value={x.id}>{x.nama_role}</option>)}</select>{form.errors.role_id && <p className="mt-1 text-xs text-red-300">{form.errors.role_id}</p>}</label>
        <label>Cabang<select className="input mt-1" value={form.data.cabang_id} onChange={(e) => form.setData('cabang_id', e.target.value)}><option value="">Tanpa cabang</option>{cabangs.map((x) => <option key={x.id} value={x.id}>{x.nama_cabang}</option>)}</select></label>
        <label>Status<select className="input mt-1" value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option></select></label>
        {isEdit && <div className="md:col-span-2"><AuditInfo item={item} /></div>}
        <div className="md:col-span-2 flex justify-end gap-2"><Link href="/users-management" className="btn-light">Batal</Link><button className="btn-primary" disabled={form.processing}>{isEdit ? 'Update User' : 'Simpan User'}</button></div>
      </form>
    </AppLayout>
  );
}
