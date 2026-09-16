<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Quiz::with('guru:id,name')
            ->withCount('questions');

        if ($user) {
            if ($user->role === 'guru' && $user->jenjang) {
                $query->where(function ($q) use ($user) {
                    $q->where('jenjang', $user->jenjang)
                      ->orWhere('guru_id', $user->id);
                });
            } elseif ($user->role === 'siswa' && $user->jenjang) {
                $query->where(function ($q) use ($user) {
                    $q->where('jenjang', $user->jenjang)
                      ->orWhereNull('jenjang');
                });
            }
        }

        if ($request->has('jenjang') && !empty($request->input('jenjang'))) {
            $query->where('jenjang', $request->input('jenjang'));
        }

        $quizzes = $query->latest()->paginate(15);

        return response()->json($quizzes);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'judul'        => 'required|string|max:255',
            'durasi_menit' => 'required|integer|min:1',
            'tipe'         => 'nullable|string|max:100',
            'jenjang'      => 'nullable|string|in:SD,SMP',
        ]);

        $jenjang = $data['jenjang'] ?? $request->user()->jenjang ?? 'SD';

        $quiz = Quiz::create(array_merge($data, [
            'guru_id' => $request->user()->id,
            'jenjang' => $jenjang,
        ]));

        return response()->json($quiz, 201);
    }

    public function show(Quiz $quiz)
    {
        return response()->json(
            $quiz->load(['questions.options', 'questions.attachments'])
        );
    }

    public function update(Request $request, Quiz $quiz)
    {
        $this->authorizeGuru($request, $quiz->guru_id);

        $data = $request->validate([
            'judul'        => 'sometimes|required|string|max:255',
            'durasi_menit' => 'sometimes|required|integer|min:1',
            'tipe'         => 'nullable|string|max:100',
        ]);

        $quiz->update($data);

        return response()->json($quiz);
    }

    public function destroy(Request $request, Quiz $quiz)
    {
        $this->authorizeGuru($request, $quiz->guru_id);

        $quiz->delete();

        return response()->json(['message' => 'Kuis berhasil dihapus']);
    }

    protected function authorizeGuru(Request $request, int $guruId): void
    {
        abort_if($request->user()->id !== $guruId, 403, 'Tidak diizinkan mengubah kuis ini.');
    }
}
