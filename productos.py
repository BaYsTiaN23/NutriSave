import json
import random

# Tiendas comerciales en México que venden alimentos
stores = [
    "Soriana", "Walmart", "Chedraui", "La Comer", "HEB", 
    "Superama", "Bodega Aurrera", "Costco", "Sam's Club"
]

# Catálogo base de productos con información nutricional
base_products = [
    # Frutas
    {"name": "Manzana", "nutrition": {"calorias": 52, "proteinas": 0.3, "carbohidratos": 14, "grasas": 0.2}},
    {"name": "Plátano", "nutrition": {"calorias": 89, "proteinas": 1.1, "carbohidratos": 23, "grasas": 0.3}},
    {"name": "Naranja", "nutrition": {"calorias": 47, "proteinas": 0.9, "carbohidratos": 12, "grasas": 0.1}},
    {"name": "Mango", "nutrition": {"calorias": 60, "proteinas": 0.8, "carbohidratos": 15, "grasas": 0.4}},
    {"name": "Uva", "nutrition": {"calorias": 69, "proteinas": 0.7, "carbohidratos": 18, "grasas": 0.2}},
    
    # Verduras
    {"name": "Zanahoria", "nutrition": {"calorias": 41, "proteinas": 0.9, "carbohidratos": 10, "grasas": 0.2}},
    {"name": "Tomate", "nutrition": {"calorias": 18, "proteinas": 0.9, "carbohidratos": 3.9, "grasas": 0.2}},
    {"name": "Papa", "nutrition": {"calorias": 77, "proteinas": 2, "carbohidratos": 17, "grasas": 0.1}},
    {"name": "Espinaca", "nutrition": {"calorias": 23, "proteinas": 2.9, "carbohidratos": 3.6, "grasas": 0.4}},
    {"name": "Brócoli", "nutrition": {"calorias": 34, "proteinas": 2.8, "carbohidratos": 7, "grasas": 0.4}},

    # Carnes y proteínas
    {"name": "Pollo", "nutrition": {"calorias": 239, "proteinas": 27, "carbohidratos": 0, "grasas": 14}},
    {"name": "Carne de Res", "nutrition": {"calorias": 250, "proteinas": 26, "carbohidratos": 0, "grasas": 17}},
    {"name": "Cerdo", "nutrition": {"calorias": 242, "proteinas": 27, "carbohidratos": 0, "grasas": 14}},
    {"name": "Pescado", "nutrition": {"calorias": 206, "proteinas": 22, "carbohidratos": 0, "grasas": 12}},
    {"name": "Atún en lata", "nutrition": {"calorias": 132, "proteinas": 28, "carbohidratos": 0, "grasas": 1}},
    {"name": "Huevo", "nutrition": {"calorias": 155, "proteinas": 13, "carbohidratos": 1.1, "grasas": 11}},
    {"name": "Jamón", "nutrition": {"calorias": 145, "proteinas": 20, "carbohidratos": 1.5, "grasas": 5}},

    # Lácteos
    {"name": "Leche", "nutrition": {"calorias": 42, "proteinas": 3.4, "carbohidratos": 5, "grasas": 1}},
    {"name": "Queso Panela", "nutrition": {"calorias": 265, "proteinas": 18, "carbohidratos": 2.4, "grasas": 21}},
    {"name": "Yogur Natural", "nutrition": {"calorias": 59, "proteinas": 10, "carbohidratos": 3.6, "grasas": 0.4}},

    # Cereales y pan
    {"name": "Arroz", "nutrition": {"calorias": 130, "proteinas": 2.7, "carbohidratos": 28, "grasas": 0.3}},
    {"name": "Pan Integral", "nutrition": {"calorias": 247, "proteinas": 8.4, "carbohidratos": 41, "grasas": 4.4}},
    {"name": "Tortillas de Maíz", "nutrition": {"calorias": 218, "proteinas": 6, "carbohidratos": 46, "grasas": 2.8}},
    {"name": "Avena", "nutrition": {"calorias": 389, "proteinas": 17, "carbohidratos": 66, "grasas": 7}},

    # Condimentos y aceites
    {"name": "Aceite de Oliva", "nutrition": {"calorias": 884, "proteinas": 0, "carbohidratos": 0, "grasas": 100}},
    {"name": "Sal", "nutrition": {"calorias": 0, "proteinas": 0, "carbohidratos": 0, "grasas": 0}},
    {"name": "Pimienta Negra", "nutrition": {"calorias": 251, "proteinas": 10, "carbohidratos": 64, "grasas": 3}},

    # Bebidas
    {"name": "Agua Mineral", "nutrition": {"calorias": 0, "proteinas": 0, "carbohidratos": 0, "grasas": 0}},
    {"name": "Jugo de Naranja", "nutrition": {"calorias": 45, "proteinas": 0.7, "carbohidratos": 10, "grasas": 0.2}},
    {"name": "Café Molido", "nutrition": {"calorias": 2, "proteinas": 0.3, "carbohidratos": 0, "grasas": 0}},
]

# Función para generar un producto aleatorio
def generate_product(base):
    quantity = random.choice(["250g", "500g", "1kg", "2kg", "Paquete", "Botella", "Caja"])
    price = round(random.uniform(10, 300), 2)  # pesos mexicanos
    stock = random.randint(0, 200)

    return {
        "nombre": f"{base['name']} {quantity}",
        "precio": price,
        "stock": stock,
        "nutricion": base["nutrition"]
    }

# Diccionario final
data = {}

for store in stores:
    products = []
    for _ in range(75):  # 🔹 Ahora son 75 productos por tienda
        base = random.choice(base_products)
        product = generate_product(base)
        products.append(product)
    data[store] = products

# Guardar en archivo JSON
with open("nutrisave_productos.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("✅ Archivo nutrisave_productos.json generado con 75 productos por tienda.")
