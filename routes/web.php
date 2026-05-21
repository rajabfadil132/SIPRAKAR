<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProgramKerjaController;
use App\Http\Controllers\PekerjaanController;
use App\Http\Controllers\RabController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\MasterDataController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('dashboard'));

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->middleware('permission:dashboard.view')->name('dashboard');

    Route::get('program-kerja', [ProgramKerjaController::class, 'index'])->middleware('permission:program_kerja.view')->name('program-kerja.index');
    Route::get('program-kerja/create', [ProgramKerjaController::class, 'create'])->middleware('permission:program_kerja.create')->name('program-kerja.create');
    Route::post('program-kerja', [ProgramKerjaController::class, 'store'])->middleware('permission:program_kerja.create')->name('program-kerja.store');
    Route::get('program-kerja/{programKerja}', [ProgramKerjaController::class, 'show'])->middleware('permission:program_kerja.show')->name('program-kerja.show');
    Route::get('program-kerja/{programKerja}/edit', [ProgramKerjaController::class, 'edit'])->middleware('permission:program_kerja.edit')->name('program-kerja.edit');
    Route::put('program-kerja/{programKerja}', [ProgramKerjaController::class, 'update'])->middleware('permission:program_kerja.edit')->name('program-kerja.update');
    Route::patch('program-kerja/{programKerja}', [ProgramKerjaController::class, 'update'])->middleware('permission:program_kerja.edit');
    Route::delete('program-kerja/{programKerja}', [ProgramKerjaController::class, 'destroy'])->middleware('permission:program_kerja.delete')->name('program-kerja.destroy');

    Route::get('pekerjaan', [PekerjaanController::class, 'index'])->middleware('permission:pekerjaan.view')->name('pekerjaan.index');
    Route::get('pekerjaan/create', [PekerjaanController::class, 'create'])->middleware('permission:pekerjaan.create')->name('pekerjaan.create');
    Route::post('pekerjaan', [PekerjaanController::class, 'store'])->middleware('permission:pekerjaan.create')->name('pekerjaan.store');
    Route::get('pekerjaan/{pekerjaan}', [PekerjaanController::class, 'show'])->middleware('permission:pekerjaan.show')->name('pekerjaan.show');
    Route::get('pekerjaan/{pekerjaan}/edit', [PekerjaanController::class, 'edit'])->middleware('permission:pekerjaan.edit')->name('pekerjaan.edit');
    Route::put('pekerjaan/{pekerjaan}', [PekerjaanController::class, 'update'])->middleware('permission:pekerjaan.edit')->name('pekerjaan.update');
    Route::patch('pekerjaan/{pekerjaan}', [PekerjaanController::class, 'update'])->middleware('permission:pekerjaan.edit');
    Route::delete('pekerjaan/{pekerjaan}', [PekerjaanController::class, 'destroy'])->middleware('permission:pekerjaan.delete')->name('pekerjaan.destroy');
    Route::post('pekerjaan/{pekerjaan}/progress', [PekerjaanController::class, 'storeProgress'])->middleware('permission:pekerjaan.progress')->name('pekerjaan.progress.store');
    Route::patch('pekerjaan/{pekerjaan}/checklist/{checklist}', [PekerjaanController::class, 'toggleChecklist'])->middleware('permission:pekerjaan.progress')->name('pekerjaan.checklist.toggle');

    Route::get('rab', [RabController::class, 'index'])->middleware('permission:rab.view')->name('rab.index');
    Route::get('rab/create', [RabController::class, 'create'])->middleware('permission:rab.create')->name('rab.create');
    Route::post('rab', [RabController::class, 'store'])->middleware('permission:rab.create')->name('rab.store');
    Route::get('rab/{rab}', [RabController::class, 'show'])->middleware('permission:rab.view')->name('rab.show');
    Route::get('rab/{rab}/edit', [RabController::class, 'edit'])->middleware('permission:rab.edit')->name('rab.edit');
    Route::put('rab/{rab}', [RabController::class, 'update'])->middleware('permission:rab.edit')->name('rab.update');
    Route::patch('rab/{rab}', [RabController::class, 'update'])->middleware('permission:rab.edit');
    Route::delete('rab/{rab}', [RabController::class, 'destroy'])->middleware('permission:rab.delete')->name('rab.destroy');
    Route::post('rab/{rab}/items', [RabController::class, 'storeItem'])->middleware('permission:rab.create')->name('rab.items.store');
    Route::put('rab-items/{detail}', [RabController::class, 'updateItem'])->middleware('permission:rab.edit')->name('rab.items.update');
    Route::delete('rab-items/{detail}', [RabController::class, 'destroyItem'])->middleware('permission:rab.delete')->name('rab.items.destroy');

    Route::get('master-data', [MasterDataController::class, 'index'])->middleware('permission:master_data.view')->name('master-data.index');
    Route::post('master-data/{type}', [MasterDataController::class, 'store'])->middleware('permission:master_data.create')->name('master-data.store');
    Route::put('master-data/{type}/{id}', [MasterDataController::class, 'update'])->middleware('permission:master_data.edit')->name('master-data.update');
    Route::delete('master-data/{type}/{id}', [MasterDataController::class, 'destroy'])->middleware('permission:master_data.delete')->name('master-data.destroy');

    Route::get('reports', ReportController::class)->middleware('permission:reports.view')->name('reports.index');

    Route::get('users-management', [UserManagementController::class, 'index'])->middleware('permission:users.view')->name('users-management.index');
    Route::get('users-management/create', [UserManagementController::class, 'create'])->middleware('permission:users.create')->name('users-management.create');
    Route::post('users-management', [UserManagementController::class, 'store'])->middleware('permission:users.create')->name('users-management.store');
    Route::get('users-management/{users_management}', [UserManagementController::class, 'show'])->middleware('permission:users.show')->name('users-management.show');
    Route::get('users-management/{users_management}/edit', [UserManagementController::class, 'edit'])->middleware('permission:users.edit')->name('users-management.edit');
    Route::put('users-management/{users_management}', [UserManagementController::class, 'update'])->middleware('permission:users.edit')->name('users-management.update');
    Route::patch('users-management/{users_management}', [UserManagementController::class, 'update'])->middleware('permission:users.edit');
    Route::delete('users-management/{users_management}', [UserManagementController::class, 'destroy'])->middleware('permission:users.delete')->name('users-management.destroy');

    Route::middleware('role:superadmin,admin')->group(function () {
        Route::get('role-permissions', [RolePermissionController::class, 'index'])->name('role-permissions.index');
        Route::put('role-permissions/{role}', [RolePermissionController::class, 'update'])->name('role-permissions.update');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
