<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusinessProduct;
use Faker\Factory as Faker;

class BusinessProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('es_ES'); // Spanish locale for more realistic names
        
        // Product categories and brands
        $categories = [
            'Lácteos' => ['Lala', 'Alpura', 'Santa Clara', 'Nestlé'],
            'Carnes' => ['Bachoco', 'Pilgrim\'s', 'Sukarne', 'Kir'],
            'Cereales' => ['Kellogg\'s', 'Nestlé', 'Quaker', 'General Mills'],
            'Bebidas' => ['Coca-Cola', 'Pepsi', 'Boing', 'Del Valle'],
            'Snacks' => ['Sabritas', 'Barcel', 'Gamesa', 'Marinela'],
            'Aceites' => ['Capullo', '123', 'Nutrioli', 'Mazola'],
            'Frutas' => ['Del Monte', 'Dole', 'Great Value', 'Aurrera'],
            'Verduras' => ['Great Value', 'Aurrera', 'Del Campo', 'Verde Valle'],
            'Panadería' => ['Bimbo', 'Wonder', 'Tía Rosa', 'Oroweat'],
            'Limpieza' => ['Fabuloso', 'Pinol', 'Ariel', 'Downy'],
            'Higiene' => ['Colgate', 'Palmolive', 'Johnson\'s', 'Dove'],
            'Conservas' => ['La Costeña', 'Herdez', 'Del Monte', 'Clemente Jacques'],
            'Pastas' => ['Barilla', 'La Moderna', 'Don Julio', 'Del Real'],
            'Arroz' => ['Verde Valle', 'Morelos', 'Casa Cuervo', 'SOS'],
            'Dulces' => ['Carlos V', 'Ricolino', 'De La Rosa', 'Vero'],
        ];

        $productTemplates = [
            'Lácteos' => [
                'Leche entera {brand} 1L',
                'Yogurt natural {brand} 1kg',
                'Queso manchego {brand} 400g',
                'Crema {brand} 200ml',
                'Mantequilla {brand} 90g',
                'Queso Oaxaca {brand} 400g',
                'Leche deslactosada {brand} 1L',
            ],
            'Carnes' => [
                'Pollo entero {brand} por kg',
                'Pechuga de pollo {brand} por kg',
                'Carne molida de res {brand} por kg',
                'Bistec de res {brand} por kg',
                'Salchicha {brand} 500g',
                'Jamón {brand} 500g',
                'Tocino {brand} 250g',
            ],
            'Cereales' => [
                'Cereal {brand} Corn Flakes 500g',
                'Avena {brand} 400g',
                'Granola {brand} 350g',
                'Cereal {brand} Choco Krispis 500g',
                'Cereal {brand} Fitness 300g',
            ],
            'Bebidas' => [
                'Refresco {brand} Cola 2.5L',
                'Agua natural {brand} 1.5L',
                'Jugo {brand} naranja 1L',
                'Bebida energética {brand} 500ml',
                'Té helado {brand} 1L',
            ],
            'Snacks' => [
                'Papas {brand} naturales 240g',
                'Galletas {brand} marías 800g',
                'Palomitas {brand} mantequilla 90g',
                'Cacahuates {brand} salados 180g',
                'Tostadas {brand} horneadas 160g',
            ],
            'Aceites' => [
                'Aceite {brand} vegetal 1L',
                'Aceite {brand} de oliva 500ml',
                'Aceite {brand} de coco 450ml',
                'Aceite {brand} de canola 900ml',
            ],
            'Frutas' => [
                'Manzana roja {brand} por kg',
                'Plátano {brand} por kg',
                'Naranja {brand} por kg',
                'Uva verde {brand} por kg',
                'Fresa {brand} 500g',
            ],
            'Verduras' => [
                'Tomate {brand} por kg',
                'Cebolla blanca {brand} por kg',
                'Papa {brand} por kg',
                'Zanahoria {brand} por kg',
                'Lechuga {brand} pieza',
            ],
            'Panadería' => [
                'Pan {brand} blanco integral 680g',
                'Tortillas {brand} de harina 500g',
                'Pan {brand} tostado integral 400g',
                'Bolillo {brand} 6 piezas',
            ],
            'Limpieza' => [
                'Detergente {brand} líquido 1L',
                'Limpiador {brand} multiusos 500ml',
                'Suavizante {brand} 1L',
                'Jabón {brand} en polvo 1kg',
            ],
            'Higiene' => [
                'Pasta dental {brand} 100ml',
                'Champú {brand} 400ml',
                'Jabón {brand} tocador 90g',
                'Desodorante {brand} 150ml',
            ],
            'Conservas' => [
                'Frijoles {brand} negros 560g',
                'Atún {brand} en agua 140g',
                'Chiles {brand} jalapeños 220g',
                'Salsa {brand} roja 210g',
            ],
            'Pastas' => [
                'Espagueti {brand} 500g',
                'Macarrones {brand} 500g',
                'Tallarines {brand} 500g',
                'Lasaña {brand} 500g',
            ],
            'Arroz' => [
                'Arroz {brand} blanco 1kg',
                'Arroz {brand} integral 900g',
                'Arroz {brand} precocido 500g',
            ],
            'Dulces' => [
                'Chocolate {brand} con leche 45g',
                'Paleta {brand} de dulce 20g',
                'Chicle {brand} menta 15g',
                'Caramelo {brand} suave 50g',
            ],
        ];

        $businessId = 3;
        $createdProducts = [];

        // Generate 100 unique products
        for ($i = 1; $i <= 100; $i++) {
            $category = $faker->randomElement(array_keys($categories));
            $brand = $faker->randomElement($categories[$category]);
            $templates = $productTemplates[$category];
            $nameTemplate = $faker->randomElement($templates);
            $name = str_replace('{brand}', $brand, $nameTemplate);
            
            // Generate unique SKU
            $sku = strtoupper(substr($brand, 0, 3)) . sprintf('%03d', $i);
            
            // Ensure unique names and SKUs
            while (in_array($name, array_column($createdProducts, 'name')) || 
                   in_array($sku, array_column($createdProducts, 'sku'))) {
                $nameTemplate = $faker->randomElement($templates);
                $name = str_replace('{brand}', $brand, $nameTemplate) . ' ' . $faker->word();
                $sku = strtoupper(substr($brand, 0, 3)) . sprintf('%03d', $i) . strtoupper($faker->randomLetter());
            }

            // Price ranges based on category
            $priceRanges = [
                'Lácteos' => [15, 80],
                'Carnes' => [80, 250],
                'Cereales' => [35, 120],
                'Bebidas' => [12, 45],
                'Snacks' => [8, 50],
                'Aceites' => [25, 150],
                'Frutas' => [20, 80],
                'Verduras' => [10, 60],
                'Panadería' => [15, 65],
                'Limpieza' => [20, 80],
                'Higiene' => [25, 120],
                'Conservas' => [15, 70],
                'Pastas' => [12, 45],
                'Arroz' => [18, 85],
                'Dulces' => [5, 35],
            ];

            $priceRange = $priceRanges[$category];
            $price = $faker->randomFloat(2, $priceRange[0], $priceRange[1]);
            $stock = $faker->numberBetween(0, 500);
            $status = $faker->randomFloat() < 0.85 ? 'active' : 'inactive'; // 85% active, 15% inactive

            $product = [
                'business_id' => $businessId,
                'name' => $name,
                'brand' => $brand,
                'category' => $category,
                'description' => "Producto de alta calidad de la marca {$brand}. " . $faker->sentence(),
                'price' => $price,
                'stock' => $stock,
                'sku' => $sku,
                'image_url' => '/images/products/' . strtolower(str_replace(' ', '-', $sku)) . '.jpg',
                'status' => $status,
                'last_updated' => $faker->dateTimeBetween('-30 days', 'now'),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $createdProducts[] = $product;
        }

        // Insert all products at once for better performance
        BusinessProduct::insert($createdProducts);

        $this->command->info('Successfully created 100 business products for business ID: ' . $businessId);
    }
}
