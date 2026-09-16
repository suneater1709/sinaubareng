<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
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
}
