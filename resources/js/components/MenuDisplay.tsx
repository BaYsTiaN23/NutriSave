import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, DollarSign, ChefHat, ShoppingCart, Lightbulb } from 'lucide-react';

interface Product {
    name: string;
    quantity: string;
    category: string;
    estimated_price: number;
    is_essential: boolean;
    substitutes?: string[];
}

interface Meal {
    name: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    description: string;
    preparation_time: string;
    servings: number;
    instructions: string[];
    nutrition?: {
        calories: number;
        protein: string;
        carbs: string;
        fat: string;
    };
    products: Product[];
}

interface ShoppingListItem {
    name: string;
    total_quantity: string;
    category: string;
    estimated_price: number;
    used_in: string[];
}

interface Menu {
    title: string;
    description: string;
    servings: number;
    estimated_cost: number;
    preparation_time: string;
    meals: Meal[];
    shopping_list: ShoppingListItem[];
    tips: string[];
}

interface MenuResponse {
    type: 'menu_response';
    menu: Menu;
}

interface MenuDisplayProps {
    menuData: MenuResponse;
}

const MealTypeIcon = ({ type }: { type: string }) => {
    const iconClass = "w-4 h-4";
    
    switch (type) {
        case 'breakfast':
            return <div className={`${iconClass} bg-yellow-500 rounded-full`} />;
        case 'lunch':
            return <div className={`${iconClass} bg-orange-500 rounded-full`} />;
        case 'dinner':
            return <div className={`${iconClass} bg-blue-500 rounded-full`} />;
        case 'snack':
            return <div className={`${iconClass} bg-green-500 rounded-full`} />;
        default:
            return <ChefHat className={iconClass} />;
    }
};

const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
        'vegetables': 'bg-green-100 text-green-800',
        'meat': 'bg-red-100 text-red-800',
        'dairy': 'bg-blue-100 text-blue-800',
        'grains': 'bg-yellow-100 text-yellow-800',
        'spices': 'bg-purple-100 text-purple-800',
        'fruits': 'bg-pink-100 text-pink-800',
    };
    
    return colorMap[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

export const MenuDisplay: React.FC<MenuDisplayProps> = ({ menuData }) => {
    const { menu } = menuData;

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Menu Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ChefHat className="w-5 h-5" />
                        {menu.title}
                    </CardTitle>
                    <CardDescription>{menu.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{menu.servings} personas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">${menu.estimated_cost?.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{menu.preparation_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{menu.shopping_list?.length || 0} productos</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Meals */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Comidas</h3>
                {menu.meals.map((meal, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MealTypeIcon type={meal.type} />
                                {meal.name}
                                <Badge variant="outline" className="ml-auto">
                                    {meal.type}
                                </Badge>
                            </CardTitle>
                            <CardDescription>{meal.description}</CardDescription>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {meal.preparation_time}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {meal.servings} porciones
                                </span>
                                {meal.nutrition && (
                                    <span>{meal.nutrition.calories} cal</span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Nutrition Info */}
                            {meal.nutrition && (
                                <div className="grid grid-cols-4 gap-2 p-3 bg-muted/50 rounded-lg">
                                    <div className="text-center">
                                        <div className="font-semibold">{meal.nutrition.calories}</div>
                                        <div className="text-xs text-muted-foreground">Calorías</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold">{meal.nutrition.protein}</div>
                                        <div className="text-xs text-muted-foreground">Proteína</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold">{meal.nutrition.carbs}</div>
                                        <div className="text-xs text-muted-foreground">Carbos</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold">{meal.nutrition.fat}</div>
                                        <div className="text-xs text-muted-foreground">Grasa</div>
                                    </div>
                                </div>
                            )}

                            {/* Products */}
                            <div>
                                <h4 className="font-medium mb-2">Ingredientes</h4>
                                <div className="grid gap-2">
                                    {meal.products.map((product, productIndex) => (
                                        <div key={productIndex} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className={getCategoryColor(product.category)}>
                                                    {product.category}
                                                </Badge>
                                                <span className="font-medium">{product.name}</span>
                                                <span className="text-sm text-muted-foreground">({product.quantity})</span>
                                                {!product.is_essential && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Opcional
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">
                                                ${product.estimated_price.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Instructions */}
                            {meal.instructions && meal.instructions.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Instrucciones</h4>
                                    <ol className="space-y-1">
                                        {meal.instructions.map((instruction, instructionIndex) => (
                                            <li key={instructionIndex} className="flex gap-2">
                                                <span className="text-sm font-medium text-muted-foreground min-w-[1.5rem]">
                                                    {instructionIndex + 1}.
                                                </span>
                                                <span className="text-sm">{instruction}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Shopping List */}
            {menu.shopping_list && menu.shopping_list.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Lista de Compras
                        </CardTitle>
                        <CardDescription>
                            Todos los ingredientes que necesitas comprar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {menu.shopping_list.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className={getCategoryColor(item.category)}>
                                            {item.category}
                                        </Badge>
                                        <div>
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {item.total_quantity} • Usado en: {item.used_in.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">${item.estimated_price.toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-medium">Total Estimado:</span>
                                <span className="text-lg font-bold">${menu.estimated_cost?.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tips */}
            {menu.tips && menu.tips.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" />
                            Consejos Útiles
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {menu.tips.map((tip, index) => (
                                <li key={index} className="flex gap-2">
                                    <span className="text-yellow-500 min-w-[1rem]">💡</span>
                                    <span className="text-sm">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
