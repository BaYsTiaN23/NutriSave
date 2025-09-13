<?php

namespace App\Services;

class MenuResponseService
{
    /**
     * Get the menu response JSON structure definition
     */
    public static function getMenuStructureDefinition(): string
    {
        return '
When a user asks for a menu, meal plan, or recipe suggestions, respond with a JSON structure wrapped in ```json code blocks. The structure should be:

{
  "type": "menu_response",
  "menu": {
    "title": "Menu title or description",
    "description": "Brief description of the menu",
    "servings": 4,
    "estimated_cost": 25.50,
    "preparation_time": "45 minutes",
    "meals": [
      {
        "name": "Meal name",
        "type": "breakfast|lunch|dinner|snack",
        "description": "Brief meal description",
        "preparation_time": "20 minutes",
        "servings": 4,
        "instructions": [
          "Step 1: Preparation instruction",
          "Step 2: Cooking instruction",
          "Step 3: Final step"
        ],
        "nutrition": {
          "calories": 350,
          "protein": "25g",
          "carbs": "40g",
          "fat": "12g"
        },
        "products": [
          {
            "name": "Product name",
            "quantity": "2 units",
            "category": "vegetables|meat|dairy|grains|spices|etc",
            "estimated_price": 3.50,
            "is_essential": true,
            "substitutes": ["Alternative product 1", "Alternative product 2"]
          }
        ]
      }
    ],
    "shopping_list": [
      {
        "name": "Product name",
        "total_quantity": "3 units",
        "category": "vegetables",
        "estimated_price": 5.25,
        "used_in": ["Meal 1", "Meal 2"]
      }
    ],
    "tips": [
      "Helpful cooking or preparation tip",
      "Storage or leftover suggestion"
    ]
  }
}

After the JSON, provide a natural language explanation of the menu.
        ';
    }

    /**
     * Get example menu response
     */
    public static function getExampleMenuResponse(): array
    {
        return [
            "type" => "menu_response",
            "menu" => [
                "title" => "Menú Semanal Saludable para 4 Personas",
                "description" => "Menú balanceado con ingredientes frescos y económicos",
                "servings" => 4,
                "estimated_cost" => 85.00,
                "preparation_time" => "3 horas total",
                "meals" => [
                    [
                        "name" => "Pollo al Horno con Verduras",
                        "type" => "dinner",
                        "description" => "Pollo jugoso con vegetales asados",
                        "preparation_time" => "45 minutes",
                        "servings" => 4,
                        "instructions" => [
                            "Precalentar el horno a 200°C",
                            "Sazonar el pollo con sal, pimienta y hierbas",
                            "Cortar las verduras en trozos grandes",
                            "Hornear por 35-40 minutos hasta dorar"
                        ],
                        "nutrition" => [
                            "calories" => 420,
                            "protein" => "35g",
                            "carbs" => "25g",
                            "fat" => "18g"
                        ],
                        "products" => [
                            [
                                "name" => "Pollo entero",
                                "quantity" => "1 unidad (1.5kg)",
                                "category" => "meat",
                                "estimated_price" => 12.50,
                                "is_essential" => true,
                                "substitutes" => ["Muslos de pollo", "Pechuga de pollo"]
                            ],
                            [
                                "name" => "Papas",
                                "quantity" => "500g",
                                "category" => "vegetables",
                                "estimated_price" => 2.00,
                                "is_essential" => true,
                                "substitutes" => ["Camote", "Yuca"]
                            ],
                            [
                                "name" => "Zanahorias",
                                "quantity" => "300g",
                                "category" => "vegetables",
                                "estimated_price" => 1.50,
                                "is_essential" => false,
                                "substitutes" => ["Calabaza", "Brócoli"]
                            ]
                        ]
                    ]
                ],
                "shopping_list" => [
                    [
                        "name" => "Pollo entero",
                        "total_quantity" => "1 unidad (1.5kg)",
                        "category" => "meat",
                        "estimated_price" => 12.50,
                        "used_in" => ["Pollo al Horno con Verduras"]
                    ],
                    [
                        "name" => "Papas",
                        "total_quantity" => "500g",
                        "category" => "vegetables",
                        "estimated_price" => 2.00,
                        "used_in" => ["Pollo al Horno con Verduras"]
                    ]
                ],
                "tips" => [
                    "Marinar el pollo la noche anterior para mejor sabor",
                    "Las sobras se pueden usar para sándwiches al día siguiente"
                ]
            ]
        ];
    }

    /**
     * Check if a message content contains a menu JSON response
     */
    public static function isMenuResponse(string $content): bool
    {
        // Look for JSON code blocks with menu structure
        $pattern = '/```json\s*\{[^}]*"type"\s*:\s*"menu_response"/s';
        return preg_match($pattern, $content) === 1;
    }

    /**
     * Extract menu JSON from response content
     */
    public static function extractMenuJson(string $content): ?array
    {
        // Extract JSON from code blocks
        $pattern = '/```json\s*(\{.*?\})\s*```/s';
        if (preg_match($pattern, $content, $matches)) {
            $jsonString = $matches[1];
            $decoded = json_decode($jsonString, true);
            
            if (json_last_error() === JSON_ERROR_NONE && 
                isset($decoded['type']) && 
                $decoded['type'] === 'menu_response') {
                return $decoded;
            }
        }
        
        return null;
    }

    /**
     * Validate menu response structure
     */
    public static function validateMenuStructure(array $menu): bool
    {
        $requiredFields = ['type', 'menu'];
        
        foreach ($requiredFields as $field) {
            if (!isset($menu[$field])) {
                return false;
            }
        }

        $menuData = $menu['menu'];
        $requiredMenuFields = ['title', 'meals'];
        
        foreach ($requiredMenuFields as $field) {
            if (!isset($menuData[$field])) {
                return false;
            }
        }

        // Validate meals structure
        if (!is_array($menuData['meals']) || empty($menuData['meals'])) {
            return false;
        }

        foreach ($menuData['meals'] as $meal) {
            if (!isset($meal['name']) || !isset($meal['products']) || !is_array($meal['products'])) {
                return false;
            }
        }

        return true;
    }
}
