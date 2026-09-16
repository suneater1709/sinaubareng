<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionAttachment extends Model
{
    protected $fillable = [
        'question_id', 'tipe_media', 'file_path', 'file_base64', 'storage_type', 'mime_type',
    ];

    protected $appends = ['url'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function getUrlAttribute(): ?string
    {
        if ($this->storage_type === 'base64') {
            return $this->file_base64;
        }

        if ($this->file_path) {
            if (filter_var($this->file_path, FILTER_VALIDATE_URL)) {
                return $this->file_path;
            }
            $baseUrl = request()?->schemeAndHttpHost() ?: asset('/');
            return rtrim($baseUrl, '/') . '/storage/' . $this->file_path;
        }

        return null;
    }
}
