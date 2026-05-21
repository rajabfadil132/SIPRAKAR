Tambahkan relasi berikut ke `app/Models/User.php` bawaan Laravel:

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    public function role() { return $this->belongsTo(\App\Models\Role::class); }
    public function cabang() { return $this->belongsTo(\App\Models\Cabang::class); }
    public function lembaga() { return $this->belongsTo(\App\Models\Lembaga::class); }
}
```

Tambahkan juga middleware alias di bootstrap/app.php Laravel 11/12:

```php
$middleware->alias([
    'role' => \App\Http\Middleware\RoleMiddleware::class,
]);
```
