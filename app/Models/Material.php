<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = ['guru_id', 'jenjang', 'judul', 'deskripsi'];

    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    public function attachments()
    {
        return $this->hasMany(MaterialAttachment::class);
    }
}
