<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use App\Models\Concerns\TracksUserActions;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, SoftDeletes, TracksUserActions;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'cabang_id',
        'lembaga_id',
        'phone',
        'status',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function cabang()
    {
        return $this->belongsTo(Cabang::class);
    }

    public function lembaga()
    {
        return $this->belongsTo(Lembaga::class);
    }

    public function pekerjaanDitugaskan()
    {
        return $this->hasMany(Pekerjaan::class, 'petugas_id');
    }

    public function hasPermission(string $permission): bool
    {
        $roleName = strtolower($this->role?->nama_role ?? '');

        if ($roleName === 'superadmin') {
            return true;
        }

        if ($roleName === 'admin' && ! $this->role?->permission) {
            return true;
        }

        $permissions = $this->role?->permission?->permissions ?? [];
        return (bool) ($permissions[$permission] ?? false);
    }

    public function permissionMap(): array
    {
        $roleName = strtolower($this->role?->nama_role ?? '');
        $permissions = config('siprakar_permissions.keys', []);

        if ($roleName === 'superadmin') {
            return array_fill_keys($permissions, true);
        }

        if ($roleName === 'admin' && ! $this->role?->permission) {
            return array_fill_keys($permissions, true);
        }

        return array_replace(array_fill_keys($permissions, false), $this->role?->permission?->permissions ?? []);
    }
}
