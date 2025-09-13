"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
    Building2,
    ArrowLeft,
    Plus,
    TrendingUp,
    Users,
    DollarSign,
    Eye,
    ShoppingCart,
    Target,
    BarChart3,
    Calendar,
    Star,
    Upload,
    FileSpreadsheet,
    CheckCircle,
    AlertCircle,
    Download,
    Trash2,
    Edit,
} from "lucide-react"
import { Link } from "@inertiajs/react"

// Mock data para el panel B2B
const businessStats = {
    totalViews: 12847,
    totalClicks: 2156,
    conversions: 324,
    revenue: 15680,
    ctr: 16.8,
    conversionRate: 15.0,
}

const promotedProducts = [
    {
        id: 1,
        name: "Aceite de Oliva Extra Virgen",
        brand: "Capullo",
        category: "Aceites",
        views: 1247,
        clicks: 189,
        conversions: 45,
        revenue: 2340,
        status: "active",
    },
    {
        id: 2,
        name: "Arroz Integral Premium",
        brand: "Verde Valle",
        category: "Granos",
        views: 892,
        clicks: 134,
        conversions: 28,
        revenue: 1456,
        status: "active",
    },
    {
        id: 3,
        name: "Pollo Orgánico Congelado",
        brand: "Bachoco",
        category: "Carnes",
        views: 2156,
        clicks: 298,
        conversions: 67,
        revenue: 3890,
        status: "paused",
    },
]

const customerInsights = [
    {
        demographic: "Familias con niños",
        percentage: 35,
        avgSpend: 450,
        topProducts: ["Cereales", "Lácteos", "Frutas"],
    },
    {
        demographic: "Adultos jóvenes",
        percentage: 28,
        avgSpend: 280,
        topProducts: ["Proteínas", "Snacks", "Bebidas"],
    },
    {
        demographic: "Adultos mayores",
        percentage: 22,
        avgSpend: 320,
        topProducts: ["Medicinas", "Conservas", "Té"],
    },
    {
        demographic: "Estudiantes",
        percentage: 15,
        avgSpend: 180,
        topProducts: ["Pasta", "Arroz", "Enlatados"],
    },
]

const importedProducts = [
    {
        id: 1,
        name: "Aceite de Oliva Extra Virgen",
        brand: "Capullo",
        category: "Aceites",
        price: 89.5,
        stock: 150,
        sku: "CAP001",
        status: "active",
        lastUpdated: "2024-01-15",
    },
    {
        id: 2,
        name: "Arroz Integral Premium",
        brand: "Verde Valle",
        category: "Granos",
        price: 45.0,
        stock: 200,
        sku: "VV002",
        status: "active",
        lastUpdated: "2024-01-15",
    },
    {
        id: 3,
        name: "Pollo Orgánico Congelado",
        brand: "Bachoco",
        category: "Carnes",
        price: 125.0,
        stock: 75,
        sku: "BAC003",
        status: "inactive",
        lastUpdated: "2024-01-14",
    },
]

