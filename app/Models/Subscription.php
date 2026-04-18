<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'category_id', 'name', 'description',
        'price', 'currency', 'billing_cycle', 'renewal_date',
        'start_date', 'status', 'website', 'logo',
        'color', 'notes', 'reminder', 'reminder_days'
    ];

    protected $casts = [
        'renewal_date' => 'date',
        'start_date'   => 'date',
        'price'        => 'decimal:2',
        'reminder'     => 'boolean',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function getDaysUntilRenewalAttribute(): int
    {
        return now()->diffInDays($this->renewal_date, false);
    }

    public function getMonthlyEquivalentAttribute(): float
    {
        return match($this->billing_cycle) {
            'weekly'  => $this->price * 52 / 12,
            'monthly' => $this->price,
            'yearly'  => $this->price / 12,
            default   => $this->price,
        };
    }
    public function getIsOverdueAttribute(): bool
    {
        return $this->renewal_date->isPast();
    }
}
