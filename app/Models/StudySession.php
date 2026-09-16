<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudySession extends Model
{
    use HasFactory;

    protected $table = 'study_sessions';

    protected $fillable = [
        'guru_id',
        'jenjang',
        'judul',
        'deskripsi',
        'waktu_mulai',
        'waktu_selesai',
        'link_meeting',
        'status',
    ];

    protected $casts = [
        'waktu_mulai' => 'datetime',
        'waktu_selesai' => 'datetime',
    ];

    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }
}
