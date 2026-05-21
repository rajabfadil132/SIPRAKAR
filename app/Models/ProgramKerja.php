<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Concerns\TracksUserActions;
class ProgramKerja extends Model {
 use SoftDeletes, TracksUserActions;
 protected $fillable=['kode_program','tahun','nama_program','deskripsi','cabang_id','lembaga_id','kategori_id','prioritas','target_mulai','target_selesai','estimasi_anggaran','status','keterangan','created_by','updated_by','deleted_by'];
 protected $casts=['target_mulai'=>'date','target_selesai'=>'date','estimasi_anggaran'=>'decimal:2'];
 public function cabang(){return $this->belongsTo(Cabang::class);} public function lembaga(){return $this->belongsTo(Lembaga::class);} public function kategori(){return $this->belongsTo(KategoriPekerjaan::class,'kategori_id');} public function pekerjaans(){return $this->hasMany(Pekerjaan::class);}
 public function scopeForCurrentUser($query){$u=auth()->user(); if($u && strtolower($u->role?->nama_role ?? '')!=='superadmin') $query->where('cabang_id',$u->cabang_id); return $query;}
}
