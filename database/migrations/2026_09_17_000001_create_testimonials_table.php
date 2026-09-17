<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('nama_orang_tua', 191);
            $table->string('kelas_anak', 191)->nullable(); // e.g. "Orang Tua Siswa Kelas 5 SD"
            $table->tinyInteger('rating')->default(5);
            $table->text('pesan');
            $table->string('foto_url', 255)->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
