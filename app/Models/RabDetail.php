<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Concerns\TracksUserActions;
class RabDetail extends Model { use SoftDeletes, TracksUserActions; protected $fillable=['rab_id','nama_item','spesifikasi','volume','satuan','harga_satuan','subtotal','keterangan','created_by','updated_by','deleted_by']; protected $casts=['volume'=>'decimal:2','harga_satuan'=>'decimal:2','subtotal'=>'decimal:2']; public function rab(){return $this->belongsTo(Rab::class);} }
