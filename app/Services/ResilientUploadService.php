<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ResilientUploadService
{
    /**
     * Batas waktu (detik) untuk mencoba jalur utama (Storage)
     * sebelum jatuh ke fallback Base64.
     */
    protected float $timeoutSeconds = 1.5;

    protected string $disk;

    public function __construct(string $disk = 'public')
    {
        $this->disk = $disk;
    }

    /**
     * Upload file dengan strategi dual-path.
     *
     * @return array{file_path: ?string, file_base64: ?string, storage_type: string, mime_type: string}
     */
    public function upload(UploadedFile $file, string $folder = 'uploads'): array
    {
        $mimeType = $file->getMimeType();

        try {
            $path = $this->uploadWithTimeout($file, $folder);

            if ($path) {
                return [
                    'file_path'    => $path,
                    'file_base64'  => null,
                    'storage_type' => 'storage',
                    'mime_type'    => $mimeType,
                ];
            }
        } catch (\Throwable $e) {
            Log::warning('ResilientUploadService: gagal upload ke storage, fallback ke base64', [
                'error' => $e->getMessage(),
            ]);
        }

        // Jalur cadangan: convert ke base64 dan simpan langsung di DB
        $base64 = 'data:' . $mimeType . ';base64,' . base64_encode(file_get_contents($file->getRealPath()));

        return [
            'file_path'    => null,
            'file_base64'  => $base64,
            'storage_type' => 'base64',
            'mime_type'    => $mimeType,
        ];
    }

    /**
     * Coba simpan file ke disk dengan simulasi batas waktu.
     * Catatan: PHP tidak punya "timeout" native untuk operasi filesystem lokal,
     * jadi di sini kita bungkus dengan pengecekan durasi manual.
     * Untuk disk 's3', konfigurasi timeout bisa diatur di config/filesystems.php
     * pada opsi client S3 (http => ['timeout' => 1.5]).
     */
    protected function uploadWithTimeout(UploadedFile $file, string $folder): ?string
    {
        $start = microtime(true);

        $path = Storage::disk($this->disk)->putFile($folder, $file);

        $elapsed = microtime(true) - $start;

        if ($elapsed > $this->timeoutSeconds || $path === false) {
            // Anggap gagal walau file sempat tersimpan, supaya konsisten
            // dengan strategi "jangan pernah stuck loading".
            if ($path) {
                Storage::disk($this->disk)->delete($path);
            }
            return null;
        }

        return $path;
    }
}
