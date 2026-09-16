<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RankingController extends Controller
{
    /**
     * Get real-time ranking leaderboard for students.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $jenjangFilter = $request->query('jenjang');

        $studentsQuery = User::where('role', 'siswa')
            ->where('status', 'active');

        if ($jenjangFilter) {
            $studentsQuery->where('jenjang', $jenjangFilter);
        }

        $students = $studentsQuery->with(['submissions'])->get();

        $rankings = $students->map(function ($student) use ($currentUser) {
            $totalScore = $student->submissions->sum('skor_pg') ?? 0;
            $quizCount = $student->submissions->count();
            // Calculate total gamified point
            $points = (int) $totalScore + ($quizCount * 50) + 1200;

            return [
                'id'                => $student->id,
                'name'              => $student->name,
                'email'             => $student->email,
                'jenjang'           => $student->jenjang ?? 'SD',
                'points'            => $points,
                'quizzes_completed' => $quizCount,
                'average_score'     => $quizCount > 0 ? round($totalScore / $quizCount) : 0,
                'is_current_user'   => $currentUser && $currentUser->id === $student->id,
            ];
        });

        // Sort descending by points, then by quizzes_completed, then by name
        $sorted = $rankings->sort(function ($a, $b) {
            if ($a['points'] === $b['points']) {
                if ($a['quizzes_completed'] === $b['quizzes_completed']) {
                    return strcmp($a['name'], $b['name']);
                }
                return $b['quizzes_completed'] <=> $a['quizzes_completed'];
            }
            return $b['points'] <=> $a['points'];
        })->values();

        // Attach rank number
        $ranked = $sorted->map(function ($item, $index) {
            $item['rank'] = $index + 1;
            return $item;
        });

        // Current user stats in ranking
        $currentUserRank = null;
        if ($currentUser && $currentUser->role === 'siswa') {
            $currentUserRank = $ranked->firstWhere('id', $currentUser->id);
        }

        return response()->json([
            'leaderboard'       => $ranked,
            'current_user_rank' => $currentUserRank,
            'total_students'    => $ranked->count(),
        ]);
    }
}
