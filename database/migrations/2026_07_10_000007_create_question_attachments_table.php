<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('question_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();
            $table->enum('tipe_media', ['gambar', 'audio']);
            $table->string('file_path')->nullable();
            $table->longText('file_base64')->nullable();
            $table->enum('storage_type', ['storage', 'base64'])->default('storage');
            $table->string('mime_type')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('question_attachments');
    }
};
