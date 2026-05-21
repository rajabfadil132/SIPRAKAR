# Revisi Dashboard, Tabel, RAB, Prioritas, dan Light Mode

Perubahan:

- Dashboard: chart trend dapat difilter berdasarkan tahun melalui dropdown Tahun.
- Dashboard mobile: chart line tidak lagi memaksa lebar besar, dan daftar pekerjaan sedang berjalan diberi batas tinggi + scroll.
- Kolom prioritas pada Program Kerja memakai ikon berwarna:
  - Rendah: panah bawah
  - Sedang: tanda minus
  - Tinggi: panah atas
  - Mendesak: ikon peringatan
- Laporan & Statistik: lebar kolom diperbaiki agar tidak bertumpuk.
- Data Pekerjaan: kolom RAB menampilkan status di atas dan nominal di bawah; pekerjaan tanpa RAB tetap di tengah.
- Total RAB pada stat card dibuat lebih aman untuk angka panjang sampai 12 digit.
- Light mode diperbaiki dengan palet warna yang lebih kontras dan nyaman dibaca.

Validasi:

- npm run build berhasil.
- php artisan route:list --except-vendor berhasil.
- php -l untuk file PHP berhasil.
