<?php

namespace App\Http\Controllers;

use App\Models\{Cabang, Role, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $items = User::with(['role', 'cabang', 'creator:id,name', 'updater:id,name', 'deleter:id,name'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $s = $request->string('search');
                $query->where(function ($sub) use ($s) {
                    $sub->where('name', 'like', "%$s%")
                        ->orWhere('email', 'like', "%$s%")
                        ->orWhereHas('role', fn ($role) => $role->where('nama_role', 'like', "%$s%"))
                        ->orWhereHas('cabang', fn ($cabang) => $cabang->where('nama_cabang', 'like', "%$s%"));
                });
            })
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Users/Index', [
            'items' => $items,
            'filters' => $request->only('search', 'status'),
            'permissions' => $request->user()->permissionMap(),
            'canManagePermissions' => in_array(strtolower($request->user()->role?->nama_role ?? ''), ['admin', 'superadmin']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Form', [
            'roles' => Role::orderBy('nama_role')->get(),
            'cabangs' => Cabang::orderBy('nama_cabang')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());
        $data['password'] = Hash::make($data['password']);
        $data['created_by'] = $request->user()->id;

        User::create($data);

        return redirect()->route('users-management.index')->with('success', 'User berhasil dibuat.');
    }

    public function show(User $users_management)
    {
        $users_management->load(['role','cabang','lembaga','creator:id,name','updater:id,name','deleter:id,name','pekerjaanDitugaskan.kategori','pekerjaanDitugaskan.cabang']);
        return Inertia::render('Users/Show', [
            'item' => $users_management,
            'permissions' => request()->user()->permissionMap(),
        ]);
    }

    public function edit(User $users_management)
    {
        return Inertia::render('Users/Form', [
            'item' => $users_management->load(['role','cabang','creator:id,name','updater:id,name']),
            'roles' => Role::orderBy('nama_role')->get(),
            'cabangs' => Cabang::orderBy('nama_cabang')->get(),
        ]);
    }

    public function update(Request $request, User $users_management)
    {
        $data = $request->validate($this->rules($users_management->id, true));

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $data['updated_by'] = $request->user()->id;
        $users_management->update($data);

        return redirect()->route('users-management.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(Request $request, User $users_management)
    {
        if ($users_management->id === $request->user()->id) {
            return back()->with('error', 'User yang sedang login tidak bisa menghapus akunnya sendiri.');
        }

        $users_management->update(['deleted_by' => $request->user()->id]);
        $users_management->delete();

        return back()->with('success', 'User berhasil dihapus secara soft delete.');
    }

    private function rules(?int $id = null, bool $isUpdate = false): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($id)],
            'password' => [$isUpdate ? 'nullable' : 'required', 'string', 'min:8'],
            'role_id' => ['required', 'exists:roles,id'],
            'cabang_id' => ['nullable', 'exists:cabangs,id'],
            'phone' => ['nullable', 'string', 'max:50'],
            'status' => ['required', 'in:active,inactive,suspended'],
        ];
    }
}
