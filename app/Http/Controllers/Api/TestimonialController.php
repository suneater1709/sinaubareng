<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Public listing: Get approved testimonials for landing page
     */
    public function indexPublic(Request $request)
    {
        $testimonials = Testimonial::approved()
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json($testimonials);
    }

    /**
     * Public submission: Parent submits a testimonial (moderated)
     */
    public function storePublic(Request $request)
    {
        $validated = $request->validate([
            'nama_orang_tua' => 'required|string|max:191',
            'kelas_anak'     => 'required|string|max:191',
            'rating'         => 'required|integer|min:1|max:5',
            'pesan'          => 'required|string|max:1000',
            'foto_url'       => 'nullable|string|max:255',
        ]);

        $testimonial = Testimonial::create([
            'nama_orang_tua' => $validated['nama_orang_tua'],
            'kelas_anak'     => $validated['kelas_anak'],
            'rating'         => $validated['rating'],
            'pesan'          => $validated['pesan'],
            'foto_url'       => $validated['foto_url'] ?? null,
            'status'         => 'pending',
        ]);

        return response()->json([
            'message' => 'Terima kasih! Testimoni Anda telah kami terima dan akan tampil setelah diverifikasi oleh Admin.',
            'data'    => $testimonial,
        ], 201);
    }

    /**
     * Admin listing: View all testimonials with optional status filter
     */
    public function indexAdmin(Request $request)
    {
        $query = Testimonial::query();

        if ($request->has('status') && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $request->status);
        }

        $testimonials = $query->orderBy('created_at', 'desc')->get();

        return response()->json($testimonials);
    }

    /**
     * Admin status update: Approve / Reject
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Status testimoni berhasil diperbarui.',
            'data'    => $testimonial,
        ]);
    }

    /**
     * Admin direct create / add testimonial
     */
    public function storeAdmin(Request $request)
    {
        $validated = $request->validate([
            'nama_orang_tua' => 'required|string|max:191',
            'kelas_anak'     => 'required|string|max:191',
            'rating'         => 'required|integer|min:1|max:5',
            'pesan'          => 'required|string|max:1000',
            'foto_url'       => 'nullable|string|max:255',
            'status'         => 'required|in:pending,approved,rejected',
        ]);

        $testimonial = Testimonial::create($validated);

        return response()->json([
            'message' => 'Testimoni berhasil ditambahkan.',
            'data'    => $testimonial,
        ], 201);
    }

    /**
     * Admin delete testimonial
     */
    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();

        return response()->json([
            'message' => 'Testimoni berhasil dihapus.',
        ]);
    }
}
