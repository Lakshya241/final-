<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'price',
        'description',
        'image_url',
        'secondary_image_url',
        'stock',
        'materials',
        'is_featured',
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
        'is_featured' => 'boolean',
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
