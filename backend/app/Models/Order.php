<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'total_amount',
        'status',
    ];

    protected $casts = [
        'total_amount' => 'float',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
