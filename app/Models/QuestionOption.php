<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionOption extends Model
{
    protected $fillable = ['question_id', 'teks_opsi', 'is_benar'];

    protected $casts = [
        'is_benar' => 'boolean',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
