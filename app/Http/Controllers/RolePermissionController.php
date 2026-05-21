<?php

namespace App\Http\Controllers;

use App\Models\{Role, RolePermission};
use Illuminate\Http\Request;
use Inertia\Inertia;

class RolePermissionController extends Controller
{
    public function index()
    {
        $keys = config('siprakar_permissions.keys', []);

        $roles = Role::query()
            ->with('permission')
            ->orderByRaw("CASE WHEN lower(nama_role) = 'superadmin' THEN 0 WHEN lower(nama_role) = 'admin' THEN 1 ELSE 2 END")
            ->orderBy('nama_role')
            ->get()
            ->map(function (Role $role) use ($keys) {
                $roleName = strtolower($role->nama_role);
                $stored = $role->permission?->permissions ?? [];
                $permissions = $roleName === 'superadmin'
                    ? array_fill_keys($keys, true)
                    : array_replace(array_fill_keys($keys, false), $stored);

                return [
                    'id' => $role->id,
                    'nama_role' => $role->nama_role,
                    'keterangan' => $role->keterangan,
                    'locked' => $roleName === 'superadmin',
                    'permissions' => $permissions,
                ];
            });

        return Inertia::render('Users/Permissions', [
            'roles' => $roles,
            'groups' => config('siprakar_permissions.groups', []),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        if (strtolower($role->nama_role) === 'superadmin') {
            return back()->with('error', 'Hak akses Superadmin selalu aktif dan tidak dapat diubah.');
        }

        $keys = config('siprakar_permissions.keys', []);
        $payload = $request->validate([
            'permissions' => ['required', 'array'],
        ]);

        $permissions = [];
        foreach ($keys as $key) {
            $permissions[$key] = (bool) ($payload['permissions'][$key] ?? false);
        }

        RolePermission::updateOrCreate(
            ['role_id' => $role->id],
            ['permissions' => $permissions]
        );

        return back()->with('success', 'Hak akses role berhasil diperbarui.');
    }
}
