<?php
require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Database default: " . config('database.default') . PHP_EOL;
echo "SQLite DB path: " . config('database.connections.sqlite.database') . PHP_EOL;

$users = App\Models\User::all();
echo "Total users: " . $users->count() . PHP_EOL;
foreach ($users as $u) {
    echo "ID: {$u->id}, Email: '{$u->email}', Role: {$u->role}, Pass check(password123): " . (Illuminate\Support\Facades\Hash::check('password123', $u->password) ? 'MATCH' : 'NO') . PHP_EOL;
}
