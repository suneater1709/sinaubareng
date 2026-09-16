<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Notification;
use App\Models\SiteSetting;
use App\Models\StudySession;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@sinaubareng.com'],
            [
                'name' => 'Admin Sinaubareng',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        // 2. Akun Guru SD
        $guruSD = User::updateOrCreate(
            ['email' => 'guru@sinaubareng.com'],
            [
                'name' => 'Ustadz Ahmad Fauzi, S.Pd.',
                'password' => Hash::make('password123'),
                'role' => 'guru',
                'jenjang' => 'SD',
                'status' => 'active',
            ]
        );

        // 3. Akun Guru SMP
        $guruSMP = User::updateOrCreate(
            ['email' => 'sb.google.guru@gmail.com'],
            [
                'name' => 'Dr. Sarah (Mentor SMP)',
                'password' => Hash::make('googleAuthPassword123'),
                'role' => 'guru',
                'jenjang' => 'SMP',
                'status' => 'active',
            ]
        );

        // 4. Akun Siswa SD
        $siswaSD = User::updateOrCreate(
            ['email' => 'siswa@sinaubareng.com'],
            [
                'name' => 'Muhammad Rizky',
                'password' => Hash::make('password123'),
                'role' => 'siswa',
                'jenjang' => 'SD',
                'status' => 'active',
            ]
        );

        // 5. Akun Siswa SMP Tambahan
        $siswaSMP = User::updateOrCreate(
            ['email' => 'sb.google.siswa@gmail.com'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password123'),
                'role' => 'siswa',
                'jenjang' => 'SMP',
                'status' => 'active',
            ]
        );

        $siswaAlya = User::updateOrCreate(
            ['email' => 'alya.putri@gmail.com'],
            [
                'name' => 'Alya Putri Lestari',
                'password' => Hash::make('password123'),
                'role' => 'siswa',
                'jenjang' => 'SD',
                'status' => 'active',
            ]
        );

        $siswaCitra = User::updateOrCreate(
            ['email' => 'citra.dewi@gmail.com'],
            [
                'name' => 'Citra Dewi Anggraini',
                'password' => Hash::make('password123'),
                'role' => 'siswa',
                'jenjang' => 'SMP',
                'status' => 'active',
            ]
        );

        // 6. Sample Study Sessions
        StudySession::updateOrCreate(
            ['judul' => 'Pendalaman Konsep Pecahan & Aljabar Dasar'],
            [
                'guru_id' => $guruSD->id,
                'jenjang' => 'SD',
                'deskripsi' => 'Sesi tatap muka interaktif untuk menguatkan pemahaman pecahan dengan studi kasus visual.',
                'waktu_mulai' => Carbon::now()->addDays(1)->setHour(9)->setMinute(0),
                'waktu_selesai' => Carbon::now()->addDays(1)->setHour(10)->setMinute(30),
                'link_meeting' => 'https://meet.google.com/stu-gether-sd',
                'status' => 'scheduled',
            ]
        );

        StudySession::updateOrCreate(
            ['judul' => 'English Speaking & Grammar Mastery SMP'],
            [
                'guru_id' => $guruSMP->id,
                'jenjang' => 'SMP',
                'deskripsi' => 'Latihan percakapan aktif bahasa Inggris dan bedah soal reading comprehension.',
                'waktu_mulai' => Carbon::now()->addDays(2)->setHour(14)->setMinute(0),
                'waktu_selesai' => Carbon::now()->addDays(2)->setHour(15)->setMinute(30),
                'link_meeting' => 'https://meet.google.com/stu-gether-smp',
                'status' => 'scheduled',
            ]
        );

        StudySession::updateOrCreate(
            ['judul' => 'Review Kuis Mingguan & Tips Belajar Efektif'],
            [
                'guru_id' => $guruSD->id,
                'jenjang' => 'SD',
                'deskripsi' => 'Sesi evaluasi hasil pengerjaan kuis bersama guru pembimbing.',
                'waktu_mulai' => Carbon::now()->subDays(2)->setHour(10)->setMinute(0),
                'waktu_selesai' => Carbon::now()->subDays(2)->setHour(11)->setMinute(30),
                'link_meeting' => 'https://meet.google.com/stu-gether-eval',
                'status' => 'completed',
            ]
        );

        // 7. Sample Messages
        Message::updateOrCreate(
            ['sender_id' => $siswaSD->id, 'receiver_id' => $guruSD->id, 'content' => 'Assalamu’alaikum Ustadz, mau tanya untuk materi pecahan pada modul 2 apakah ada latihan tambahan?'],
            [
                'sender_role' => 'siswa',
                'receiver_role' => 'guru',
                'is_read' => true,
                'created_at' => Carbon::now()->subHours(3),
            ]
        );

        Message::updateOrCreate(
            ['sender_id' => $guruSD->id, 'receiver_id' => $siswaSD->id, 'content' => 'Wa’alaikumsalam Rizky, silakan kerjakan kuis simulasi bab 2 di Pusat Kuis ya, sudah Ustadz siapkan pembahasannya.'],
            [
                'sender_role' => 'guru',
                'receiver_role' => 'siswa',
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(2),
            ]
        );

        Message::updateOrCreate(
            ['sender_id' => $guruSD->id, 'receiver_id' => $admin->id, 'content' => 'Selamat siang Admin, mohon bantuan untuk approval jadwal sesi tambahan kelas SD minggu ini.'],
            [
                'sender_role' => 'guru',
                'receiver_role' => 'admin',
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(1),
            ]
        );

        // 8. Sample Notifications
        Notification::updateOrCreate(
            ['title' => 'Sesi Belajar Baru Dijadwalkan'],
            [
                'user_id' => $siswaSD->id,
                'message' => 'Sesi "Pendalaman Konsep Pecahan" telah dijadwalkan untuk besok jam 09:00 WIB.',
                'type' => 'session',
                'link' => '/sessions',
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(2),
            ]
        );

        Notification::updateOrCreate(
            ['title' => 'Laporan Kemajuan Belajar Tersedia'],
            [
                'user_id' => $admin->id,
                'message' => 'Ringkasan laporan aktivitas mingguan murid dan sesi guru telah diperbarui.',
                'type' => 'report',
                'link' => '/admin/reports',
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(4),
            ]
        );

        // 9. Default Site Settings
        SiteSetting::set('hero_title', "Cerdaskan Si Kecil dengan Adab & Prestasi");
        SiteSetting::set('hero_subtitle', "Fokus pada penguasaan Matematika & Bahasa Inggris untuk SD-SMP dengan lingkungan belajar yang islami, suportif, dan menyenangkan.");
        SiteSetting::set('hero_image_url', "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop");
        SiteSetting::set('active_students_badge', "500+");
    }
}
