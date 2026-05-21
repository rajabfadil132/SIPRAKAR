<?php
namespace App\Http\Controllers;
use App\Models\{Cabang, KategoriPekerjaan, Lembaga, ProgramKerja};
use Illuminate\Http\Request;
use Inertia\Inertia;
class ProgramKerjaController extends Controller {
 public function index(Request $request){
  $items=ProgramKerja::query()->forCurrentUser()->with(['cabang','lembaga','kategori','creator:id,name','updater:id,name','deleter:id,name'])
   ->when($request->filled('search'),function($q) use($request){$s=$request->string('search');$q->where(function($sub) use($s){$sub->where('nama_program','like',"%$s%")->orWhere('kode_program','like',"%$s%")->orWhere('tahun','like',"%$s%")->orWhereHas('cabang',fn($c)=>$c->where('nama_cabang','like',"%$s%"))->orWhereHas('kategori',fn($c)=>$c->where('nama_kategori','like',"%$s%"));});})
   ->when($request->filled('status'),fn($q)=>$q->where('status',$request->status))
   ->latest()->paginate(10)->withQueryString();
  return Inertia::render('ProgramKerja/Index',['items'=>$items,'filters'=>$request->only('search','status'),'permissions'=>$request->user()->permissionMap()]);
 }
 public function create(){return Inertia::render('ProgramKerja/Form',$this->formData());}
 public function store(Request $r){$data=$r->validate(['tahun'=>'required|digits:4','nama_program'=>'required','cabang_id'=>'nullable|exists:cabangs,id','lembaga_id'=>'nullable|exists:lembagas,id','kategori_id'=>'nullable|exists:kategori_pekerjaans,id','prioritas'=>'required','target_mulai'=>'nullable|date','target_selesai'=>'nullable|date','estimasi_anggaran'=>'nullable|numeric','status'=>'required','deskripsi'=>'nullable','keterangan'=>'nullable']); $user=$r->user(); if(strtolower($user->role?->nama_role)!=='superadmin') $data['cabang_id']=$user->cabang_id; $data['kode_program']=$this->generateKode('PROKER',$data['cabang_id'],$data['tahun']); $data['created_by']=$user->id; ProgramKerja::create($data); return redirect()->route('program-kerja.index')->with('success','Program kerja berhasil dibuat.');}
 public function show(ProgramKerja $programKerja){$programKerja->load(['cabang','lembaga','kategori','pekerjaans.petugas','pekerjaans.kategori','creator:id,name','updater:id,name','deleter:id,name']); return Inertia::render('ProgramKerja/Show',['item'=>$programKerja,'permissions'=>request()->user()->permissionMap()]);}
 public function edit(ProgramKerja $programKerja){return Inertia::render('ProgramKerja/Form',array_merge($this->formData(),['item'=>$programKerja->load(['creator:id,name','updater:id,name'])]));}
 public function update(Request $r, ProgramKerja $programKerja){$data=$r->validate(['nama_program'=>'required','lembaga_id'=>'nullable|exists:lembagas,id','kategori_id'=>'nullable|exists:kategori_pekerjaans,id','prioritas'=>'required','target_mulai'=>'nullable|date','target_selesai'=>'nullable|date','estimasi_anggaran'=>'nullable|numeric','status'=>'required','deskripsi'=>'nullable','keterangan'=>'nullable']); $data['updated_by']=$r->user()->id; $programKerja->update($data); return redirect()->route('program-kerja.index')->with('success','Program kerja diperbarui.');}
 public function destroy(ProgramKerja $programKerja){$programKerja->update(['deleted_by'=>auth()->id()]); $programKerja->delete(); return back()->with('success','Program kerja dihapus secara soft delete.');}
 private function formData(){return ['cabangs'=>Cabang::where('status','active')->get(),'lembagas'=>Lembaga::where('status','active')->get(),'kategoris'=>KategoriPekerjaan::where('status','active')->get()];}
 private function generateKode($prefix,$cabangId,$tahun){$cabang=Cabang::find($cabangId); $count=ProgramKerja::whereYear('created_at',now()->year)->count()+1; $source=$cabang?->kode ?: $cabang?->nama_cabang ?: 'CBG'; $code=substr(preg_replace('/[^A-Z0-9]/','',strtoupper($source)),0,3) ?: 'CBG'; $year=substr((string) $tahun,-2); return sprintf('%s/%s/%s/%04d',$prefix,$code,$year,$count);}
}
