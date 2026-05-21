# Perbaikan Layout, Profil, dan Theme - 2026-05-20

Perubahan yang diterapkan:

1. Label role user seperti `superadmin` tidak lagi ditampilkan berulang di sidebar.
2. Role user hanya ditampilkan pada tombol profil di kanan header.
3. Tombol edit profile dan logout dipindahkan ke dropdown profil user.
4. Header sekarang hanya menampilkan notifikasi dan profil user.
5. Ditambahkan opsi `Gunakan Mode Light` / `Gunakan Mode Dark` pada dropdown profil.
6. Pilihan theme disimpan di `localStorage` dengan key `siprakar-theme`, sehingga tetap tersimpan setelah refresh.
7. Bug logo SIPRAKAR dan hamburger menu bertumpuk diperbaiki, terutama saat sidebar dibuat collapsed.
8. Ditambahkan override CSS light mode agar tabel, card, input, header, dropdown, dan body aplikasi tetap terbaca nyaman.

File utama yang berubah:

- `resources/js/Layouts/AppLayout.jsx`
- `resources/css/app.css`
- `public/build/*` hasil `npm run build`

Validasi yang sudah dilakukan:

- `npm install` berhasil.
- `npm run build` berhasil.
- `php artisan route:list` berhasil dan menampilkan 59 routes.

Catatan:

- `node_modules` tidak disertakan di ZIP agar ukuran file tetap ringan.
- Asset production sudah dibuild di `public/build`, jadi aplikasi bisa langsung memakai asset hasil build.
- Jika ingin mode development/HMR, jalankan `npm install` lalu `npm run dev`.
