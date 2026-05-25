<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'student_id',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function memberships()
    {
        return $this->hasMany(Membership::class);
    }

    public function organizations()
    {
        return $this->belongsToMany(Organization::class, 'memberships')
            ->withPivot(['role', 'status'])
            ->withTimestamps();
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isOfficerOf(Organization $organization): bool
    {
        return $this->memberships()
            ->where('organization_id', $organization->id)
            ->whereIn('role', ['officer', 'president'])
            ->where('status', 'approved')
            ->exists();
    }
}
