<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialAttachment;
use App\Services\ResilientUploadService;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    protected ResilientUploadService $uploadService;

    public function __construct(ResilientUploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Material::with(['attachments', 'guru:id,name']);

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

        $materials = $query->latest()->paginate(15);

        return response()->json($materials);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'judul'      => 'required|string|max:255',
            'deskripsi'  => 'nullable|string',
            'jenjang'    => 'nullable|string|in:SD,SMP',
            'attachment' => 'nullable', // allow file or base64 or URL
        ]);

        $jenjang = $data['jenjang'] ?? $request->user()->jenjang ?? 'SD';

        $material = Material::create([
            'guru_id'   => $request->user()->id,
            'jenjang'   => $jenjang,
            'judul'     => $data['judul'],
            'deskripsi' => $data['deskripsi'] ?? null,
        ]);

        if ($request->hasFile('attachment')) {
            $result = $this->uploadService->upload($request->file('attachment'), 'materials');

            MaterialAttachment::create(array_merge(
                ['material_id' => $material->id],
                $result
            ));
        } else if ($request->filled('attachment')) {
            $attachmentData = $request->input('attachment');
            if (str_starts_with($attachmentData, 'data:')) {
                MaterialAttachment::create([
                    'material_id'  => $material->id,
                    'file_path'    => null,
                    'file_base64'  => $attachmentData,
                    'storage_type' => 'base64',
                    'mime_type'    => explode(';', explode(':', $attachmentData)[1])[0] ?? 'application/octet-stream',
                ]);
            } else if (filter_var($attachmentData, FILTER_VALIDATE_URL)) {
                MaterialAttachment::create([
                    'material_id'  => $material->id,
                    'file_path'    => $attachmentData,
                    'file_base64'  => null,
                    'storage_type' => 'storage',
                    'mime_type'    => 'application/octet-stream',
                ]);
            }
        }

        return response()->json($material->load('attachments'), 201);
    }

    public function show(Material $material)
    {
        return response()->json($material->load(['attachments', 'guru:id,name']));
    }

    public function update(Request $request, Material $material)
    {
        $this->authorizeGuru($request, $material->guru_id);

        $data = $request->validate([
            'judul'     => 'sometimes|required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $material->update($data);

        return response()->json($material);
    }

    public function destroy(Request $request, Material $material)
    {
        $this->authorizeGuru($request, $material->guru_id);

        $material->delete();

        return response()->json(['message' => 'Materi berhasil dihapus']);
    }

    protected function authorizeGuru(Request $request, int $guruId): void
    {
        abort_if($request->user()->id !== $guruId, 403, 'Tidak diizinkan mengubah materi ini.');
    }
}
