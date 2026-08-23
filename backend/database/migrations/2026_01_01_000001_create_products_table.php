<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category');
            $table->decimal('price', 10, 2);
            $table->text('description');
            $table->string('image_url');
            $table->string('secondary_image_url')->nullable();
            $table->integer('stock')->default(10);
            $table->string('materials')->nullable();
            $table->boolean('is_featured')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
