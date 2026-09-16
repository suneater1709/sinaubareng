<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Contoh pemakaian di routes/api.php:
     * Route::post('/materials', [MaterialController::class, 'store'])
     *      ->middleware('role:guru');
     */
    public function handle(Request $request, Closure $next, string $role)
    {
        if (! $request->user() || $request->user()->role !== $role) {
            abort(403, "Hanya akun dengan role '{$role}' yang bisa mengakses endpoint ini.");
        }

        return $next($request);
    }
}
