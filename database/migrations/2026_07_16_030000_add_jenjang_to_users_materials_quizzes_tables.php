<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('jenjang', 20)->nullable()->after('role'); // 'SD' or 'SMP'
        });

        Schema::table('materials', function (Blueprint $table) {
            $table->string('jenjang', 20)->nullable()->after('guru_id'); // 'SD' or 'SMP'
        });

        Schema::table('quizzes', function (Blueprint $table) {
            $table->string('jenjang', 20)->nullable()->after('guru_id'); // 'SD' or 'SMP'
        });
    }

    public function down(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            $table->dropColumn('jenjang');
        });

        Schema::table('materials', function (Blueprint $table) {
            $table->dropColumn('jenjang');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('jenjang');
        });
    }
};
