<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class RankingController extends Controller
{
    /**
     * Points bonus awarded per completed quiz
     */
    const BONUS_PER_QUIZ = 50;

    /**
     * Get real-time ranking leaderboard for students.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $jenjangFilter = $request->query('jenjang');

        $studentsQuery = User::where('role', 'siswa')
            ->where('status', 'active')
            ->select(['id', 'name', 'email', 'jenjang'])
            ->withSum('submissions as total_score', 'skor_pg')
            ->withCount('submissions as quizzes_completed');

        if ($jenjangFilter) {
            $studentsQuery->where('jenjang', $jenjangFilter);
        }

        $students = $studentsQuery->get();

        $rankings = $students->map(function ($student) use ($currentUser) {
            $totalScore = (float) ($student->total_score ?? 0);
            $quizCount = (int) ($student->quizzes_completed ?? 0);
            // Calculate total gamified real points (score sum + bonus per completed quiz)
            $points = (int) $totalScore + ($quizCount * self::BONUS_PER_QUIZ);

            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'jenjang' => $student->jenjang ?? 'SD',
                'points' => $points,
                'quizzes_completed' => $quizCount,
                'completed_quizzes' => $quizCount,
                'average_score' => $quizCount > 0 ? (int) round($totalScore / $quizCount) : 0,
                'is_current_user' => $currentUser && $currentUser->id === $student->id,
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
            'leaderboard' => $ranked,
            'current_user_rank' => $currentUserRank,
            'total_students' => $ranked->count(),
        ]);
    }
}
