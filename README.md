# SIPRAKAR - Laravel + Inertia.js + React Starter

SIPRAKAR adalah starter project sistem program kerja sarana prasarana kampus dengan Laravel, Inertia.js, React, Tailwind, role access, filter cabang, RAB, progress pekerjaan, dan dashboard analytics.

## Stack
- Laravel 11/12
- Inertia.js React
- Tailwind CSS
- MySQL/MariaDB
- Laravel Breeze Inertia sebagai auth starter

## Cara Pakai

```bash
composer create-project laravel/laravel siprakar
cd siprakar
composer require laravel/breeze
php artisan breeze:install react
npm install
```

Lalu copy isi folder starter ini ke root project Laravel baru Anda, kemudian jalankan:

```bash
php artisan migrate:fresh --seed
npm run dev
php artisan serve
```

## Login Seeder
- superadmin@siprakar.test / password
- admin.pusat@siprakar.test / password
- teknisi.viktor@siprakar.test / password

## Modul yang tersedia
- Dashboard analytics
- Program kerja tahunan
- Data pekerjaan
- Progress pekerjaan
- RAB dan item RAB
- Jadwal pemeliharaan
- Vendor
- Master cabang, lembaga, kategori, lokasi
- Pengguna dan role
- Laporan/statistik

## Catatan integrasi
File ini dibuat sebagai starter/skeleton. Setelah ditempel ke Laravel Breeze Inertia, sesuaikan namespace, import, dan menu sesuai kebutuhan final.
