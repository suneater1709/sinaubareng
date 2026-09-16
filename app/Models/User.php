<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'jenjang', 'status', 'created_by'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isGuru(): bool
    {
        return $this->role === 'guru';
    }

    public function isSiswa(): bool
    {
        return $this->role === 'siswa';
    }

    public function materials()
    {
        return $this->hasMany(Material::class, 'guru_id');
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class, 'guru_id');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'siswa_id');
    }
}
