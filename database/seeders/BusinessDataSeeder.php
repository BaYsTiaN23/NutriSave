<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Business;
use App\Models\BusinessProduct;
use App\Models\Promotion;
use App\Models\Analytic;
use App\Models\BillingPlan;
use App\Models\Subscription;

class BusinessDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create a sample business
        $business = Business::create([
            'name' => 'Soriana Express',
            'branch_name' => 'Sucursal Centro',
            'industry' => 'grocery',
            'status' => 'active',
        ]);

        // Create billing plan
        $billingPlan = BillingPlan::create([
            'name' => 'Plan Empresarial',
            'price' => 2999.00,
            'currency' => 'MXN',
            'promotions_included' => 50,
            'status' => 'active',
        ]);

        // Create subscription
        Subscription::create([
            'business_id' => $business->id,
            'plan_id' => $billingPlan->id,
            'start_date' => now(),
            'next_payment_date' => now()->addMonth(),
            'status' => 'active',
        ]);

        // Create sample products
        $products = [
            [
                'name' => 'Aceite de Oliva Extra Virgen',
                'brand' => 'Capullo',
                'category' => 'Aceites',
                'price' => 89.50,
                'stock' => 150,
                'sku' => 'CAP001',
                'status' => 'active',
            ],
            [
                'name' => 'Arroz Integral Premium',
                'brand' => 'Verde Valle',
                'category' => 'Granos',
                'price' => 45.00,
                'stock' => 200,
                'sku' => 'VV002',
                'status' => 'active',
            ],
            [
                'name' => 'Pollo Orgánico Congelado',
                'brand' => 'Bachoco',
                'category' => 'Carnes',
                'price' => 125.00,
                'stock' => 75,
                'sku' => 'BAC003',
                'status' => 'inactive',
            ],
            [
                'name' => 'Leche Entera',
                'brand' => 'Lala',
                'category' => 'Lácteos',
                'price' => 25.50,
                'stock' => 100,
                'sku' => 'LAL004',
                'status' => 'active',
            ],
            [
                'name' => 'Pan Integral',
                'brand' => 'Bimbo',
                'category' => 'Panadería',
                'price' => 35.00,
                'stock' => 50,
                'sku' => 'BIM005',
                'status' => 'active',
            ],
        ];

        foreach ($products as $productData) {
            BusinessProduct::create([
                'business_id' => $business->id,
                ...$productData,
                'description' => "Producto de alta calidad de la marca {$productData['brand']}",
                'image_url' => '/images/products/' . strtolower($productData['sku']) . '.jpg',
                'last_updated' => now(),
            ]);
        }

        // Create sample promotions
        $promotions = [
            [
                'discount_percentage' => 15.0,
                'daily_budget' => 500.00,
                'description' => '15% de descuento en aceite premium',
                'status' => 'active',
            ],
            [
                'discount_percentage' => 10.0,
                'daily_budget' => 300.00,
                'description' => '10% de descuento en arroz integral',
                'status' => 'active',
            ],
            [
                'discount_percentage' => 20.0,
                'daily_budget' => 800.00,
                'description' => '20% de descuento en pollo orgánico',
                'status' => 'paused',
            ],
        ];

        foreach ($promotions as $index => $promotionData) {
            Promotion::create([
                'business_id' => $business->id,
                'product_id' => $index + 1, // Assuming products are created in order
                ...$promotionData,
                'start_date' => now(),
                'end_date' => now()->addDays(30),
                'target_audience' => 'all',
            ]);
        }

        // Create sample analytics data
        $analyticsData = [
            ['metric' => 'views', 'value' => 12847],
            ['metric' => 'clicks', 'value' => 2156],
            ['metric' => 'conversions', 'value' => 324],
            ['metric' => 'revenue', 'value' => 15680],
        ];

        foreach ($analyticsData as $data) {
            Analytic::create([
                'business_id' => $business->id,
                'date' => now()->toDateString(),
                'metric' => $data['metric'],
                'value' => $data['value'],
            ]);
        }

        $this->command->info('Business data seeded successfully!');
    }
}
