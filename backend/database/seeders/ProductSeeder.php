<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Aura Solitaire Diamond Ring',
                'slug' => 'aura-solitaire-diamond-ring',
                'category' => 'Rings',
                'price' => 2850.00,
                'description' => 'A captivating 1.8-carat lab-grown solitaire diamond meticulously set in an undulating 18k champagne gold band inspired by natural fluid forms.',
                'image_url' => 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
                'secondary_image_url' => 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80',
                'stock' => 8,
                'materials' => '18k Champagne Gold, 1.8ct VVS1 Diamond',
                'is_featured' => true,
            ],
            [
                'name' => 'Celestial Pavilion Diamond Necklace',
                'slug' => 'celestial-pavilion-diamond-necklace',
                'category' => 'Necklaces',
                'price' => 4600.00,
                'description' => 'Handcrafted cascade pendant featuring brilliant-cut pavé diamonds suspended from a delicate multi-link 18k yellow gold chain.',
                'image_url' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
                'secondary_image_url' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
                'stock' => 5,
                'materials' => '18k Solid Yellow Gold, 2.4ct Pavé Diamonds',
                'is_featured' => true,
            ],
            [
                'name' => 'Étoile Emerald & Diamond Earrings',
                'slug' => 'etoile-emerald-diamond-earrings',
                'category' => 'Earrings',
                'price' => 3200.00,
                'description' => 'Architectural drop earrings adorned with Colombian emeralds framed by halo brilliant diamonds in hand-finished platinum.',
                'image_url' => 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80',
                'secondary_image_url' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
                'stock' => 6,
                'materials' => '950 Platinum, Natural Emeralds, Diamonds',
                'is_featured' => true,
            ],
            [
                'name' => 'Lumière Sculpted Gold Cuff Bracelet',
                'slug' => 'lumiere-sculpted-gold-cuff-bracelet',
                'category' => 'Bracelets',
                'price' => 2400.00,
                'description' => 'A statement open cuff bracelet crafted with satin-brushed 18k yellow gold featuring polished bevel edges.',
                'image_url' => 'https://images.unsplash.com/photo-1611591475179-42cd34264d64?auto=format&fit=crop&w=1000&q=80',
                'secondary_image_url' => 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=80',
                'stock' => 12,
                'materials' => '18k Satin-Brushed Gold',
                'is_featured' => true,
            ],
            [
                'name' => 'Serpentine Sapphire Band Ring',
                'slug' => 'serpentine-sapphire-band-ring',
                'category' => 'Rings',
                'price' => 1950.00,
                'description' => 'Tapered eternity band featuring channel-set deep ocean blue sapphires interspersed with micro-claw diamonds.',
                'image_url' => 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=1000&q=80',
                'secondary_image_url' => 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
                'stock' => 9,
                'materials' => '14k Rose Gold, Royal Blue Sapphires',
                'is_featured' => false,
            ],
            [
                'name' => 'Opulence Freshwater Pearl Pendant',
                'slug' => 'opulence-freshwater-pearl-pendant',
                'category' => 'Necklaces',
                'price' => 1650.00,
                'description' => 'Luminous South Sea pearl suspended from a geometric diamond-encrusted bale on an adjustable fine silk cord chain.',
                'image_url' => 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80',
                'secondary_image_url' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
                'stock' => 7,
                'materials' => '18k White Gold, 12mm Pearl, Diamonds',
                'is_featured' => false,
            ],
            [
                'name' => 'Verve Geometric Diamond Huggies',
                'slug' => 'verve-geometric-diamond-huggies',
                'category' => 'Earrings',
                'price' => 1400.00,
                'description' => 'Minimalist octagonal hoop earrings lined with precision-set conflict-free baguette diamonds.',
                'image_url' => 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1000&q=80',
                'secondary_image_url' => 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80',
                'stock' => 15,
                'materials' => '18k Yellow Gold, Baguette Diamonds',
                'is_featured' => false,
            ],
            [
                'name' => 'Solstice Tennis Diamond Bracelet',
                'slug' => 'solstice-tennis-diamond-bracelet',
                'category' => 'Bracelets',
                'price' => 5200.00,
                'description' => 'Classic continuous line bracelet set with 5.0 carats of round brilliant diamonds in four-prong platinum mountings.',
                'image_url' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
                'secondary_image_url' => 'https://images.unsplash.com/photo-1611591475179-42cd34264d64?auto=format&fit=crop&w=1000&q=80',
                'stock' => 4,
                'materials' => '950 Platinum, 5.0ct VS Diamonds',
                'is_featured' => true,
            ]
        ];

        foreach ($products as $productData) {
            Product::updateOrCreate(
                ['slug' => $productData['slug']],
                $productData
            );
        }
    }
}
