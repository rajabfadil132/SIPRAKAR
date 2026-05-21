<?php

namespace Database\Seeders;

use App\Models\{Cabang, DokumenAdministrasi, JadwalPemeliharaan, KategoriPekerjaan, Lembaga, Lokasi, Pekerjaan, PekerjaanChecklist, ProgramKerja, ProgressPekerjaan, Rab, RabDetail, Role, RolePermission, User, Vendor};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SiprakarSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $roles = collect(['Superadmin','Admin','Lembaga','Teknisi','Sipil','Kebersihan','Security','Umum'])
            ->mapWithKeys(fn ($name) => [$name => Role::firstOrCreate(['nama_role' => $name], ['keterangan' => 'Role '.$name])]);

        $permissionKeys = config('siprakar_permissions.keys', []);
        $allPermissions = array_fill_keys($permissionKeys, true);
        $viewerPermissions = array_fill_keys($permissionKeys, false);
        foreach (['dashboard.view','program_kerja.view','program_kerja.show','pekerjaan.view','pekerjaan.show','reports.view','notifications.view'] as $key) {
            $viewerPermissions[$key] = true;
        }
        $operatorPermissions = $viewerPermissions;
        $operatorPermissions['pekerjaan.progress'] = true;

        foreach ($roles as $roleName => $role) {
            $lower = strtolower($roleName);
            $permissions = match ($lower) {
                'superadmin', 'admin' => $allPermissions,
                'teknisi', 'sipil', 'kebersihan', 'security' => $operatorPermissions,
                default => $viewerPermissions,
            };

            RolePermission::updateOrCreate(
                ['role_id' => $role->id],
                ['permissions' => $permissions]
            );
        }

        $cabangs = collect([
            ['nama_cabang'=>'Kampus Pusat','kode'=>'PUST','alamat'=>'Jl. Kampus Pusat No. 1'],
            ['nama_cabang'=>'Kampus Witana','kode'=>'WIT','alamat'=>'Jl. Witana No. 12'],
            ['nama_cabang'=>'Kampus Serang','kode'=>'SRG','alamat'=>'Jl. Serang Raya No. 8'],
            ['nama_cabang'=>'Kampus Viktor','kode'=>'VIK','alamat'=>'Jl. Viktor No. 45'],
            ['nama_cabang'=>'STIKes','kode'=>'STK','alamat'=>'Jl. Kesehatan No. 17'],
        ])->mapWithKeys(fn ($c) => [$c['kode'] => Cabang::updateOrCreate(['kode'=>$c['kode']], $c + ['status'=>'active'])]);

        $kategoris = collect([
            'Listrik','Air','AC','Bangunan','Furnitur','Kebersihan','Keamanan','Pengadaan','Renovasi','Pemeliharaan'
        ])->mapWithKeys(fn ($name) => [$name => KategoriPekerjaan::updateOrCreate(['nama_kategori'=>$name], ['status'=>'active'])]);

        $lembagas = collect();
        $lokasis = collect();
        foreach ($cabangs as $kode => $cabang) {
            $lembagas[$kode] = Lembaga::updateOrCreate(
                ['cabang_id' => $cabang->id, 'nama_lembaga' => 'Sarana Prasarana'],
                ['penanggung_jawab' => 'Kepala Sarpras '.$cabang->nama_cabang, 'status' => 'active']
            );

            $lokasis[$kode] = collect([
                Lokasi::updateOrCreate(
                    ['cabang_id' => $cabang->id, 'nama_gedung' => 'Gedung Utama', 'lantai' => '1', 'ruangan' => 'Ruang Kelas A'],
                    ['status' => 'active']
                ),
                Lokasi::updateOrCreate(
                    ['cabang_id' => $cabang->id, 'nama_gedung' => 'Gedung Praktikum', 'lantai' => '2', 'ruangan' => 'Laboratorium'],
                    ['status' => 'active']
                ),
            ]);
        }

        $password = Hash::make('password');
        $accounts = collect([
            ['key'=>'superadmin','name'=>'Super Admin SIPRAKAR','email'=>'superadmin@siprakar.test','role'=>'Superadmin','cabang'=>'PUST','phone'=>'081200000001'],
            ['key'=>'admin_pusat','name'=>'Admin Pusat','email'=>'admin.pusat@siprakar.test','role'=>'Admin','cabang'=>'PUST','phone'=>'081200000002'],
            ['key'=>'admin_witana','name'=>'Admin Witana','email'=>'admin.witana@siprakar.test','role'=>'Admin','cabang'=>'WIT','phone'=>'081200000003'],
            ['key'=>'lembaga_pusat','name'=>'User Lembaga Pusat','email'=>'lembaga.pusat@siprakar.test','role'=>'Lembaga','cabang'=>'PUST','lembaga'=>'PUST','phone'=>'081200000004'],
            ['key'=>'lembaga_serang','name'=>'User Lembaga Serang','email'=>'lembaga.serang@siprakar.test','role'=>'Lembaga','cabang'=>'SRG','lembaga'=>'SRG','phone'=>'081200000005'],
            ['key'=>'teknisi_viktor','name'=>'Teknisi Viktor','email'=>'teknisi.viktor@siprakar.test','role'=>'Teknisi','cabang'=>'VIK','phone'=>'081200000006'],
            ['key'=>'teknisi_pusat','name'=>'Teknisi Pusat','email'=>'teknisi.pusat@siprakar.test','role'=>'Teknisi','cabang'=>'PUST','phone'=>'081200000007'],
            ['key'=>'sipil_serang','name'=>'Petugas Sipil Serang','email'=>'sipil.serang@siprakar.test','role'=>'Sipil','cabang'=>'SRG','phone'=>'081200000008'],
            ['key'=>'sipil_pusat','name'=>'Petugas Sipil Pusat','email'=>'sipil.pusat@siprakar.test','role'=>'Sipil','cabang'=>'PUST','phone'=>'081200000009'],
            ['key'=>'kebersihan_witana','name'=>'Petugas Kebersihan Witana','email'=>'kebersihan.witana@siprakar.test','role'=>'Kebersihan','cabang'=>'WIT','phone'=>'081200000010'],
            ['key'=>'kebersihan_stikes','name'=>'Petugas Kebersihan STIKes','email'=>'kebersihan.stikes@siprakar.test','role'=>'Kebersihan','cabang'=>'STK','phone'=>'081200000011'],
            ['key'=>'security_stikes','name'=>'Petugas Security STIKes','email'=>'security.stikes@siprakar.test','role'=>'Security','cabang'=>'STK','phone'=>'081200000012'],
            ['key'=>'security_pusat','name'=>'Petugas Security Pusat','email'=>'security.pusat@siprakar.test','role'=>'Security','cabang'=>'PUST','phone'=>'081200000013'],
            ['key'=>'umum_pusat','name'=>'User Umum Pusat','email'=>'umum.pusat@siprakar.test','role'=>'Umum','cabang'=>'PUST','phone'=>'081200000014'],
            ['key'=>'umum_viktor','name'=>'User Umum Viktor','email'=>'umum.viktor@siprakar.test','role'=>'Umum','cabang'=>'VIK','phone'=>'081200000015'],
        ])->mapWithKeys(function ($account) use ($roles, $cabangs, $lembagas, $password) {
            $user = User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'email_verified_at' => now(),
                    'password' => $password,
                    'role_id' => $roles[$account['role']]->id,
                    'cabang_id' => $cabangs[$account['cabang']]->id,
                    'lembaga_id' => isset($account['lembaga']) ? $lembagas[$account['lembaga']]->id : null,
                    'phone' => $account['phone'],
                    'status' => 'active',
                ]
            );

            return [$account['key'] => $user];
        });

        $super = $accounts['superadmin'];
        $adminPusat = $accounts['admin_pusat'];
        User::whereNull('created_by')->update(['created_by' => $super->id]);

        $operatorByCategory = [
            'Listrik' => $accounts['teknisi_pusat'],
            'Air' => $accounts['teknisi_viktor'],
            'AC' => $accounts['teknisi_pusat'],
            'Bangunan' => $accounts['sipil_serang'],
            'Renovasi' => $accounts['sipil_pusat'],
            'Furnitur' => $accounts['umum_pusat'],
            'Kebersihan' => $accounts['kebersihan_witana'],
            'Keamanan' => $accounts['security_stikes'],
            'Pengadaan' => $accounts['umum_viktor'],
            'Pemeliharaan' => $accounts['teknisi_viktor'],
        ];

        $programStatuses = ['Direncanakan','Berjalan','Selesai','Tertunda'];
        $pekerjaanStatuses = ['Belum dilaksanakan','Sedang berjalan','Sedang berjalan','Selesai','Tertunda'];
        $progressValues = [0, 25, 50, 100, 60];
        $priorities = ['Rendah','Sedang','Tinggi','Mendesak'];
        $yearCode = '26';
        $branchCode = fn ($cabang) => substr(preg_replace('/[^A-Z0-9]/', '', strtoupper($cabang->kode ?: $cabang->nama_cabang ?: 'CBG')), 0, 3) ?: 'CBG';
        $checklistTemplates = [
            ['Survey lokasi dan identifikasi kebutuhan', 'Penyusunan rencana dan kebutuhan material', 'Pelaksanaan pekerjaan utama', 'Pemeriksaan hasil dan dokumentasi'],
            ['Pengecekan kondisi awal', 'Koordinasi dengan penanggung jawab ruangan', 'Perbaikan atau penggantian komponen', 'Uji fungsi dan serah terima'],
            ['Validasi laporan pengajuan', 'Persiapan alat kerja', 'Eksekusi pekerjaan lapangan', 'Finalisasi dan pelaporan'],
        ];

        foreach (range(1, 50) as $i) {
            $kategori = $kategoris->values()[($i - 1) % $kategoris->count()];
            $assignedPetugas = $operatorByCategory[$kategori->nama_kategori] ?? $accounts['umum_pusat'];
            $cabang = $cabangs->firstWhere('id', $assignedPetugas->cabang_id) ?? $cabangs->values()[($i - 1) % $cabangs->count()];
            $lokasi = $lokasis[$cabang->kode][($i - 1) % $lokasis[$cabang->kode]->count()];
            $statusIndex = ($i - 1) % count($pekerjaanStatuses);
            $progress = $progressValues[$statusIndex];
            $pekerjaanStatus = $pekerjaanStatuses[$statusIndex];
            $programStatus = $programStatuses[($i - 1) % count($programStatuses)];
            $targetMulai = $now->copy()->startOfYear()->addDays($i * 4);
            $targetSelesai = $now->copy()->addDays(($i % 18) - 5);

            $program = ProgramKerja::updateOrCreate([
                'kode_program' => sprintf('PROKER/%s/%s/%04d', $branchCode($cabang), $yearCode, $i),
            ], [
                'tahun' => 2026,
                'nama_program' => sprintf('Program pemeliharaan fasilitas %02d', $i),
                'cabang_id' => $cabang->id,
                'lembaga_id' => $lembagas[$cabang->kode]->id,
                'kategori_id' => $kategori->id,
                'prioritas' => $priorities[$i % count($priorities)],
                'target_mulai' => $targetMulai,
                'target_selesai' => $targetMulai->copy()->addDays(30 + ($i % 10)),
                'estimasi_anggaran' => (10 + ($i % 45)) * 1000000,
                'status' => $programStatus,
                'keterangan' => 'Seeder dummy SIPRAKAR.',
                'created_by' => $super->id,
                'updated_by' => $i % 3 === 0 ? $adminPusat->id : null,
            ]);

            $pekerjaan = Pekerjaan::updateOrCreate([
                'kode_pekerjaan' => sprintf('PKR/%s/%s/%04d', $branchCode($cabang), $yearCode, $i),
            ], [
                'program_kerja_id' => $program->id,
                'nama_pekerjaan' => sprintf('%s fasilitas %02d', ['Perbaikan','Pemeliharaan','Pengadaan','Renovasi','Pengecekan'][($i - 1) % 5], $i),
                'cabang_id' => $cabang->id,
                'lokasi_id' => $lokasi->id,
                'kategori_id' => $kategori->id,
                'penanggung_jawab_id' => $adminPusat->id,
                'petugas_id' => $assignedPetugas->id,
                'tanggal_mulai' => $now->copy()->subDays(35 - ($i % 30)),
                'target_selesai' => $targetSelesai,
                'tanggal_selesai' => $progress === 100 ? $now->copy()->subDays($i % 5) : null,
                'status' => $pekerjaanStatus,
                'progress' => $progress,
                'is_rab' => $i % 2 === 0,
                'catatan' => 'Catatan dummy pekerjaan ke-'.$i,
                'created_by' => $adminPusat->id,
                'updated_by' => $i % 2 === 0 ? $assignedPetugas->id : null,
            ]);

            $template = $checklistTemplates[($i - 1) % count($checklistTemplates)];
            foreach ($template as $index => $deskripsi) {
                $done = $progress >= (($index + 1) * 25);
                PekerjaanChecklist::updateOrCreate(
                    ['pekerjaan_id' => $pekerjaan->id, 'deskripsi' => $deskripsi],
                    [
                        'is_done' => $done,
                        'completed_by' => $done ? $assignedPetugas->id : null,
                        'completed_at' => $done ? $now->copy()->subDays(max(0, 4 - $index)) : null,
                        'created_by' => $adminPusat->id,
                        'updated_by' => $done ? $assignedPetugas->id : null,
                    ]
                );
            }

            ProgressPekerjaan::updateOrCreate(
                ['pekerjaan_id' => $pekerjaan->id, 'tanggal_update' => $now->copy()->subDays($i % 12)->toDateString()],
                [
                    'progress' => $progress,
                    'status' => $pekerjaanStatus,
                    'catatan' => 'Progress dummy otomatis dari seeder.',
                    'kendala' => $pekerjaanStatus === 'Tertunda' ? 'Menunggu material atau jadwal ruangan kosong.' : null,
                    'solusi' => $pekerjaanStatus === 'Tertunda' ? 'Koordinasi ulang dengan pengadaan dan unit terkait.' : null,
                    'updated_by' => $assignedPetugas->id,
                ]
            );

            if ($pekerjaan->is_rab) {
                $rab = Rab::updateOrCreate(
                    ['nomor_rab' => sprintf('RAB/%s/%s/%04d', $branchCode($cabang), $yearCode, $i)],
                    [
                        'pekerjaan_id' => $pekerjaan->id,
                        'tanggal_rab' => $now->copy()->subDays($i % 20),
                        'status_rab' => ['Diajukan','Disetujui','Direvisi'][$i % 3],
                        'catatan' => 'RAB dummy untuk pekerjaan ke-'.$i,
                        'created_by' => $adminPusat->id,
                        'updated_by' => $i % 4 === 0 ? $super->id : null,
                    ]
                );

                foreach (range(1, 3) as $detailIndex) {
                    $volume = 1 + (($i + $detailIndex) % 4);
                    $harga = (250000 + (($i + $detailIndex) * 75000));
                    RabDetail::updateOrCreate(
                        ['rab_id' => $rab->id, 'nama_item' => 'Item material '.$detailIndex.' pekerjaan '.$i],
                        [
                            'spesifikasi' => 'Spesifikasi dummy '.$detailIndex,
                            'volume' => $volume,
                            'satuan' => ['unit','paket','meter'][$detailIndex % 3],
                            'harga_satuan' => $harga,
                            'subtotal' => $volume * $harga,
                            'keterangan' => 'Item dummy RAB.',
                            'created_by' => $adminPusat->id,
                        ]
                    );
                }

                $rab->update(['total_rab' => $rab->details()->sum('subtotal')]);
            }
        }

        foreach (range(1, 8) as $i) {
            Vendor::updateOrCreate(
                ['email' => sprintf('vendor%02d@siprakar.test', $i)],
                [
                    'nama_vendor' => sprintf('Vendor Sarpras %02d', $i),
                    'jenis_vendor' => ['Material','Jasa','Peralatan','Kebersihan'][$i % 4],
                    'kontak' => '0813000000'.str_pad((string) $i, 2, '0', STR_PAD_LEFT),
                    'alamat' => 'Alamat vendor dummy '.$i,
                    'pic' => 'PIC Vendor '.$i,
                    'bidang_pekerjaan' => ['Listrik','Bangunan','AC','Kebersihan'][$i % 4],
                    'status' => 'active',
                    'created_by' => $adminPusat->id,
                ]
            );
        }

        foreach (range(1, 10) as $i) {
            $cabang = $cabangs->values()[($i - 1) % $cabangs->count()];
            $kategori = $kategoris->values()[($i - 1) % $kategoris->count()];
            $petugas = $operatorByCategory[$kategori->nama_kategori] ?? $accounts['umum_pusat'];
            JadwalPemeliharaan::updateOrCreate(
                ['nama_jadwal' => sprintf('Jadwal pemeliharaan rutin %02d', $i)],
                [
                    'cabang_id' => $cabang->id,
                    'lokasi_id' => $lokasis[$cabang->kode][0]->id,
                    'kategori_id' => $kategori->id,
                    'frekuensi' => ['Mingguan','Bulanan','Triwulan','Semester'][$i % 4],
                    'tanggal_mulai' => $now->copy()->subDays($i),
                    'tanggal_berikutnya' => $now->copy()->addDays(7 * $i),
                    'petugas_id' => $petugas->id,
                    'status' => 'Aktif',
                    'catatan' => 'Jadwal dummy pemeliharaan.',
                    'created_by' => $adminPusat->id,
                ]
            );
        }

        Pekerjaan::query()->take(20)->get()->each(function ($pekerjaan, $index) use ($adminPusat, $now) {
            DokumenAdministrasi::updateOrCreate(
                ['pekerjaan_id' => $pekerjaan->id, 'jenis_dokumen' => 'Berita Acara'],
                [
                    'nomor_dokumen' => sprintf('BA/SIPRAKAR/2026/%04d', $index + 1),
                    'tanggal_dokumen' => $now->copy()->subDays($index),
                    'file_dokumen' => null,
                    'keterangan' => 'Dokumen administrasi dummy.',
                    'created_by' => $adminPusat->id,
                ]
            );
        });
    }
}
