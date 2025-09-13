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
        <div className="min-h-screen bg-[#faf9f7]">
            {/* Header */}
            <header className="border-b border-[#8B4513]/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="text-[#8B4513] hover:bg-[#8B4513]/10">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-[#8B4513]" />
                                <div>
                                    <h1 className="text-xl font-bold text-[#8B4513]">Panel Empresarial</h1>
                                    <p className="text-sm text-[#8B4513]/70">Soriana Express - Sucursal Centro</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10">
                                <Upload className="w-4 h-4 mr-2" />
                                Subir Productos
                            </Button>
                            <Dialog open={isNewPromotionOpen} onOpenChange={setIsNewPromotionOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-[#8B4513] hover:bg-[#A0522D] text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Nueva Promoción
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl bg-[#faf9f7] border-[#8B4513]/20">
                                    <DialogHeader>
                                        <DialogTitle className="text-[#8B4513]">Crear Nueva Promoción</DialogTitle>
                                        <DialogDescription className="text-[#8B4513]/70">Destaca tus productos en las recomendaciones de NutriSave</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="product-name" className="text-[#8B4513]">Producto</Label>
                                            <Input id="product-name" placeholder="Nombre del producto" className="border-[#8B4513]/30 focus:border-[#8B4513]" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="discount" className="text-[#8B4513]">Descuento (%)</Label>
                                            <Input id="discount" type="number" placeholder="15" className="border-[#8B4513]/30 focus:border-[#8B4513]" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="target-audience" className="text-[#8B4513]">Audiencia Objetivo</Label>
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
                                            <Label htmlFor="budget" className="text-[#8B4513]">Presupuesto Diario</Label>
                                            <Input id="budget" type="number" placeholder="500" className="border-[#8B4513]/30 focus:border-[#8B4513]" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description" className="text-[#8B4513]">Descripción de la Oferta</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Describe los beneficios de tu promoción..."
                                                className="min-h-20 border-[#8B4513]/30 focus:border-[#8B4513]"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsNewPromotionOpen(false)} className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10">
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
                            <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                                <FileSpreadsheet className="w-5 h-5" />
                                Gestión de Productos
                            </CardTitle>
                            <CardDescription className="text-[#8B4513]/70">Sube archivos CSV o XLSX para importar productos masivamente</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isUploading && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Upload className="w-5 h-5 text-[#8B4513]" />
                                        <span className="font-medium text-[#8B4513]">Procesando: {uploadedFile?.name}</span>
                                    </div>
                                    <Progress value={uploadProgress} className="w-full" />
                                    <p className="text-sm text-[#8B4513]/70">Validando formato y estructura de datos...</p>
                                </div>
                            )}

                            {showPreview && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="font-medium text-[#8B4513]">Archivo procesado: {uploadedFile?.name}</span>
                                        </div>
                                        <Badge variant="secondary" className="bg-[#EFDBCD] text-[#8B4513]">{previewData.length} productos encontrados</Badge>
                                    </div>

                                    <div className="bg-[#EFDBCD]/30 rounded-lg p-4">
                                        <h4 className="font-medium mb-3 text-[#8B4513]">Vista Previa de Datos</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-[#8B4513]/20">
                                                        <th className="text-left p-2 text-[#8B4513]">Nombre</th>
                                                        <th className="text-left p-2 text-[#8B4513]">Marca</th>
                                                        <th className="text-left p-2 text-[#8B4513]">Categoría</th>
                                                        <th className="text-left p-2 text-[#8B4513]">Precio</th>
                                                        <th className="text-left p-2 text-[#8B4513]">Stock</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {previewData.map((product, index) => (
                                                        <tr key={index} className="border-b border-[#8B4513]/10">
                                                            <td className="p-2 text-[#8B4513]">{product.nombre}</td>
                                                            <td className="p-2 text-[#8B4513]">{product.marca}</td>
                                                            <td className="p-2 text-[#8B4513]">{product.categoria}</td>
                                                            <td className="p-2 text-[#8B4513]">${product.precio}</td>
                                                            <td className="p-2 text-[#8B4513]">{product.stock}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 p-3 bg-[#EFDBCD] rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-[#8B4513]" />
                                        <p className="text-sm text-[#8B4513]">
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
                                            className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button variant="outline" className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10">
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
                                    <p className="text-sm text-[#8B4513]/70">Visualizaciones</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">{businessStats.totalViews.toLocaleString()}</p>
                                    <p className="text-xs text-green-600">+12% vs mes anterior</p>
                                </div>
                                <Eye className="w-8 h-8 text-[#8B4513]" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-[#8B4513]/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#8B4513]/70">Clics</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">{businessStats.totalClicks.toLocaleString()}</p>
                                    <p className="text-xs text-green-600">CTR: {businessStats.ctr}%</p>
                                </div>
                                <Target className="w-8 h-8 text-[#8B4513]" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-[#8B4513]/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#8B4513]/70">Conversiones</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">{businessStats.conversions}</p>
                                    <p className="text-xs text-green-600">{businessStats.conversionRate}% tasa</p>
                                </div>
                                <ShoppingCart className="w-8 h-8 text-[#8B4513]" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-[#8B4513]/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#8B4513]/70">Ingresos</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">${businessStats.revenue.toLocaleString()}</p>
                                    <p className="text-xs text-green-600">+8% vs mes anterior</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-[#8B4513]" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="products" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 bg-[#EFDBCD]">
                        <TabsTrigger value="products" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-[#8B4513]">Productos</TabsTrigger>
                        <TabsTrigger value="promotions" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-[#8B4513]">Promociones</TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-[#8B4513]">Analíticas</TabsTrigger>
                        <TabsTrigger value="insights" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-[#8B4513]">Insights</TabsTrigger>
                        <TabsTrigger value="billing" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-[#8B4513]">Facturación</TabsTrigger>
                    </TabsList>

                    <TabsContent value="products">
                        <Card className="bg-white border-[#8B4513]/20">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                                            <FileSpreadsheet className="w-5 h-5" />
                                            Gestión de Productos
                                        </CardTitle>
                                        <CardDescription className="text-[#8B4513]/70">
                                            Administra tu catálogo de productos y mantén actualizada la información
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Importar CSV/XLSX
                                        </Button>
                                        <Button className="bg-[#8B4513] hover:bg-[#A0522D] text-white">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Agregar Producto
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Formato recomendado */}
                                    <div className="bg-[#EFDBCD] border border-[#8B4513]/20 rounded-lg p-4">
                                        <h4 className="font-medium text-[#8B4513] mb-2">Formato Recomendado para CSV/XLSX</h4>
                                        <p className="text-sm text-[#8B4513]/70 mb-3">
                                            Para una importación exitosa, asegúrate de incluir estas columnas:
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-[#8B4513]">nombre</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-[#8B4513]">marca</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-[#8B4513]">categoria</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-[#8B4513]">precio</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-[#8B4513]">stock</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-[#8B4513]">sku</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-[#8B4513]">descripcion</Badge>
                                            <Badge variant="outline" className="border-[#8B4513]/30 text-[#8B4513]">imagen_url</Badge>
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
                                                                <h4 className="font-semibold text-[#8B4513]">{product.name}</h4>
                                                                <Badge variant={product.status === "active" ? "default" : "secondary"} className={product.status === "active" ? "bg-[#8B4513] text-white" : "bg-[#EFDBCD] text-[#8B4513]"}>
                                                                    {product.status === "active" ? "Activo" : "Inactivo"}
                                                                </Badge>
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                <div>
                                                                    <span className="text-[#8B4513]/70">Marca:</span>
                                                                    <p className="font-medium text-[#8B4513]">{product.brand}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-[#8B4513]/70">Categoría:</span>
                                                                    <p className="font-medium text-[#8B4513]">{product.category}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-[#8B4513]/70">Precio:</span>
                                                                    <p className="font-medium text-[#8B4513]">${product.price}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-[#8B4513]/70">Stock:</span>
                                                                    <p className="font-medium text-[#8B4513]">{product.stock} unidades</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 mt-2 text-xs text-[#8B4513]/70">
                                                                <span>SKU: {product.sku}</span>
                                                                <span>Actualizado: {product.lastUpdated}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm" className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10">
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
                                <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                                    <Star className="w-5 h-5" />
                                    Productos Promocionados
                                </CardTitle>
                                <CardDescription className="text-[#8B4513]/70">Gestiona tus promociones activas y su rendimiento</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {promotedProducts.map((product) => (
                                        <Card key={product.id} className="border-l-4 border-l-[#8B4513] bg-white">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h4 className="font-semibold text-[#8B4513]">{product.name}</h4>
                                                        <p className="text-sm text-[#8B4513]/70">
                                                            {product.brand} • {product.category}
                                                        </p>
                                                    </div>
                                                    <Badge variant={product.status === "active" ? "default" : "secondary"} className={product.status === "active" ? "bg-[#8B4513] text-white" : "bg-[#EFDBCD] text-[#8B4513]"}>
                                                        {product.status === "active" ? "Activa" : "Pausada"}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-[#8B4513]">{product.views.toLocaleString()}</p>
                                                        <p className="text-xs text-[#8B4513]/70">Visualizaciones</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-[#8B4513]">{product.clicks}</p>
                                                        <p className="text-xs text-[#8B4513]/70">Clics</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-[#8B4513]">{product.conversions}</p>
                                                        <p className="text-xs text-[#8B4513]/70">Conversiones</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-[#8B4513]">${product.revenue}</p>
                                                        <p className="text-xs text-[#8B4513]/70">Ingresos</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-4">
                                                    <Button variant="outline" size="sm" className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10">
                                                        Editar
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10">
                                                        {product.status === "active" ? "Pausar" : "Activar"}
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10">
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
                                    <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                                        <BarChart3 className="w-5 h-5" />
                                        Rendimiento Semanal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[#8B4513]">Lunes</span>
                                            <div className="flex items-center gap-2">
                                                <Progress value={85} className="w-24" />
                                                <span className="text-sm font-medium text-[#8B4513]">1,247</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[#8B4513]">Martes</span>
                                            <div className="flex items-center gap-2">
                                                <Progress value={92} className="w-24" />
                                                <span className="text-sm font-medium text-[#8B4513]">1,356</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[#8B4513]">Miércoles</span>
                                            <div className="flex items-center gap-2">
                                                <Progress value={78} className="w-24" />
                                                <span className="text-sm font-medium text-[#8B4513]">1,145</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[#8B4513]">Jueves</span>
                                            <div className="flex items-center gap-2">
                                                <Progress value={95} className="w-24" />
                                                <span className="text-sm font-medium text-[#8B4513]">1,398</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[#8B4513]">Viernes</span>
                                            <div className="flex items-center gap-2">
                                                <Progress value={100} className="w-24" />
                                                <span className="text-sm font-medium text-[#8B4513]">1,467</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-[#8B4513]/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                                        <TrendingUp className="w-5 h-5" />
                                        Productos Más Vistos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-[#8B4513]">Aceite de Oliva</p>
                                                <p className="text-sm text-[#8B4513]/70">2,156 vistas</p>
                                            </div>
                                            <Badge variant="secondary" className="bg-[#EFDBCD] text-[#8B4513]">+15%</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-[#8B4513]">Pollo Congelado</p>
                                                <p className="text-sm text-[#8B4513]/70">1,892 vistas</p>
                                            </div>
                                            <Badge variant="secondary" className="bg-[#EFDBCD] text-[#8B4513]">+8%</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-[#8B4513]">Arroz Integral</p>
                                                <p className="text-sm text-[#8B4513]/70">1,634 vistas</p>
                                            </div>
                                            <Badge variant="secondary" className="bg-[#EFDBCD] text-[#8B4513]">+12%</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-[#8B4513]">Leche Entera</p>
                                                <p className="text-sm text-[#8B4513]/70">1,445 vistas</p>
                                            </div>
                                            <Badge variant="secondary" className="bg-[#EFDBCD] text-[#8B4513]">+5%</Badge>
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
                                <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                                    <Users className="w-5 h-5" />
                                    Insights de Clientes
                                </CardTitle>
                                <CardDescription className="text-[#8B4513]/70">Conoce mejor a tu audiencia y sus patrones de compra</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {customerInsights.map((insight, index) => (
                                        <Card key={index} className="border-l-4 border-l-[#8B4513] bg-white">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-[#8B4513]">{insight.demographic}</h4>
                                                    <Badge variant="outline" className="border-[#8B4513]/30 text-[#8B4513]">{insight.percentage}%</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-[#8B4513]/70">Gasto promedio:</span>
                                                        <span className="font-medium text-[#8B4513]">${insight.avgSpend}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-[#8B4513]/70 mb-1">Productos favoritos:</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {insight.topProducts.map((product, idx) => (
                                                                <Badge key={idx} variant="secondary" className="text-xs bg-[#EFDBCD] text-[#8B4513]">
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
                                    <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                                        <DollarSign className="w-5 h-5" />
                                        Plan Actual
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-[#8B4513]">Plan Empresarial</span>
                                            <Badge variant="default" className="bg-[#8B4513] text-white">Activo</Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#8B4513]/70">Costo mensual:</span>
                                                <span className="font-medium text-[#8B4513]">$299 USD</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#8B4513]/70">Próximo cobro:</span>
                                                <span className="font-medium text-[#8B4513]">15 Feb 2024</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#8B4513]/70">Promociones incluidas:</span>
                                                <span className="font-medium text-[#8B4513]">50/mes</span>
                                            </div>
                                        </div>
                                        <Button className="w-full bg-transparent border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10" variant="outline">
                                            Actualizar Plan
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-[#8B4513]/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                                        <Calendar className="w-5 h-5" />
                                        Historial de Pagos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-[#EFDBCD]/30 rounded-lg">
                                            <div>
                                                <p className="font-medium text-[#8B4513]">Enero 2024</p>
                                                <p className="text-sm text-[#8B4513]/70">Plan Empresarial</p>
                                            </div>
                                            <span className="font-medium text-[#8B4513]">$299</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-[#EFDBCD]/30 rounded-lg">
                                            <div>
                                                <p className="font-medium text-[#8B4513]">Diciembre 2023</p>
                                                <p className="text-sm text-[#8B4513]/70">Plan Empresarial</p>
                                            </div>
                                            <span className="font-medium text-[#8B4513]">$299</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-[#EFDBCD]/30 rounded-lg">
                                            <div>
                                                <p className="font-medium text-[#8B4513]">Noviembre 2023</p>
                                                <p className="text-sm text-[#8B4513]/70">Plan Empresarial</p>
                                            </div>
                                            <span className="font-medium text-[#8B4513]">$299</span>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4 bg-transparent border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/10" variant="outline">
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
