<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('nama_role')->unique();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        Schema::create('cabangs', function (Blueprint $table) {
            $table->id();
            $table->string('nama_cabang');
            $table->string('kode', 10)->unique();
            $table->text('alamat')->nullable();
            $table->text('keterangan')->nullable();
            $table->string('status')->default('active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('lembagas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cabang_id')->constrained('cabangs')->cascadeOnDelete();
            $table->string('nama_lembaga');
            $table->string('penanggung_jawab')->nullable();
            $table->text('keterangan')->nullable();
            $table->string('status')->default('active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'role_id')) $table->foreignId('role_id')->nullable()->after('password')->constrained('roles')->nullOnDelete();
            if (! Schema::hasColumn('users', 'cabang_id')) $table->foreignId('cabang_id')->nullable()->after('role_id')->constrained('cabangs')->nullOnDelete();
            if (! Schema::hasColumn('users', 'lembaga_id')) $table->foreignId('lembaga_id')->nullable()->after('cabang_id')->constrained('lembagas')->nullOnDelete();
            if (! Schema::hasColumn('users', 'phone')) $table->string('phone')->nullable()->after('lembaga_id');
            if (! Schema::hasColumn('users', 'status')) $table->string('status')->default('active')->after('phone');
            if (! Schema::hasColumn('users', 'created_by')) $table->unsignedBigInteger('created_by')->nullable();
            if (! Schema::hasColumn('users', 'updated_by')) $table->unsignedBigInteger('updated_by')->nullable();
            if (! Schema::hasColumn('users', 'deleted_by')) $table->unsignedBigInteger('deleted_by')->nullable();
            if (! Schema::hasColumn('users', 'deleted_at')) $table->softDeletes();
        });

        Schema::create('kategori_pekerjaans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kategori');
            $table->text('keterangan')->nullable();
            $table->string('status')->default('active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('lokasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cabang_id')->constrained('cabangs')->cascadeOnDelete();
            $table->string('nama_gedung');
            $table->string('lantai')->nullable();
            $table->string('ruangan')->nullable();
            $table->text('keterangan')->nullable();
            $table->string('status')->default('active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lokasis');
        Schema::dropIfExists('kategori_pekerjaans');
        Schema::table('users', function (Blueprint $table) {
            foreach (['role_id','cabang_id','lembaga_id','phone','status','created_by','updated_by','deleted_by','deleted_at'] as $column) {
                if (Schema::hasColumn('users', $column)) $table->dropColumn($column);
            }
        });
        Schema::dropIfExists('lembagas');
        Schema::dropIfExists('cabangs');
        Schema::dropIfExists('roles');
    }
};
