<?php

namespace Database\Seeders;

use App\Models\TipOfDay;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TipOfDaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tips = [
            [
                'title' => 'Ahorra comprando en temporada',
                'description' => 'Las frutas y verduras de temporada pueden costar hasta 40% menos. Pregúntame qué está en temporada este mes.'
            ],
            [
                'title' => 'Planifica tus comidas semanalmente',
                'description' => 'Dedicar 30 minutos cada domingo a planificar tus comidas puede reducir tus gastos en comida hasta un 20% y evitar desperdicios.'
            ],
            [
                'title' => 'Compra productos genéricos',
                'description' => 'Los productos de marca blanca suelen tener la misma calidad que las marcas reconocidas pero cuestan 30-50% menos.'
            ],
            [
                'title' => 'Revisa las fechas de vencimiento',
                'description' => 'Los productos próximos a vencer suelen tener descuentos del 20-50%. Úsalos inmediatamente o congélalos para después.'
            ],
            [
                'title' => 'Usa una lista de compras',
                'description' => 'Ir de compras con una lista reduce las compras impulsivas hasta en un 23% y te ayuda a mantener el presupuesto.'
            ],
            [
                'title' => 'Compra proteínas en ofertas',
                'description' => 'Cuando encuentres carnes o pescados en oferta, compra más cantidad y congela en porciones individuales.'
            ],
            [
                'title' => 'Aprovecha los cupones digitales',
                'description' => 'Muchos supermercados tienen apps con cupones exclusivos que pueden ahorrarte entre 5-15% en tu compra total.'
            ],
            [
                'title' => 'Compra granos y legumbres a granel',
                'description' => 'Los productos a granel pueden costar hasta 50% menos que los empaquetados y reduces el desperdicio de envases.'
            ],
            [
                'title' => 'Cocina porciones grandes',
                'description' => 'Preparar comidas en lotes te ahorra tiempo y dinero. Congela las porciones extras para comidas futuras.'
            ],
            [
                'title' => 'Cultiva tus propias hierbas',
                'description' => 'Un pequeño jardín de hierbas en casa puede ahorrarte $20-30 al mes en condimentos frescos.'
            ],
            [
                'title' => 'Compara precios por unidad',
                'description' => 'No siempre el paquete más grande es más económico. Revisa el precio por kilo o litro para comparar realmente.'
            ],
            [
                'title' => 'Evita las compras con hambre',
                'description' => 'Hacer compras con el estómago vacío puede aumentar tus gastos hasta en un 64% debido a compras impulsivas.'
            ],
            [
                'title' => 'Utiliza sobras creativamente',
                'description' => 'Las sobras pueden transformarse en nuevas comidas. Un pollo asado puede dar para tacos, ensaladas y sopas.'
            ],
            [
                'title' => 'Congela frutas maduras',
                'description' => 'Las frutas muy maduras son perfectas para smoothies, mermeladas o postres. No las desperdicies, congélalas.'
            ],
            [
                'title' => 'Compra pescado congelado',
                'description' => 'El pescado congelado mantiene su valor nutricional y cuesta 30-40% menos que el fresco.'
            ],
            [
                'title' => 'Haz tu propio pan',
                'description' => 'Hacer pan en casa puede costarte la mitad que comprarlo y controlas todos los ingredientes.'
            ],
            [
                'title' => 'Aprovecha las ofertas 2x1',
                'description' => 'Las ofertas 2x1 son ideales para productos no perecederos como pasta, arroz o productos de limpieza.'
            ],
            [
                'title' => 'Compra vegetales congelados',
                'description' => 'Los vegetales congelados mantienen sus nutrientes y duran meses. Son perfectos cuando los frescos están caros.'
            ],
            [
                'title' => 'Reutiliza el agua de cocción',
                'description' => 'El agua donde cocinas pasta o vegetables puede usarse para sopas o regar plantas. ¡No la desperdicies!'
            ],
            [
                'title' => 'Compra cortes de carne económicos',
                'description' => 'Los cortes menos populares como falda o osobuco son más baratos y quedan deliciosos con cocción lenta.'
            ],
            [
                'title' => 'Prepara snacks caseros',
                'description' => 'Hacer tus propios snacks como granola o trail mix puede ahorrarte 60% comparado con los comerciales.'
            ],
            [
                'title' => 'Usa especias para dar sabor',
                'description' => 'Las especias transforman ingredientes simples en comidas deliciosas sin aumentar significativamente el costo.'
            ],
            [
                'title' => 'Compra en mercados locales',
                'description' => 'Los mercados de agricultores suelen tener precios más bajos y productos más frescos, especialmente en temporada.'
            ],
            [
                'title' => 'Aprovecha las ofertas de fin de día',
                'description' => 'Muchas panaderías y supermercados reducen precios al final del día para productos frescos.'
            ],
            [
                'title' => 'Haz conservas caseras',
                'description' => 'Cuando las frutas estén en temporada y baratas, haz mermeladas o conservas para disfrutar todo el año.'
            ],
            [
                'title' => 'Sustituye ingredientes caros',
                'description' => 'Usa lentejas en lugar de carne picada en algunas recetas. Aportan proteína y fibra a menor costo.'
            ],
            [
                'title' => 'Compra café en grano',
                'description' => 'El café en grano es más económico que el molido y mantiene mejor su sabor y aroma.'
            ],
            [
                'title' => 'Planifica comidas con ingredientes comunes',
                'description' => 'Elige recetas que compartan ingredientes para aprovechar mejor las compras y reducir desperdicios.'
            ],
            [
                'title' => 'Usa el freezer estratégicamente',
                'description' => 'Congela porciones individuales de comidas caseras para tener opciones saludables siempre disponibles.'
            ],
            [
                'title' => 'Compra aceite en bidones grandes',
                'description' => 'El aceite en presentaciones grandes es más económico. Guárdalo en lugar fresco y oscuro.'
            ],
            [
                'title' => 'Aprovecha los huesos para caldos',
                'description' => 'Los huesos de pollo o res sirven para hacer caldos nutritivos. Muchas carnicerías los regalan.'
            ],
            [
                'title' => 'Cultiva vegetales fáciles',
                'description' => 'Tomates cherry, lechugas y rábanos son fáciles de cultivar y te ahorran dinero en verduras frescas.'
            ],
            [
                'title' => 'Compra quesos duros en bloque',
                'description' => 'Los quesos en bloque cuestan menos que los rallados o rebanados y duran más tiempo.'
            ],
            [
                'title' => 'Haz yogurt casero',
                'description' => 'Hacer yogurt en casa puede costarte la mitad que comprarlo y puedes controlar azúcar y sabores.'
            ],
            [
                'title' => 'Aprovecha las cáscaras de vegetales',
                'description' => 'Las cáscaras de papa, zanahoria y otros vegetales pueden usarse para hacer caldos o compost.'
            ],
            [
                'title' => 'Compra atún en agua',
                'description' => 'El atún en agua es más saludable y económico que en aceite. Puedes agregar tu propio aceite de oliva.'
            ],
            [
                'title' => 'Usa bicarbonato para limpiar frutas',
                'description' => 'Una cucharada de bicarbonato en agua limpia mejor las frutas y verduras que los productos comerciales caros.'
            ],
            [
                'title' => 'Compra especias enteras',
                'description' => 'Las especias enteras duran más y son más económicas. Muélelas en casa según las necesites.'
            ],
            [
                'title' => 'Haz leche de avena casera',
                'description' => 'La leche de avena casera cuesta una fracción de la comercial y solo necesitas avena y agua.'
            ],
            [
                'title' => 'Aprovecha las ofertas de temporada',
                'description' => 'Muchos productos tienen descuentos predecibles: chocolates después de San Valentín, pavos después de Navidad.'
            ],
            [
                'title' => 'Usa limón para conservar frutas',
                'description' => 'Unas gotas de limón en frutas cortadas previenen la oxidación y extienden su vida útil.'
            ],
            [
                'title' => 'Compra miel en lugar de azúcar refinada',
                'description' => 'Aunque es más cara inicialmente, la miel endulza más que el azúcar, por lo que usas menos cantidad.'
            ],
            [
                'title' => 'Reutiliza frascos de vidrio',
                'description' => 'Los frascos de mermeladas o salsas son perfectos para almacenar especias, granos o sobras.'
            ],
            [
                'title' => 'Compra productos de limpieza concentrados',
                'description' => 'Los productos concentrados rinden más y generan menos residuos de envases que los diluidos.'
            ],
            [
                'title' => 'Haz tu propia salsa de tomate',
                'description' => 'Cuando los tomates estén en temporada, haz salsa casera y congélala en porciones para todo el año.'
            ]
        ];

        foreach ($tips as $tip) {
            TipOfDay::create($tip);
        }
    }
}
