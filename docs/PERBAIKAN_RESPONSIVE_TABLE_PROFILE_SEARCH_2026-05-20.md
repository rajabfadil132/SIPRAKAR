# Perbaikan responsive tabel, profil, search, dan light mode

Tanggal: 20 Mei 2026

## Ringkasan perubahan

1. Tabel tetap berbentuk tabel di desktop, tablet, dan HP.
   - Tidak lagi diubah menjadi card/stacked layout pada layar kecil.
   - Tabel memakai `table-fixed` dan dibungkus `.table-shell` agar bisa discroll horizontal.
   - Kolom progress memakai `.progress-cell`, `.progress-bar`, dan `.progress-value` supaya angka persentase tidak turun ke bawah.

2. Logo SIPRAKAR dipindahkan ke header kiri.
   - Logo dan teks SIPRAKAR tidak lagi berada di sidebar.
   - Saat sidebar di-hide/collapse, identitas aplikasi tetap terlihat di header.
   - Hamburger desktop untuk collapse sidebar juga berada di header sehingga tidak bertumpuk dengan logo.

3. Ikon sidebar pada mode collapse dibuat berfungsi.
   - Ikon menu tunggal tetap menuju halaman terkait.
   - Ikon menu parent seperti Perencanaan, Monitoring, dan Pengaturan Sistem langsung membuka child pertama yang relevan.

4. Search tabel dibuat live/filter langsung.
   - Program Kerja, Pekerjaan, Laporan, User Management, dan Master Data memfilter isi tabel saat pengguna mengetik.
   - Saat input search dikosongkan atau tombol Reset ditekan, tabel kembali menampilkan data semula.

5. Light mode diperbaiki untuk form tambah/edit.
   - Warna label, input, select, textarea, placeholder, tombol sekunder, dan pesan error disesuaikan agar terbaca jelas pada mode light.

## File utama yang diubah

- `resources/js/Layouts/AppLayout.jsx`
- `resources/css/app.css`
- `resources/js/Pages/Dashboard/Index.jsx`
- `resources/js/Pages/ProgramKerja/Index.jsx`
- `resources/js/Pages/Pekerjaan/Index.jsx`
- `resources/js/Pages/Pekerjaan/Show.jsx`
- `resources/js/Pages/Reports/Index.jsx`
- `resources/js/Pages/Users/Index.jsx`
- `resources/js/Pages/Master/Index.jsx`
- `resources/js/Pages/Rab/Index.jsx`
- `resources/js/Pages/Rab/Form.jsx`

## Validasi

- `npm run build` berhasil.
- `php artisan route:list --except-vendor` berhasil.
- `php -l` pada file PHP aplikasi berhasil.
