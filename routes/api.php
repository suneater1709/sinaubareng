<?php

use App\Http\Controllers\Api\AdminGuruController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\SubmissionController;
use Illuminate\Support\Facades\Route;

// =========================================================
// PUBLIC ROUTES
// =========================================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/contact', [ContactController::class, 'submitContact']);
Route::post('/schedule-visit', [ContactController::class, 'scheduleVisit']);

// =========================================================
// TERPROTEKSI (butuh token Sanctum)
// =========================================================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ----- Students (Guru & Admin) -----
    Route::get('/students', [StudentController::class, 'index']);

    // ----- Admin Routes -----
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminGuruController::class, 'stats']);
        Route::get('/guru', [AdminGuruController::class, 'index']);
        Route::post('/guru', [AdminGuruController::class, 'store']);
        Route::put('/guru/{guru}', [AdminGuruController::class, 'update']);
        Route::patch('/guru/{guru}/status', [AdminGuruController::class, 'toggleStatus']);
        Route::post('/guru/{guru}/reset-password', [AdminGuruController::class, 'resetPassword']);
    });

    // ----- Materials -----
    Route::get('/materials', [MaterialController::class, 'index']);
    Route::post('/materials', [MaterialController::class, 'store']); // role: guru
    Route::get('/materials/{material}', [MaterialController::class, 'show']);
    Route::put('/materials/{material}', [MaterialController::class, 'update']); // role: guru
    Route::delete('/materials/{material}', [MaterialController::class, 'destroy']); // role: guru

    // ----- Quizzes -----
    Route::get('/quizzes', [QuizController::class, 'index']);
    Route::post('/quizzes', [QuizController::class, 'store']); // role: guru
    Route::get('/quizzes/{quiz}', [QuizController::class, 'show']);
    Route::put('/quizzes/{quiz}', [QuizController::class, 'update']); // role: guru
    Route::delete('/quizzes/{quiz}', [QuizController::class, 'destroy']); // role: guru

    // ----- Questions (nested di bawah quiz) -----
    Route::post('/quizzes/{quiz}/questions', [QuestionController::class, 'store']); // role: guru
    Route::put('/questions/{question}', [QuestionController::class, 'update']); // role: guru
    Route::delete('/questions/{question}', [QuestionController::class, 'destroy']); // role: guru

    // ----- Submissions (pengerjaan & penilaian kuis) -----
    Route::post('/quizzes/{quiz}/submit', [SubmissionController::class, 'submit']); // role: siswa
    Route::get('/quizzes/{quiz}/submissions', [SubmissionController::class, 'index']); // role: guru
    Route::put('/submissions/{submission}/grade', [SubmissionController::class, 'grade']); // role: guru

    // ----- Riwayat siswa -----
    Route::get('/history', [SubmissionController::class, 'history']); // role: siswa
});
