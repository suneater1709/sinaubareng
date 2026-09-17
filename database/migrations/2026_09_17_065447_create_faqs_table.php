<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('pertanyaan');
            $table->text('jawaban');
            $table->string('kategori')->default('Umum');
            $table->integer('urutan')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert initial FAQs
        DB::table('faqs')->insert([
            [
                'pertanyaan' => 'Berapa biaya pendaftaran awal di Stugether?',
                'jawaban'    => 'Biaya pendaftaran awal sangat terjangkau dengan berbagai pilihan paket (Bulanan, Semester, atau Tahunan). Anda juga dapat mencoba sesi konsultasi dan asesmen kemampuan awal secara gratis.',
                'kategori'   => 'Biaya & Paket',
                'urutan'     => 1,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'pertanyaan' => 'Apakah ada kelas percobaan (free trial) gratis?',
                'jawaban'    => 'Ya, kami menyediakan 1x sesi konsultasi dan trial class gratis untuk menguji kesesuaian metode belajar dengan karakter dan kebutuhan ananda.',
                'kategori'   => 'Layanan',
                'urutan'     => 2,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'pertanyaan' => 'Bagaimana kurikulum syar\'i & adab diterapkan?',
                'jawaban'    => 'Setiap sesi diawali dengan doa, pembiasaan adab belajar islami (adab terhadap ilmu & guru), serta materi penguatan akhlak mulia yang diintegrasikan secara natural dalam pelajaran sains dan bahasa.',
                'kategori'   => 'Kurikulum & Adab',
                'urutan'     => 3,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'pertanyaan' => 'Apakah tersedia program beasiswa atau keringanan biaya?',
                'jawaban'    => 'Kami menyediakan program subsidi silang dan beasiswa bagi anak yatim dan siswa berprestasi yang membutuhkan bantuan finansial. Silakan hubungi tim admin kami melalui WhatsApp.',
                'kategori'   => 'Beasiswa',
                'urutan'     => 4,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};
