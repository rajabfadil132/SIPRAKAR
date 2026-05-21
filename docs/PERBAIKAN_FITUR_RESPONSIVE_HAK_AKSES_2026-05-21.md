# Perbaikan SIPRAKAR - 2026-05-21

## Ringkasan perubahan

1. Semua tabel utama tetap berupa tabel di desktop maupun HP dan memakai scroll horizontal.
2. Lebar kolom tabel diperbaiki memakai `table-fixed`, `min-w-*`, `truncate`, dan `whitespace-nowrap`.
3. Semua tabel utama memiliki aksi **Lihat Detail**.
4. Audit/riwayat dipindahkan dari tabel utama ke halaman/modal detail dengan nama **Riwayat**.
5. Ditambahkan modul **Hak Akses Role** dengan toggle switch untuk mengatur menu/aksi per role.
6. Hak akses role hanya dapat diubah oleh role **Admin** dan **Superadmin**.
7. Ditambahkan checklist detail pekerjaan pada pengajuan/edit pekerjaan.
8. Checklist pada detail pekerjaan dapat dicentang dan otomatis memperbarui progress pekerjaan.
9. Dashboard mengganti kartu “Pekerjaan Mendekati Deadline” menjadi **Pekerjaan Sedang Berjalan** dengan area scroll.
10. Notifikasi kini menampilkan pekerjaan diajukan, pekerjaan selesai, mendekati deadline, dan status yang diperbarui.
11. Layout default dibuat lebih lebar seperti zoom 90%, tetapi tetap responsif untuk layar kecil.
12. Logo SIPRAKAR tetap berada di header kiri agar tidak hilang saat sidebar diciutkan.

## File penting yang berubah

- `routes/web.php`
- `app/Http/Middleware/HandleInertiaRequests.php`
- `app/Http/Middleware/PermissionMiddleware.php`
- `app/Http/Controllers/RolePermissionController.php`
- `app/Http/Controllers/PekerjaanController.php`
- `app/Http/Controllers/DashboardController.php`
- `app/Models/RolePermission.php`
- `app/Models/PekerjaanChecklist.php`
- `database/migrations/2026_05_21_000001_add_permissions_and_pekerjaan_checklists.php`
- `database/seeders/SiprakarSeeder.php`
- `resources/js/Layouts/AppLayout.jsx`
- `resources/js/Pages/Users/Permissions.jsx`
- `resources/js/Pages/Pekerjaan/Form.jsx`
- `resources/js/Pages/Pekerjaan/Show.jsx`
- `resources/js/Pages/ProgramKerja/Show.jsx`
- `resources/js/Pages/Rab/Show.jsx`
- `resources/css/app.css`

## Menjalankan update database

Jika memakai database lama, jalankan:

```bash
php artisan migrate --seed
```

Jika ingin reset dari awal:

```bash
php artisan migrate:fresh --seed
```

## Akun awal

Seeder tetap memakai akun awal yang sama, misalnya:

- `superadmin@siprakar.test`
- `admin.pusat@siprakar.test`

Password default: `password`
