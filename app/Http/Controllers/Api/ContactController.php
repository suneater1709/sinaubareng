<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    const TARGET_EMAIL = 'ahmadnurdiyansyah26@gmail.com';

    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'nama'     => 'required|string|max:191',
            'whatsapp' => 'required|string|max:50',
            'jenjang'  => 'required|string|max:50',
            'pesan'    => 'required|string',
        ]);

        $content = "Pesan Baru dari Formulir Kontak Sinaubareng:\n\n"
            . "Nama Orang Tua: {$validated['nama']}\n"
            . "Nomor WhatsApp: {$validated['whatsapp']}\n"
            . "Jenjang Sekolah Anak: {$validated['jenjang']}\n"
            . "Pesan:\n{$validated['pesan']}\n\n"
            . "Dikirim pada: " . now()->format('Y-m-d H:i:s');

        try {
            Mail::raw($content, function ($message) use ($validated) {
                $message->to(self::TARGET_EMAIL)
                        ->subject("Pesan Baru Kontak: {$validated['nama']} ({$validated['jenjang']})");
            });
        } catch (\Throwable $e) {
            Log::error('Failed to send contact email: ' . $e->getMessage());
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Pesan berhasil dikirim.',
            'data'    => $validated,
        ]);
    }

    public function scheduleVisit(Request $request)
    {
        $validated = $request->validate([
            'nama'     => 'required|string|max:191',
            'whatsapp' => 'required|string|max:50',
            'tanggal'  => 'required|date',
            'catatan'  => 'nullable|string',
            'jenjang'  => 'nullable|string|max:50',
        ]);

        $content = "Jadwal Kunjungan Baru - Sinaubareng:\n\n"
            . "Nama Pengunjung: {$validated['nama']}\n"
            . "Nomor WhatsApp: {$validated['whatsapp']}\n"
            . "Tanggal Kunjungan: {$validated['tanggal']}\n"
            . "Jenjang: " . ($validated['jenjang'] ?? '-') . "\n"
            . "Catatan/Keperluan:\n" . ($validated['catatan'] ?? '-') . "\n\n"
            . "Dibuat pada: " . now()->format('Y-m-d H:i:s');

        try {
            Mail::raw($content, function ($message) use ($validated) {
                $message->to(self::TARGET_EMAIL)
                        ->subject("Jadwal Kunjungan Baru: {$validated['nama']} ({$validated['tanggal']})");
            });
        } catch (\Throwable $e) {
            Log::error('Failed to send schedule visit email: ' . $e->getMessage());
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Jadwal kunjungan berhasil dikirim.',
            'data'    => $validated,
        ]);
    }
}
