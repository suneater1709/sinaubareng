<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    /**
     * Public listing: Get active FAQs ordered by urutan and creation time
     */
    public function indexPublic()
    {
        $faqs = Faq::active()
            ->orderBy('urutan', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($faqs);
    }

    /**
     * Admin listing: Get all FAQs (including inactive) with optional category filter
     */
    public function indexAdmin(Request $request)
    {
        $query = Faq::query();

        if ($request->has('kategori') && !empty($request->kategori)) {
            $query->where('kategori', $request->kategori);
        }

        if ($request->has('search') && !empty($request->search)) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('pertanyaan', 'like', "%{$s}%")
                  ->orWhere('jawaban', 'like', "%{$s}%");
            });
        }

        $faqs = $query->orderBy('urutan', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($faqs);
    }

    /**
     * Admin store: Create new FAQ
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pertanyaan' => 'required|string|max:255',
            'jawaban'    => 'required|string',
            'kategori'   => 'nullable|string|max:100',
            'urutan'     => 'nullable|integer',
            'is_active'  => 'nullable|boolean',
        ]);

        $faq = Faq::create([
            'pertanyaan' => $validated['pertanyaan'],
            'jawaban'    => $validated['jawaban'],
            'kategori'   => $validated['kategori'] ?? 'Umum',
            'urutan'     => $validated['urutan'] ?? 0,
            'is_active'  => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'FAQ berhasil ditambahkan.',
            'faq'     => $faq,
        ], 201);
    }

    /**
     * Admin update: Update existing FAQ
     */
    public function update(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);

        $validated = $request->validate([
            'pertanyaan' => 'sometimes|required|string|max:255',
            'jawaban'    => 'sometimes|required|string',
            'kategori'   => 'nullable|string|max:100',
            'urutan'     => 'nullable|integer',
            'is_active'  => 'nullable|boolean',
        ]);

        $faq->update($validated);

        return response()->json([
            'message' => 'FAQ berhasil diperbarui.',
            'faq'     => $faq,
        ]);
    }

    /**
     * Admin destroy: Delete FAQ
     */
    public function destroy($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        return response()->json([
            'message' => 'FAQ berhasil dihapus.',
        ]);
    }
}
