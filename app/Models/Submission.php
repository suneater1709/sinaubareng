<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = ['quiz_id', 'siswa_id', 'skor_pg', 'status', 'submitted_at'];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function siswa()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
