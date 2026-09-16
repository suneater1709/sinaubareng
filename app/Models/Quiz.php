<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['guru_id', 'jenjang', 'judul', 'durasi_menit', 'tipe'];

    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('urutan');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
