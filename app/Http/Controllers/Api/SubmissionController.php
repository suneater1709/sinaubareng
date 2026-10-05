<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Quiz;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubmissionController extends Controller
{
    /**
     * Siswa mengirimkan jawaban kuis.
     */
    public function submit(Request $request, Quiz $quiz)
    {
        $data = $request->validate([
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.jawaban_teks' => 'nullable|string',
            'answers.*.selected_option_id' => 'nullable|exists:question_options,id',
        ]);

        return DB::transaction(function () use ($request, $quiz, $data) {
            $submission = Submission::create([
                'quiz_id' => $quiz->id,
                'siswa_id' => $request->user()->id,
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);

            // Batch preload all relevant questions and options in 1 query
            $questionIds = collect($data['answers'])->pluck('question_id')->unique();
            $questions = $quiz->questions()
                ->whereIn('id', $questionIds)
                ->with(['options' => function ($q) {
                    $q->select(['id', 'question_id', 'is_benar']);
                }])
                ->get()
                ->keyBy('id');

            $skorBenar = 0;
            $totalPg = 0;
            $answersToCreate = [];
            $now = now();

            foreach ($data['answers'] as $item) {
                $questionId = $item['question_id'];
                $question = $questions->get($questionId);
                $selectedOptionId = $item['selected_option_id'] ?? null;
                $jawabanTeks = $item['jawaban_teks'] ?? null;

                if ($question && $question->tipe === 'pilihan_ganda' && $selectedOptionId) {
                    $totalPg++;
                    $isBenar = $question->options->contains(function ($opt) use ($selectedOptionId) {
                        return $opt->id == $selectedOptionId && $opt->is_benar;
                    });

                    if ($isBenar) {
                        $skorBenar++;
                    }
                }

                $answersToCreate[] = [
                    'submission_id' => $submission->id,
                    'question_id' => $questionId,
                    'jawaban_teks' => $jawabanTeks,
                    'selected_option_id' => $selectedOptionId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            if (! empty($answersToCreate)) {
                Answer::insert($answersToCreate);
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
        });
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
            'grades' => 'required|array|min:1',
            'grades.*.answer_id' => 'required|exists:answers,id',
            'grades.*.nilai_esai' => 'nullable|numeric|min:0|max:100',
            'grades.*.feedback' => 'nullable|string',
        ]);

        DB::transaction(function () use ($data, $submission) {
            foreach ($data['grades'] as $grade) {
                Answer::where('id', $grade['answer_id'])
                    ->where('submission_id', $submission->id)
                    ->update([
                        'nilai_esai' => $grade['nilai_esai'] ?? null,
                        'feedback' => $grade['feedback'] ?? null,
                    ]);
            }

            $submission->update(['status' => 'dinilai']);
        });

        return response()->json($submission->load('answers'));
    }

    /**
     * Riwayat & hasil belajar siswa.
     */
    public function history(Request $request)
    {
        $submissions = Submission::with(['quiz:id,judul', 'answers.question:id,quiz_id,pertanyaan,tipe', 'answers.selectedOption:id,question_id,teks_opsi,is_benar'])
            ->where('siswa_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($submissions);
    }
}
