# Revisi UI, Tabel, RAB, dan Progress - 2026-05-21

Perubahan yang diterapkan:

- Logo dan teks SIPRAKAR dipindahkan kembali ke sidebar.
- Header tidak lagi memuat brand SIPRAKAR, hanya judul halaman, search, notifikasi, dan profil.
- Nilai Total RAB pada card/stat dibuat lebih kecil dan aman untuk angka besar sampai 12 digit.
- Tabel dibuat tetap rata kiri untuk header dan data, sementara kolom status tetap berada di tengah.
- Kode program, pekerjaan, dan RAB sekarang memakai tahun 2 digit serta kode cabang 3 karakter, contoh `PKR/PUS/26/0001`.
- Aksi pekerjaan tetap lengkap ketika belum memiliki RAB: tombol RAB berubah menjadi aksi untuk membuat RAB.
- Search/filter tabel Program Kerja, Pekerjaan, RAB, Laporan, dan User Management memakai query server, sehingga pagination mengikuti data hasil filter.
- Progress manual dihapus dari form dan detail pekerjaan. Progress dimulai dari 0 dan dihitung dari checklist pekerjaan.
- Kolom deskripsi pada tabel Program Kerja dihapus agar tabel lebih ringkas.
- Tambah RAB hanya menampilkan pekerjaan yang belum memiliki RAB, yaitu pekerjaan yang tampil dengan label `Tanpa RAB` di tabel pekerjaan.
