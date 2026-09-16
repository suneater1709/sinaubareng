<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = User::where('role', 'siswa');

        // Filter based on teacher's jenjang
        if ($user->role === 'guru') {
            if ($user->jenjang) {
                $query->where('jenjang', $user->jenjang);
            }
        } elseif ($request->has('jenjang') && !empty($request->input('jenjang'))) {
            $query->where('jenjang', $request->input('jenjang'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $students = $query->withCount('submissions')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json($students);
    }
}
