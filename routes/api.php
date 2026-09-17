<?php

use App\Http\Controllers\Api\AdminGuruController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\RankingController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\SubmissionController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

// =========================================================
// PUBLIC ROUTES
// =========================================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/contact', [ContactController::class, 'submitContact']);
Route::post('/schedule-visit', [ContactController::class, 'scheduleVisit']);
Route::get('/public/stats', [AdminGuruController::class, 'publicStats']);
Route::get('/public/settings', [AdminGuruController::class, 'settings']);
Route::get('/public/testimonials', [TestimonialController::class, 'indexPublic']);
Route::post('/testimonials', [TestimonialController::class, 'storePublic']);
Route::get('/public/sessions', [AdminGuruController::class, 'sessions']);
Route::get('/public/faqs', [FaqController::class, 'indexPublic']);

// =========================================================
// TERPROTEKSI (butuh token Sanctum)
// =========================================================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ----- Notifications -----
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // ----- Messages (Role Matrix Validated) -----
    Route::get('/messages', [MessageController::class, 'index']);
    Route::get('/messages/{userId}', [MessageController::class, 'thread']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::patch('/messages/{userId}/read', [MessageController::class, 'markAsRead']);

    // ----- Leaderboard / Ranking Real-Time -----
    Route::get('/rankings', [RankingController::class, 'index']);

    // ----- Sessions Schedule (Guru, Siswa, Admin) -----
    Route::get('/sessions', [AdminGuruController::class, 'sessions']);
    Route::post('/sessions', [AdminGuruController::class, 'storeSession']);
    Route::put('/sessions/{id}', [AdminGuruController::class, 'updateSession']);
    Route::delete('/sessions/{id}', [AdminGuruController::class, 'deleteSession']);

    // ----- Students (Guru & Admin) -----
    Route::get('/students', [StudentController::class, 'index']);

    // ----- Admin Routes -----
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminGuruController::class, 'stats']);
        Route::get('/reports', [AdminGuruController::class, 'reports']);
        Route::get('/guru', [AdminGuruController::class, 'index']);
        Route::post('/guru', [AdminGuruController::class, 'store']);
        Route::put('/guru/{guru}', [AdminGuruController::class, 'update']);
        Route::patch('/guru/{guru}/status', [AdminGuruController::class, 'toggleStatus']);
        Route::post('/guru/{guru}/reset-password', [AdminGuruController::class, 'resetPassword']);
        
        // Sessions management
        Route::get('/sessions', [AdminGuruController::class, 'sessions']);
        Route::post('/sessions', [AdminGuruController::class, 'storeSession']);
        Route::put('/sessions/{id}', [AdminGuruController::class, 'updateSession']);
        Route::delete('/sessions/{id}', [AdminGuruController::class, 'deleteSession']);

        // Site settings & Photo uploads
        Route::get('/settings', [AdminGuruController::class, 'settings']);
        Route::post('/settings', [AdminGuruController::class, 'updateSettings']);
        Route::post('/upload-image', [AdminGuruController::class, 'uploadImage']);

        // Testimonials moderation
        Route::get('/testimonials', [TestimonialController::class, 'indexAdmin']);
        Route::post('/testimonials', [TestimonialController::class, 'storeAdmin']);
        Route::patch('/testimonials/{id}/status', [TestimonialController::class, 'updateStatus']);
        Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);

        // FAQ management
        Route::get('/faqs', [FaqController::class, 'indexAdmin']);
        Route::post('/faqs', [FaqController::class, 'store']);
        Route::put('/faqs/{id}', [FaqController::class, 'update']);
        Route::delete('/faqs/{id}', [FaqController::class, 'destroy']);
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
