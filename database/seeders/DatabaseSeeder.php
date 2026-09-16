<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Guru Utama
        User::updateOrCreate(
            ['email' => 'guru@sinaubareng.com'],
            [
                'name' => 'Ustadz Ahmad Fauzi, S.Pd.',
                'password' => Hash::make('password123'),
                'role' => 'guru',
                'status' => 'active',
            ]
        );

        // 2. Akun Guru Demo Google
        User::updateOrCreate(
            ['email' => 'sb.google.guru@gmail.com'],
            [
                'name' => 'Dr. Sarah (Google Mentor)',
                'password' => Hash::make('googleAuthPassword123'),
                'role' => 'guru',
                'status' => 'active',
            ]
        );

        // 3. Akun Siswa Utama
        User::updateOrCreate(
            ['email' => 'siswa@sinaubareng.com'],
            [
                'name' => 'Muhammad Rizky',
                'password' => Hash::make('password123'),
                'role' => 'siswa',
                'status' => 'active',
            ]
        );

        // 4. Akun Admin
        User::updateOrCreate(
            ['email' => 'admin@sinaubareng.com'],
            [
                'name' => 'Admin Sinaubareng',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );
    }
}