export default function BusinessPage() {
    const [isNewPromotionOpen, setIsNewPromotionOpen] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [previewData, setPreviewData] = useState<any[]>([])
    const [showPreview, setShowPreview] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Agregando función para manejar la carga de archivos
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setUploadedFile(file)
            // Simular procesamiento del archivo
            setIsUploading(true)
            setUploadProgress(0)

            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        setIsUploading(false)
                        // Simular datos de preview
                        setPreviewData([
                            { nombre: "Leche Entera", marca: "Lala", categoria: "Lácteos", precio: 25.5, stock: 100 },
                            { nombre: "Pan Integral", marca: "Bimbo", categoria: "Panadería", precio: 35.0, stock: 50 },
                            { nombre: "Yogurt Griego", marca: "Danone", categoria: "Lácteos", precio: 18.9, stock: 80 },
                        ])
                        setShowPreview(true)
                        return 100
                    }
                    return prev + 10
                })
            }, 200)
        }
    }

    // Agregando función para confirmar importación
    const confirmImport = () => {
        setShowPreview(false)
        setUploadedFile(null)
        setPreviewData([])
        // Aquí se haría la importación real a Supabase
        alert("¡Productos importados exitosamente!")
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-[#8B4513]/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="text-gray-800 hover:bg-accent">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-primary" />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">Panel Empresarial</h1>
                                    <p className="text-sm text-gray-600">Soriana Express - Sucursal Centro</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="">
                                <Upload className="w-4 h-4 mr-2" />
                                Subir Productos
                            </Button>
                            <Dialog open={isNewPromotionOpen} onOpenChange={setIsNewPromotionOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Nueva Promoción
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-gray-800">Crear Nueva Promoción</DialogTitle>
                                        <DialogDescription className="text-gray-600">Destaca tus productos en las recomendaciones de NutriSave</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="product-name" className="text-gray-800">Producto</Label>
                                            <Input id="product-name" placeholder="Nombre del producto" className="border-[#8B4513]/30 focus:border-[#8B4513]" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="discount" className="text-gray-800">Descuento (%)</Label>
                                            <Input id="discount" type="number" placeholder="15" className="border-[#8B4513]/30 focus:border-[#8B4513]" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="target-audience" className="text-gray-800">Audiencia Objetivo</Label>
                                            <Select>
                                                <SelectTrigger className="border-[#8B4513]/30 focus:border-[#8B4513]">
                                                    <SelectValue placeholder="Selecciona audiencia" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="families">Familias con niños</SelectItem>
                                                    <SelectItem value="young-adults">Adultos jóvenes</SelectItem>
                                                    <SelectItem value="seniors">Adultos mayores</SelectItem>
                                                    <SelectItem value="students">Estudiantes</SelectItem>
                                                    <SelectItem value="all">Todos los usuarios</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="budget" className="text-gray-800">Presupuesto Diario</Label>
                                            <Input id="budget" type="number" placeholder="500" className="border-[#8B4513]/30 focus:border-[#8B4513]" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description" className="text-gray-800">Descripción de la Oferta</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Describe los beneficios de tu promoción..."
                                                className="min-h-20 border-[#8B4513]/30 focus:border-[#8B4513]"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsNewPromotionOpen(false)} className="">
                                            Cancelar
                                        </Button>
                                        <Button onClick={() => setIsNewPromotionOpen(false)} className="bg-[#8B4513] hover:bg-[#A0522D] text-white">
                                            Crear Promoción
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </header>

            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />

            <div className="container mx-auto px-4 py-8">
                {(uploadedFile || showPreview) && (
                    <Card className="mb-8 bg-white border-[#8B4513]/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-800">
                                <FileSpreadsheet className="w-5 h-5" />
                                Gestión de Productos
                            </CardTitle>
                            <CardDescription className="text-gray-600">Sube archivos CSV o XLSX para importar productos masivamente</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isUploading && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Upload className="w-5 h-5 text-gray-800" />
                                        <span className="font-medium text-gray-800">Procesando: {uploadedFile?.name}</span>
                                    </div>
                                    <Progress value={uploadProgress} className="w-full" />
                                    <p className="text-sm text-gray-600">Validando formato y estructura de datos...</p>
                                </div>
                            )}

                            {showPreview && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="font-medium text-gray-800">Archivo procesado: {uploadedFile?.name}</span>
                                        </div>
                                        <Badge variant="secondary" className="bg-secondary text-gray-800">{previewData.length} productos encontrados</Badge>
                                    </div>

                                    <div className="bg-secondary/30 rounded-lg p-4">
                                        <h4 className="font-medium mb-3 text-gray-800">Vista Previa de Datos</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-[#8B4513]/20">
                                                        <th className="text-left p-2 text-gray-800">Nombre</th>
                                                        <th className="text-left p-2 text-gray-800">Marca</th>
                                                        <th className="text-left p-2 text-gray-800">Categoría</th>
                                                        <th className="text-left p-2 text-gray-800">Precio</th>
                                                        <th className="text-left p-2 text-gray-800">Stock</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {previewData.map((product, index) => (
                                                        <tr key={index} className="border-b border-[#8B4513]/10">
                                                            <td className="p-2 text-gray-800">{product.nombre}</td>
                                                            <td className="p-2 text-gray-800">{product.marca}</td>
                                                            <td className="p-2 text-gray-800">{product.categoria}</td>
                                                            <td className="p-2 text-gray-800">${product.precio}</td>
                                                            <td className="p-2 text-gray-800">{product.stock}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-gray-800" />
                                        <p className="text-sm text-gray-800">
                                            Los datos se importarán directamente a tu base de datos de Supabase. Revisa la información antes
                                            de confirmar.
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button onClick={confirmImport} className="bg-[#8B4513] hover:bg-[#A0522D] text-white">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Confirmar Importación
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowPreview(false)
                                                setUploadedFile(null)
                                                setPreviewData([])
                                            }}
                                            className=""
                                        >
                                            Cancelar
                                        </Button>
                                        <Button variant="outline" className="">
                                            <Download className="w-4 h-4 mr-2" />
                                            Descargar Plantilla
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-white border-[#8B4513]/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Visualizaciones</p>
                                    <p className="text-2xl font-bold text-gray-800">{businessStats.totalViews.toLocaleString()}</p>
                                    <p className="text-xs text-green-600">+12% vs mes anterior</p>
                                </div>
                                <Eye className="w-8 h-8 text-gray-800" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-[#8B4513]/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Clics</p>
                                    <p className="text-2xl font-bold text-gray-800">{businessStats.totalClicks.toLocaleString()}</p>
                                    <p className="text-xs text-green-600">CTR: {businessStats.ctr}%</p>
                                </div>
                                <Target className="w-8 h-8 text-gray-800" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-[#8B4513]/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Conversiones</p>
                                    <p className="text-2xl font-bold text-gray-800">{businessStats.conversions}</p>
                                    <p className="text-xs text-green-600">{businessStats.conversionRate}% tasa</p>
                                </div>
                                <ShoppingCart className="w-8 h-8 text-gray-800" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-[#8B4513]/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Ingresos</p>
                                    <p className="text-2xl font-bold text-gray-800">${businessStats.revenue.toLocaleString()}</p>
                                    <p className="text-xs text-green-600">+8% vs mes anterior</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-gray-800" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="products" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 bg-secondary">
                        <TabsTrigger value="products" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-gray-800">Productos</TabsTrigger>
                        <TabsTrigger value="promotions" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-gray-800">Promociones</TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-gray-800">Analíticas</TabsTrigger>
                        <TabsTrigger value="insights" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-gray-800">Insights</TabsTrigger>
                        <TabsTrigger value="billing" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-gray-800">Facturación</TabsTrigger>
                    </TabsList>

                    <TabsContent value="products">
                        <Card className="bg-white border-[#8B4513]/20">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-gray-800">
                                            <FileSpreadsheet className="w-5 h-5" />
                                            Gestión de Productos
                                        </CardTitle>
                                        <CardDescription className="text-gray-600">
                                            Administra tu catálogo de productos y mantén actualizada la información
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Importar CSV/XLSX
                                        </Button>
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Agregar Producto
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Formato recomendado */}
                                    <div className="bg-secondary border border-[#8B4513]/20 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-800 mb-2">Formato Recomendado para CSV/XLSX</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Para una importación exitosa, asegúrate de incluir estas columnas:
                                        </p>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-gray-800">nombre</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-gray-800">marca</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-gray-800">categoria</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-gray-800">precio</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-gray-800">stock</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-gray-800">sku</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-gray-800">descripcion</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-gray-800">imagen_url</Badge>
                                        </div>
                                    </div>

                                    {/* Lista de productos */}
                                    <div className="space-y-3">
                                        {importedProducts.map((product) => (
                                            <Card key={product.id} className="border-l-4 border-l-[#8B4513] bg-white">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                                                <Badge variant={product.status === "active" ? "default" : "secondary"} className={product.status === "active" ? "bg-[#8B4513] text-white" : "bg-secondary text-gray-800"}>
                                                                    {product.status === "active" ? "Activo" : "Inactivo"}
                                                                </Badge>
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                <div>
                                                                    <span className="text-gray-600">Marca:</span>
                                                                    <p className="font-medium text-gray-800">{product.brand}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">Categoría:</span>
                                                                    <p className="font-medium text-gray-800">{product.category}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">Precio:</span>
                                                                    <p className="font-medium text-gray-800">${product.price}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">Stock:</span>
                                                                    <p className="font-medium text-gray-800">{product.stock} unidades</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                                                                <span>SKU: {product.sku}</span>
                                                                <span>Actualizado: {product.lastUpdated}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm" className="">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Promotions Tab */}
                    <TabsContent value="promotions">
                        <Card className="bg-white border-[#8B4513]/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <Star className="w-5 h-5" />
                                    Productos Promocionados
                                </CardTitle>
                                <CardDescription className="text-gray-600">Gestiona tus promociones activas y su rendimiento</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {promotedProducts.map((product) => (
                                        <Card key={product.id} className="border-l-4 border-l-[#8B4513] bg-white">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {product.brand} • {product.category}
                                                        </p>
                                                    </div>
                                                    <Badge variant={product.status === "active" ? "default" : "secondary"} className={product.status === "active" ? "bg-[#8B4513] text-white" : "bg-secondary text-gray-800"}>
                                                        {product.status === "active" ? "Activa" : "Pausada"}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-gray-800">{product.views.toLocaleString()}</p>
                                                        <p className="text-xs text-gray-600">Visualizaciones</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-gray-800">{product.clicks}</p>
                                                        <p className="text-xs text-gray-600">Clics</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-gray-800">{product.conversions}</p>
                                                        <p className="text-xs text-gray-600">Conversiones</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-gray-800">${product.revenue}</p>
                                                        <p className="text-xs text-gray-600">Ingresos</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-4">
                                                    <Button variant="outline" size="sm" className="">
                                                        Editar
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="">
                                                        {product.status === "active" ? "Pausar" : "Activar"}
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="">
                                                        Ver Detalles
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-white border-[#8B4513]/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                        <BarChart3 className="w-5 h-5" />
                                        Rendimiento Semanal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-800">Lunes</span>
                                            <div className="flex items-center gap-2">
                                                <Progress value={85} className="w-24" />
                                                <span className="text-sm font-medium text-gray-800">1,247</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-800">Martes</span>
                                            <div className="flex items-center gap-2">
                                                <Progress value={92} className="w-24" />
                                                <span className="text-sm font-medium text-gray-800">1,356</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-800">Miércoles</span>
                                            <div className="flex items-center gap-2">
                                                <Progress value={78} className="w-24" />
                                                <span className="text-sm font-medium text-gray-800">1,145</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-800">Jueves</span>
                                            <div className="flex items-center gap-2">
                                                <Progress value={95} className="w-24" />
                                                <span className="text-sm font-medium text-gray-800">1,398</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-800">Viernes</span>
                                            <div className="flex items-center gap-2">
                                                <Progress value={100} className="w-24" />
                                                <span className="text-sm font-medium text-gray-800">1,467</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-[#8B4513]/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                        <TrendingUp className="w-5 h-5" />
                                        Productos Más Vistos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-800">Aceite de Oliva</p>
                                                <p className="text-sm text-gray-600">2,156 vistas</p>
                                            </div>
                                            <Badge variant="secondary" className="bg-secondary text-gray-800">+15%</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-800">Pollo Congelado</p>
                                                <p className="text-sm text-gray-600">1,892 vistas</p>
                                            </div>
                                            <Badge variant="secondary" className="bg-secondary text-gray-800">+8%</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-800">Arroz Integral</p>
                                                <p className="text-sm text-gray-600">1,634 vistas</p>
                                            </div>
                                            <Badge variant="secondary" className="bg-secondary text-gray-800">+12%</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-800">Leche Entera</p>
                                                <p className="text-sm text-gray-600">1,445 vistas</p>
                                            </div>
                                            <Badge variant="secondary" className="bg-secondary text-gray-800">+5%</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Insights Tab */}
                    <TabsContent value="insights">
                        <Card className="bg-white border-[#8B4513]/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <Users className="w-5 h-5" />
                                    Insights de Clientes
                                </CardTitle>
                                <CardDescription className="text-gray-600">Conoce mejor a tu audiencia y sus patrones de compra</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {customerInsights.map((insight, index) => (
                                        <Card key={index} className="border-l-4 border-l-[#8B4513] bg-white">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-gray-800">{insight.demographic}</h4>
                                                    <Badge variant="outline" className="border-[#8B4513]/30 text-gray-800">{insight.percentage}%</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Gasto promedio:</span>
                                                        <span className="font-medium text-gray-800">${insight.avgSpend}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">Productos favoritos:</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {insight.topProducts.map((product, idx) => (
                                                                <Badge key={idx} variant="secondary" className="text-xs bg-secondary text-gray-800">
                                                                    {product}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Billing Tab */}
                    <TabsContent value="billing">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-white border-[#8B4513]/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                        <DollarSign className="w-5 h-5" />
                                        Plan Actual
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-800">Plan Empresarial</span>
                                            <Badge variant="default" className="bg-[#8B4513] text-white">Activo</Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Costo mensual:</span>
                                                <span className="font-medium text-gray-800">$299 USD</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Próximo cobro:</span>
                                                <span className="font-medium text-gray-800">15 Feb 2024</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Promociones incluidas:</span>
                                                <span className="font-medium text-gray-800">50/mes</span>
                                            </div>
                                        </div>
                                        <Button className="w-full bg-transparent border-[#8B4513]/30 text-gray-800 hover:bg-[#8B4513]/10" variant="outline">
                                            Actualizar Plan
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-[#8B4513]/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                        <Calendar className="w-5 h-5" />
                                        Historial de Pagos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Enero 2024</p>
                                                <p className="text-sm text-gray-600">Plan Empresarial</p>
                                            </div>
                                            <span className="font-medium text-gray-800">$299</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Diciembre 2023</p>
                                                <p className="text-sm text-gray-600">Plan Empresarial</p>
                                            </div>
                                            <span className="font-medium text-gray-800">$299</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Noviembre 2023</p>
                                                <p className="text-sm text-gray-600">Plan Empresarial</p>
                                            </div>
                                            <span className="font-medium text-gray-800">$299</span>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4 bg-transparent border-[#8B4513]/30 text-gray-800 hover:bg-[#8B4513]/10" variant="outline">
                                        Ver Historial Completo
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
