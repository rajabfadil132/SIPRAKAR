<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Concerns\TracksUserActions;
class Pekerjaan extends Model {
 use SoftDeletes, TracksUserActions;
 protected $fillable=['program_kerja_id','kode_pekerjaan','nama_pekerjaan','deskripsi','cabang_id','lokasi_id','kategori_id','penanggung_jawab_id','petugas_id','tanggal_mulai','target_selesai','tanggal_selesai','status','progress','is_rab','catatan','created_by','updated_by','deleted_by'];
 protected $casts=['tanggal_mulai'=>'date','target_selesai'=>'date','tanggal_selesai'=>'date','is_rab'=>'boolean','progress'=>'integer'];
 public function programKerja(){return $this->belongsTo(ProgramKerja::class);} public function cabang(){return $this->belongsTo(Cabang::class);} public function lokasi(){return $this->belongsTo(Lokasi::class);} public function kategori(){return $this->belongsTo(KategoriPekerjaan::class,'kategori_id');} public function petugas(){return $this->belongsTo(User::class,'petugas_id');} public function penanggungJawab(){return $this->belongsTo(User::class,'penanggung_jawab_id');} public function rab(){return $this->hasOne(Rab::class);} public function checklists(){return $this->hasMany(PekerjaanChecklist::class)->orderBy('id');} public function progressLogs(){return $this->hasMany(ProgressPekerjaan::class)->latest('tanggal_update')->latest();}
 public function scopeForCurrentUser($query){$u=auth()->user(); if(!$u) return $query; $role=strtolower($u->role?->nama_role ?? ''); if($role==='superadmin') return $query; $query->where('cabang_id',$u->cabang_id); if(in_array($role,['teknisi','sipil','kebersihan','security'])) $query->where('petugas_id',$u->id); return $query;}
}
