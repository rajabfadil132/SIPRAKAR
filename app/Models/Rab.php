<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Concerns\TracksUserActions;
class Rab extends Model { use SoftDeletes, TracksUserActions; protected $fillable=['pekerjaan_id','nomor_rab','tanggal_rab','total_rab','status_rab','catatan','created_by','updated_by','deleted_by']; protected $casts=['tanggal_rab'=>'date','total_rab'=>'decimal:2']; public function pekerjaan(){return $this->belongsTo(Pekerjaan::class);} public function details(){return $this->hasMany(RabDetail::class);} }
