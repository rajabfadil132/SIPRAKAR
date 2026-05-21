<?php

namespace App\Http\Middleware;

use App\Models\Pekerjaan;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user()?->loadMissing(['role.permission','cabang','lembaga']);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'permissions' => $user?->permissionMap() ?? [],
                'isAdmin' => in_array(strtolower($user?->role?->nama_role ?? ''), ['admin','superadmin']),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'notifications' => fn () => $this->notifications($request),
        ];
    }

    private function notifications(Request $request): array
    {
        $user = $request->user();
        if (! $user || ! $user->hasPermission('notifications.view')) {
            return ['count' => 0, 'items' => []];
        }

        $base = Pekerjaan::query()
            ->forCurrentUser()
            ->with(['cabang:id,nama_cabang'])
            ->select(['id', 'kode_pekerjaan', 'nama_pekerjaan', 'target_selesai', 'status', 'progress', 'cabang_id', 'created_at', 'updated_at']);

        $newItems = (clone $base)
            ->where('created_at', '>=', now()->subDays(14))
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($item) => $this->notificationPayload($item, 'Pekerjaan diajukan', 'Pekerjaan baru masuk ke sistem.'));

        $doneItems = (clone $base)
            ->where('status', 'Selesai')
            ->where('updated_at', '>=', now()->subDays(30))
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->map(fn ($item) => $this->notificationPayload($item, 'Pekerjaan selesai', 'Progress pekerjaan sudah 100%.'));

        $deadlineItems = (clone $base)
            ->whereNot('status', 'Selesai')
            ->whereDate('target_selesai', '<=', now()->addDays(7))
            ->orderBy('target_selesai')
            ->limit(6)
            ->get()
            ->map(fn ($item) => $this->notificationPayload($item, 'Mendekati deadline', 'Target selesai dalam 7 hari atau sudah lewat.'));

        $updatedItems = (clone $base)
            ->whereNotColumn('created_at', 'updated_at')
            ->where('updated_at', '>=', now()->subDays(7))
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->map(fn ($item) => $this->notificationPayload($item, 'Status diperbarui', 'Ada perubahan status/progress pekerjaan.'));

        $items = $newItems
            ->merge($doneItems)
            ->merge($deadlineItems)
            ->merge($updatedItems)
            ->unique(fn ($item) => $item['type'].'-'.$item['id'])
            ->sortByDesc('time')
            ->values()
            ->take(12)
            ->all();

        return [
            'count' => count($items),
            'items' => $items,
        ];
    }

    private function notificationPayload(Pekerjaan $item, string $type, string $message): array
    {
        return [
            'id' => $item->id,
            'type' => $type,
            'message' => $message,
            'title' => $item->nama_pekerjaan,
            'code' => $item->kode_pekerjaan,
            'status' => $item->status,
            'progress' => $item->progress,
            'target_selesai' => $item->target_selesai?->format('Y-m-d'),
            'cabang' => $item->cabang?->nama_cabang,
            'time' => optional($item->updated_at ?? $item->created_at)->toISOString(),
            'href' => route('pekerjaan.show', $item, false),
        ];
    }
}
