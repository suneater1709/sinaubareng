<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Quiz;
use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    /**
     * Siswa mengirimkan jawaban kuis.
     */
    public function submit(Request $request, Quiz $quiz)
    {
        $data = $request->validate([
            'answers'                     => 'required|array|min:1',
            'answers.*.question_id'       => 'required|exists:questions,id',
            'answers.*.jawaban_teks'      => 'nullable|string',
            'answers.*.selected_option_id' => 'nullable|exists:question_options,id',
        ]);

        $submission = Submission::create([
            'quiz_id'      => $quiz->id,
            'siswa_id'     => $request->user()->id,
            'status'       => 'submitted',
            'submitted_at' => now(),
        ]);

        $skorBenar = 0;
        $totalPg = 0;

        foreach ($data['answers'] as $item) {
            $question = $quiz->questions()->find($item['question_id']);

            $answer = Answer::create([
                'submission_id'      => $submission->id,
                'question_id'        => $item['question_id'],
                'jawaban_teks'       => $item['jawaban_teks'] ?? null,
                'selected_option_id' => $item['selected_option_id'] ?? null,
            ]);

            if ($question && $question->tipe === 'pilihan_ganda' && $answer->selected_option_id) {
                $totalPg++;
                $isBenar = $question->options()
                    ->where('id', $answer->selected_option_id)
                    ->where('is_benar', true)
                    ->exists();

                if ($isBenar) {
                    $skorBenar++;
                }
            }
        }

        // Kalkulasi otomatis skor pilihan ganda (skala 0-100)
        if ($totalPg > 0) {
            $submission->update([
                'skor_pg' => round(($skorBenar / $totalPg) * 100, 2),
            ]);
        }

        return response()->json(
            $submission->load('answers'),
            201
        );
    }

    /**
     * Guru melihat daftar submission untuk sebuah kuis.
     */
    public function index(Request $request, Quiz $quiz)
    {
        $submissions = $quiz->submissions()
            ->with(['siswa:id,name', 'answers'])
            ->latest()
            ->get();

        return response()->json($submissions);
    }

    /**
     * Guru menilai esai + memberi feedback per jawaban.
     */
    public function grade(Request $request, Submission $submission)
    {
        $data = $request->validate([
            'grades'                 => 'required|array|min:1',
            'grades.*.answer_id'     => 'required|exists:answers,id',
            'grades.*.nilai_esai'    => 'nullable|numeric|min:0|max:100',
            'grades.*.feedback'      => 'nullable|string',
        ]);

        foreach ($data['grades'] as $grade) {
            Answer::where('id', $grade['answer_id'])
                ->where('submission_id', $submission->id)
                ->update([
                    'nilai_esai' => $grade['nilai_esai'] ?? null,
                    'feedback'   => $grade['feedback'] ?? null,
                ]);
        }

        $submission->update(['status' => 'dinilai']);

        return response()->json($submission->load('answers'));
    }

    /**
     * Riwayat & hasil belajar siswa.
     */
    public function history(Request $request)
    {
        $submissions = Submission::with(['quiz:id,judul', 'answers.question', 'answers.selectedOption'])
            ->where('siswa_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($submissions);
    }
}
