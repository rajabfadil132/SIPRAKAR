# Perbaikan SIPRAKAR - 2026-05-19

Perubahan utama yang sudah diterapkan:

1. Flash/toast Inertia aktif untuk pesan sukses, error, dan warning.
2. Notifikasi bell tidak lagi statis; sekarang menampilkan pekerjaan yang belum selesai dan mendekati target selesai 14 hari ke depan.
3. Search bar header sudah berfungsi dan mengarah ke modul aktif: pekerjaan, program kerja, laporan, atau user management.
4. Search/filter modul Program Kerja, Pekerjaan, Laporan, dan User Management diperbaiki di controller agar query lebih relevan dan tidak merusak scope cabang/role.
5. CRUD User Management dilengkapi: index, create, store, edit, update, destroy, dan show diarahkan ke edit.
6. Jejak audit ditampilkan pada tabel/detail/form untuk data yang memiliki kolom `created_by`, `updated_by`, dan `deleted_by`.
7. RAB dan item RAB diperbaiki: item bisa ditambah, diedit, dihapus, subtotal dihitung ulang, dan audit item RAB ditambahkan lewat migration baru.
8. Tampilan tabel dibuat lebih presisi dengan komponen `data-table`, kolom fixed, tombol aksi konsisten, pagination, dan empty state.
9. Popup/modal master data dan RAB disesuaikan dengan tema dashboard gelap agar lebih relevan.
10. Build frontend berhasil dibuat ke `public/build`.

Catatan teknis:

- Migration baru: `2026_05_19_000001_add_audit_columns_to_rab_details.php`.
- File SQLite bawaan di `database/database.sqlite` juga sudah ditambahkan kolom audit `rab_details` menggunakan tool SQLite Python karena environment ini tidak memiliki driver PHP SQLite.
- Jika menggunakan database lama di komputer sendiri, jalankan `php artisan migrate` setelah mengganti source code.
