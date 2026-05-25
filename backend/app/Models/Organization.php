<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'category',
        'org_type',
        'department',
        'founded_year',
        'mission',
        'vision',
        'objectives',
        'membership_requirements',
        'meeting_schedule',
        'office_location',
        'contact_email',
        'contact_phone',
        'adviser_id',
        'status',
    ];

    protected static function booted()
    {
        static::creating(function (Organization $org) {
            if (empty($org->slug)) {
                $org->slug = Str::slug($org->name);
            }
        });
    }

    public function adviser()
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }

    public function memberships()
    {
        return $this->hasMany(Membership::class);
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'memberships')
            ->withPivot(['role', 'status'])
            ->withTimestamps();
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }
}
