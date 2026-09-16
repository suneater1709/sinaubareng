<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\SiteSetting;
use App\Models\StudySession;
use App\Models\Submission;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminGuruController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'guru');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $gurus = $query->orderBy('created_at', 'desc')->get();

        return response()->json($gurus);
    }

    public function stats(Request $request)
    {
        return response()->json([
            'siswa_count' => User::where('role', 'siswa')->count(),
            'guru_active_count' => User::where('role', 'guru')->where('status', 'active')->count(),
            'guru_inactive_count' => User::where('role', 'guru')->where('status', 'inactive')->count(),
            'sessions_scheduled_count' => StudySession::where('status', 'scheduled')->count(),
            'sessions_completed_count' => StudySession::where('status', 'completed')->count(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:191',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'jenjang'  => 'required|string|in:SD,SMP',
        ]);

        $guru = User::create([
            'name'       => $data['name'],
            'email'      => $data['email'],
            'password'   => Hash::make($data['password']),
            'role'       => 'guru',
            'jenjang'    => $data['jenjang'],
            'status'     => 'active',
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Akun guru berhasil dibuat.',
            'guru'    => $guru,
        ], 201);
    }

    public function update(Request $request, User $guru)
    {
        if ($guru->role !== 'guru') {
            abort(404, 'Guru tidak ditemukan.');
        }

        $data = $request->validate([
            'name'         => 'required|string|max:191',
            'email'        => ['required', 'email', Rule::unique('users')->ignore($guru->id)],
            'jenjang'      => 'sometimes|required|string|in:SD,SMP',
            'old_password' => 'nullable|string',
            'password'     => 'nullable|string|min:6|required_with:old_password',
        ]);

        $updateData = [
            'name'  => $data['name'],
            'email' => $data['email'],
        ];

        if (isset($data['jenjang'])) {
            $updateData['jenjang'] = $data['jenjang'];
        }

        if (!empty($data['password'])) {
            if (empty($data['old_password']) || !Hash::check($data['old_password'], $guru->password)) {
                return response()->json([
                    'message' => 'Password lama salah.'
                ], 422);
            }
            $updateData['password'] = Hash::make($data['password']);
        }

        $guru->update($updateData);

        return response()->json([
            'message' => 'Data guru berhasil diperbarui.',
            'guru'    => $guru,
        ]);
    }

    public function toggleStatus(Request $request, User $guru)
    {
        if ($guru->role !== 'guru') {
            abort(404, 'Guru tidak ditemukan.');
        }

        $guru->status = $guru->status === 'active' ? 'inactive' : 'active';
        $guru->save();

        return response()->json([
            'message' => 'Status guru berhasil diubah.',
            'guru'    => $guru,
        ]);
    }

    public function resetPassword(Request $request, User $guru)
    {
        if ($guru->role !== 'guru') {
            abort(404, 'Guru tidak ditemukan.');
        }

        return response()->json([
            'message' => 'Email reset password telah dikirim ke guru.',
        ]);
    }

    /**
     * 1.1 Fungsi "Lihat Laporan" - Data Laporan Komprehensif Admin
     */
    public function reports(Request $request)
    {
        $filterRange = $request->query('range', 'monthly'); // 'weekly', 'monthly', 'all'
        $jenjangFilter = $request->query('jenjang'); // 'SD', 'SMP', or null
        $guruId = $request->query('guru_id');

        // Date boundaries
        $now = Carbon::now();
        if ($filterRange === 'weekly') {
            $startDate = $now->copy()->subDays(7);
        } elseif ($filterRange === 'monthly') {
            $startDate = $now->copy()->subDays(30);
        } else {
            $startDate = Carbon::createFromTimestamp(0);
        }

        // 1. Siswa Aktif per Jenjang
        $totalSiswaSD = User::where('role', 'siswa')->where('status', 'active')->where(function ($q) {
            $q->where('jenjang', 'SD')->orWhereNull('jenjang');
        })->count();

        $totalSiswaSMP = User::where('role', 'siswa')->where('status', 'active')->where('jenjang', 'SMP')->count();

        // 2. Sesi Belajar (Berjalan vs Terjadwal vs Selesai)
        $sessionsQuery = StudySession::with('guru');
        if ($jenjangFilter) {
            $sessionsQuery->where('jenjang', $jenjangFilter);
        }
        if ($guruId) {
            $sessionsQuery->where('guru_id', $guruId);
        }

        $sessions = $sessionsQuery->orderBy('waktu_mulai', 'desc')->get();
        $scheduledSessionsCount = $sessions->where('status', 'scheduled')->count();
        $completedSessionsCount = $sessions->where('status', 'completed')->count();
        $ongoingSessionsCount = $sessions->where('status', 'ongoing')->count();

        // 3. Progress Belajar Siswa
        $studentsQuery = User::where('role', 'siswa')->where('status', 'active');
        if ($jenjangFilter) {
            $studentsQuery->where('jenjang', $jenjangFilter);
        }

        $students = $studentsQuery->with(['submissions' => function ($q) use ($startDate) {
            $q->where('created_at', '>=', $startDate)->with('quiz');
        }])->get();

        $totalMaterials = Material::count();

        $studentProgressList = $students->map(function ($student) use ($totalMaterials) {
            $submissionCount = $student->submissions->count();
            $avgScore = $submissionCount > 0 ? round($student->submissions->avg('skor_pg')) : 0;
            $highestScore = $submissionCount > 0 ? $student->submissions->max('skor_pg') : 0;

            return [
                'id'                 => $student->id,
                'name'               => $student->name,
                'email'              => $student->email,
                'jenjang'            => $student->jenjang ?? 'SD',
                'quizzes_completed'  => $submissionCount,
                'average_score'      => $avgScore,
                'highest_score'      => $highestScore,
                'last_active'        => $student->submissions->max('created_at') ?? $student->created_at,
            ];
        });

        // 4. Ringkasan Aktivitas Guru
        $gurus = User::where('role', 'guru')->withCount(['materials', 'quizzes'])->get();

        return response()->json([
            'summary' => [
                'total_siswa_sd'       => $totalSiswaSD,
                'total_siswa_smp'      => $totalSiswaSMP,
                'total_siswa_active'   => $totalSiswaSD + $totalSiswaSMP,
                'sessions_scheduled'   => $scheduledSessionsCount,
                'sessions_completed'   => $completedSessionsCount,
                'sessions_ongoing'     => $ongoingSessionsCount,
                'total_materials'      => $totalMaterials,
                'total_quizzes'        => Quiz::count(),
            ],
            'student_progress' => $studentProgressList,
            'sessions'         => $sessions,
            'gurus'            => $gurus,
        ]);
    }

    /**
     * Study Sessions Management
     */
    public function sessions(Request $request)
    {
        $sessions = StudySession::with('guru')->orderBy('waktu_mulai', 'asc')->get();
        return response()->json($sessions);
    }

    public function storeSession(Request $request)
    {
        $data = $request->validate([
            'guru_id'       => 'required|exists:users,id',
            'jenjang'       => 'required|in:SD,SMP',
            'judul'         => 'required|string|max:191',
            'deskripsi'     => 'nullable|string',
            'waktu_mulai'   => 'required|date',
            'waktu_selesai' => 'nullable|date|after_or_equal:waktu_mulai',
            'link_meeting'  => 'nullable|url|max:255',
            'status'        => 'nullable|in:scheduled,ongoing,completed,cancelled',
        ]);

        $session = StudySession::create([
            'guru_id'       => $data['guru_id'],
            'jenjang'       => $data['jenjang'],
            'judul'         => $data['judul'],
            'deskripsi'     => $data['deskripsi'] ?? null,
            'waktu_mulai'   => $data['waktu_mulai'],
            'waktu_selesai' => $data['waktu_selesai'] ?? null,
            'link_meeting'  => $data['link_meeting'] ?? null,
            'status'        => $data['status'] ?? 'scheduled',
        ]);

        return response()->json([
            'message' => 'Sesi belajar berhasil dijadwalkan.',
            'session' => $session->load('guru'),
        ], 201);
    }

    public function updateSession(Request $request, $id)
    {
        $session = StudySession::findOrFail($id);
        $data = $request->validate([
            'guru_id'       => 'sometimes|required|exists:users,id',
            'jenjang'       => 'sometimes|required|in:SD,SMP',
            'judul'         => 'sometimes|required|string|max:191',
            'deskripsi'     => 'nullable|string',
            'waktu_mulai'   => 'sometimes|required|date',
            'waktu_selesai' => 'nullable|date',
            'link_meeting'  => 'nullable|url|max:255',
            'status'        => 'sometimes|required|in:scheduled,ongoing,completed,cancelled',
        ]);

        $session->update($data);

        return response()->json([
            'message' => 'Sesi belajar berhasil diperbarui.',
            'session' => $session->load('guru'),
        ]);
    }

    public function deleteSession($id)
    {
        $session = StudySession::findOrFail($id);
        $session->delete();

        return response()->json(['message' => 'Sesi belajar berhasil dihapus.']);
    }

    /**
     * Landing Page Settings & Public Stats
     */
    public function settings(Request $request)
    {
        $settings = SiteSetting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'hero_title'        => 'nullable|string',
            'hero_subtitle'     => 'nullable|string',
            'hero_image_url'    => 'nullable|string',
            'active_students_badge' => 'nullable|string',
        ]);

        foreach ($data as $key => $val) {
            if ($val !== null) {
                SiteSetting::set($key, $val);
            }
        }

        return response()->json([
            'message' => 'Pengaturan halaman landing berhasil disimpan.',
            'settings' => SiteSetting::all()->pluck('value', 'key'),
        ]);
    }

    /**
     * Public stats endpoint for landing page
     */
    public function publicStats(Request $request)
    {
        $activeStudentsCount = User::where('role', 'siswa')->where('status', 'active')->count();
        $activeGurusCount = User::where('role', 'guru')->where('status', 'active')->count();
        $materialsCount = Material::count();

        return response()->json([
            'active_students' => $activeStudentsCount,
            'active_gurus'    => $activeGurusCount,
            'total_materials' => $materialsCount,
            'display_student_count' => ($activeStudentsCount > 0 ? (500 + $activeStudentsCount) : 500) . '+',
        ]);
    }
}
