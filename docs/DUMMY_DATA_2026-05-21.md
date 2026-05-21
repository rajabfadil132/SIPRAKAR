# Data Dummy SIPRAKAR - 2026-05-21

Seeder `database/seeders/SiprakarSeeder.php` sudah diperbarui agar menghasilkan data awal yang lebih banyak untuk pengujian tampilan dan fitur.

## Akun dummy

Jumlah akun dummy utama: **15 akun**.

Semua akun memakai password:

```text
password
```

| Role | Email |
|---|---|
| Superadmin | superadmin@siprakar.test |
| Admin | admin.pusat@siprakar.test |
| Admin | admin.witana@siprakar.test |
| Lembaga | lembaga.pusat@siprakar.test |
| Lembaga | lembaga.serang@siprakar.test |
| Teknisi | teknisi.viktor@siprakar.test |
| Teknisi | teknisi.pusat@siprakar.test |
| Sipil | sipil.serang@siprakar.test |
| Sipil | sipil.pusat@siprakar.test |
| Kebersihan | kebersihan.witana@siprakar.test |
| Kebersihan | kebersihan.stikes@siprakar.test |
| Security | security.stikes@siprakar.test |
| Security | security.pusat@siprakar.test |
| Umum | umum.pusat@siprakar.test |
| Umum | umum.viktor@siprakar.test |

## Data lainnya

Data dummy utama lainnya: **50 data program kerja dan 50 data pekerjaan**.

Setiap pekerjaan dilengkapi dengan:

- checklist detail pekerjaan,
- progress awal,
- log progress,
- sebagian data RAB dan item RAB,
- audit created_by/updated_by untuk kebutuhan riwayat.

Data tambahan pendukung juga disediakan:

- 5 cabang,
- 5 lembaga,
- 10 lokasi,
- 10 kategori pekerjaan,
- 25 RAB,
- 75 item RAB,
- 200 checklist pekerjaan,
- 50 log progress,
- 8 vendor,
- 10 jadwal pemeliharaan,
- 20 dokumen administrasi.

## Cara membuat ulang data

Untuk reset database dari awal:

```bash
php artisan migrate:fresh --seed
```

Kalau hanya ingin menjalankan migration tanpa menghapus data lama:

```bash
php artisan migrate --seed
```

Catatan: file `database/database.sqlite` di ZIP ini juga sudah diisi langsung dengan data dummy tersebut, sehingga jika project memakai SQLite bawaan, data dummy langsung tersedia.
