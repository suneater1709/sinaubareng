<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\QuestionAttachment;
use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Services\ResilientUploadService;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    protected ResilientUploadService $uploadService;

    public function __construct(ResilientUploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function store(Request $request, Quiz $quiz)
    {
        $data = $request->validate([
            'tipe'                  => 'required|in:pilihan_ganda,esai',
            'pertanyaan'            => 'required|string',
            'urutan'                => 'nullable|integer|min:1',
            'options'               => 'required_if:tipe,pilihan_ganda|array',
            'options.*.teks_opsi'   => 'required_with:options|string|max:255',
            'options.*.is_benar'    => 'required_with:options|boolean',
            'gambar'                => 'nullable',
            'audio'                 => 'nullable',
        ]);

        $question = Question::create([
            'quiz_id'    => $quiz->id,
            'tipe'       => $data['tipe'],
            'pertanyaan' => $data['pertanyaan'],
            'urutan'     => $data['urutan'] ?? ($quiz->questions()->max('urutan') + 1),
        ]);

        if ($data['tipe'] === 'pilihan_ganda' && ! empty($data['options'])) {
            foreach ($data['options'] as $option) {
                QuestionOption::create([
                    'question_id' => $question->id,
                    'teks_opsi'   => $option['teks_opsi'],
                    'is_benar'    => $option['is_benar'],
                ]);
            }
        }

        foreach (['gambar', 'audio'] as $tipeMedia) {
            if ($request->hasFile($tipeMedia)) {
                $result = $this->uploadService->upload($request->file($tipeMedia), 'questions/' . $tipeMedia);

                QuestionAttachment::create(array_merge(
                    [
                        'question_id' => $question->id,
                        'tipe_media'  => $tipeMedia === 'gambar' ? 'gambar' : 'audio',
                    ],
                    $result
                ));
            } else if ($request->filled($tipeMedia)) {
                $mediaData = $request->input($tipeMedia);
                if (str_starts_with($mediaData, 'data:')) {
                    QuestionAttachment::create([
                        'question_id'  => $question->id,
                        'tipe_media'   => $tipeMedia === 'gambar' ? 'gambar' : 'audio',
                        'file_path'    => null,
                        'file_base64'  => $mediaData,
                        'storage_type' => 'base64',
                        'mime_type'    => explode(';', explode(':', $mediaData)[1])[0] ?? ($tipeMedia === 'gambar' ? 'image/jpeg' : 'audio/mpeg'),
                    ]);
                } else if (filter_var($mediaData, FILTER_VALIDATE_URL)) {
                    QuestionAttachment::create([
                        'question_id'  => $question->id,
                        'tipe_media'   => $tipeMedia === 'gambar' ? 'gambar' : 'audio',
                        'file_path'    => $mediaData,
                        'file_base64'  => null,
                        'storage_type' => 'storage',
                        'mime_type'    => $tipeMedia === 'gambar' ? 'image/jpeg' : 'audio/mpeg',
                    ]);
                }
            }
        }

        return response()->json(
            $question->load(['options', 'attachments']),
            201
        );
    }

    public function update(Request $request, Question $question)
    {
        $data = $request->validate([
            'pertanyaan' => 'sometimes|required|string',
            'urutan'     => 'sometimes|integer|min:1',
        ]);

        $question->update($data);

        return response()->json($question);
    }

    public function destroy(Question $question)
    {
        $question->delete();

        return response()->json(['message' => 'Pertanyaan berhasil dihapus']);
    }
}
