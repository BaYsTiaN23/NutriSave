"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { router } from "@inertiajs/react"
import axios from "axios"
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

// Types for the business data
interface BusinessStats {
    totalViews: number
    totalClicks: number
    conversions: number
    revenue: number
    ctr: number
    conversionRate: number
}

interface PromotionData {
    business_id: number
    name: string
    discount_percentage: number
    budget: number
    description: string
    start_date: string
    end_date: string
    status: string
}

interface ProductData {
    business_id: number
    name: string
    brand: string
    category: string
    price: number
    stock: number
    sku: string
    description?: string
    image_url?: string
}

interface Product {
    id: number
    name: string
    brand: string
    category: string
    price: number
    stock: number
    sku: string
    status: string
    lastUpdated: string
}

interface PromotedProduct {
    id: number
    name: string
    brand: string
    category: string
    views: number
    clicks: number
    conversions: number
    revenue: number
    status: string
}

interface CustomerInsight {
    demographic: string
    percentage: number
    avgSpend: number
    topProducts: string[]
}

interface PreviewProduct {
    nombre: string
    marca: string
    categoria: string
    precio: number
    stock: number
}

// Mock data para el panel B2B (will be replaced with API calls)

export default function BusinessPage() {
    // State for API data
    const [businessStats, setBusinessStats] = useState<BusinessStats>({
        totalViews: 0,
        totalClicks: 0,
        conversions: 0,
        revenue: 0,
        ctr: 0,
        conversionRate: 0,
    })
    const [promotedProducts, setPromotedProducts] = useState<PromotedProduct[]>([])
    const [customerInsights, setCustomerInsights] = useState<CustomerInsight[]>([])
    const [importedProducts, setImportedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Form states
    const [isNewPromotionOpen, setIsNewPromotionOpen] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [previewData, setPreviewData] = useState<PreviewProduct[]>([])
    const [showPreview, setShowPreview] = useState(false)
    const [isCreatingPromotion, setIsCreatingPromotion] = useState(false)
    const [promotionForm, setPromotionForm] = useState({
        productName: '',
        discount: '',
        budget: '',
        description: ''
    })
    const fileInputRef = useRef<HTMLInputElement>(null)

    // API functions
    const fetchBusinessData = async () => {
        try {
            setLoading(true)
            
            // Fetch business analytics summary (assuming business ID 1 for now)
            const businessId = 1
            const [statsResponse, productsResponse, promotionsResponse] = await Promise.all([
                axios.get(`/api/b2b/businesses/${businessId}/analytics`),
                axios.get(`/api/b2b/businesses/${businessId}/products`),
                axios.get(`/api/b2b/businesses/${businessId}/promotions`)
            ])

            // Update states with API data, ensuring arrays
            setBusinessStats(statsResponse.data || {
                totalViews: 0,
                totalClicks: 0,
                conversions: 0,
                revenue: 0,
                ctr: 0,
                conversionRate: 0,
            })
            setImportedProducts(Array.isArray(productsResponse.data) ? productsResponse.data : [])
            setPromotedProducts(Array.isArray(promotionsResponse.data) ? promotionsResponse.data : [])

            // Mock customer insights for now (can be added to API later)
            setCustomerInsights([
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
            ])
        } catch (err) {
            setError('Error al cargar los datos del negocio')
            console.error('Error fetching business data:', err)
            // Set default empty arrays on error
            setImportedProducts([])
            setPromotedProducts([])
        } finally {
            setLoading(false)
        }
    }

    const createPromotion = async (promotionData: PromotionData) => {
        try {
            const response = await axios.post('/api/b2b/promotions', promotionData)
            // Refresh promotions list
            fetchBusinessData()
            return response.data
        } catch (err) {
            console.error('Error creating promotion:', err)
            throw err
        }
    }

    const createProduct = async (productData: ProductData) => {
        try {
            const response = await axios.post('/api/b2b/business-products', productData)
            // Refresh products list
            fetchBusinessData()
            return response.data
        } catch (err) {
            console.error('Error creating product:', err)
            throw err
        }
    }

    // Load data on component mount
    useEffect(() => {
        fetchBusinessData()
    }, [])

    // Form handlers
    const handlePromotionSubmit = async () => {
        try {
            setIsCreatingPromotion(true)
            const promotionData: PromotionData = {
                business_id: 1, // Assuming business ID 1 for now
                name: promotionForm.productName,
                discount_percentage: parseFloat(promotionForm.discount),
                budget: parseFloat(promotionForm.budget),
                description: promotionForm.description,
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
                status: 'active'
            }
            
            await createPromotion(promotionData)
            setIsNewPromotionOpen(false)
            setPromotionForm({ productName: '', discount: '', budget: '', description: '' })
        } catch (err) {
            console.error('Error creating promotion:', err)
            alert('Error al crear la promoción')
        } finally {
            setIsCreatingPromotion(false)
        }
    }

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
        <div className="min-h-screen bg-white">
            {/* Loading State */}
            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando datos del negocio...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                    <div className="text-center max-w-md mx-auto">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar datos</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={fetchBusinessData} className="bg-red-500 hover:bg-red-600 text-white">
                            Reintentar
                        </Button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="text-gray-800 hover:bg-accent">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-red-600" />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">Panel Empresarial</h1>
                                    <p className="text-sm text-red-600">Soriana Express - Sucursal Centro</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="border-red-300 text-red-700 hover:bg-red-50">
                                <Upload className="w-4 h-4 mr-2" />
                                Subir Productos
                            </Button>
                            <Dialog open={isNewPromotionOpen} onOpenChange={setIsNewPromotionOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-red-500 hover:bg-orange-500 text-white">
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
                                            <Input 
                                                id="product-name" 
                                                placeholder="Nombre del producto" 
                                                className="border-red-300 focus:border-red-500"
                                                value={promotionForm.productName}
                                                onChange={(e) => setPromotionForm({...promotionForm, productName: e.target.value})}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="discount" className="text-gray-800">Descuento (%)</Label>
                                            <Input 
                                                id="discount" 
                                                type="number" 
                                                placeholder="15" 
                                                className="border-red-300 focus:border-red-500"
                                                value={promotionForm.discount}
                                                onChange={(e) => setPromotionForm({...promotionForm, discount: e.target.value})}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="budget" className="text-gray-800">Presupuesto Diario</Label>
                                            <Input 
                                                id="budget" 
                                                type="number" 
                                                placeholder="500" 
                                                className="border-red-300 focus:border-red-500"
                                                value={promotionForm.budget}
                                                onChange={(e) => setPromotionForm({...promotionForm, budget: e.target.value})}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description" className="text-gray-800">Descripción de la Oferta</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Describe los beneficios de tu promoción..."
                                                className="min-h-20 border-red-300 focus:border-red-500"
                                                value={promotionForm.description}
                                                onChange={(e) => setPromotionForm({...promotionForm, description: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsNewPromotionOpen(false)} className="border-red-300 text-red-700 hover:bg-red-50">
                                            Cancelar
                                        </Button>
                                        <Button 
                                            onClick={handlePromotionSubmit} 
                                            disabled={isCreatingPromotion}
                                            className="bg-red-500 hover:bg-orange-500 text-white"
                                        >
                                            {isCreatingPromotion ? 'Creando...' : 'Crear Promoción'}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </header>

            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />

            <div className="container mx-auto px-4 py-8 bg-white">
                {(uploadedFile || showPreview) && (
                    <Card className="mb-8 bg-white border-red-200">
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

                                    <div className="bg-red-50 rounded-lg p-4">
                                        <h4 className="font-medium mb-3 text-gray-800">Vista Previa de Datos</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-red-200">
                                                        <th className="text-left p-2 text-gray-800">Nombre</th>
                                                        <th className="text-left p-2 text-gray-800">Marca</th>
                                                        <th className="text-left p-2 text-gray-800">Categoría</th>
                                                        <th className="text-left p-2 text-gray-800">Precio</th>
                                                        <th className="text-left p-2 text-gray-800">Stock</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {previewData.map((product, index) => (
                                                        <tr key={index} className="border-b border-red-100">
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

                                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                        <p className="text-sm text-red-800">
                                            Los datos se importarán directamente a tu base de datos de Supabase. Revisa la información antes
                                            de confirmar.
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button onClick={confirmImport} className="bg-red-500 hover:bg-orange-500 text-white">
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
                                            className="border-red-300 text-red-700 hover:bg-red-50"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
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
                    <Card className="bg-white border-red-200 hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Visualizaciones</p>
                                    <p className="text-2xl font-bold text-gray-800">{businessStats.totalViews.toLocaleString()}</p>
                                    <p className="text-xs text-green-600">+12% vs mes anterior</p>
                                </div>
                                <Eye className="w-8 h-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-red-200 hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Clics</p>
                                    <p className="text-2xl font-bold text-gray-800">{businessStats.totalClicks.toLocaleString()}</p>
                                    <p className="text-xs text-green-600">CTR: {businessStats.ctr}%</p>
                                </div>
                                <Target className="w-8 h-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-red-200 hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Conversiones</p>
                                    <p className="text-2xl font-bold text-gray-800">{businessStats.conversions}</p>
                                    <p className="text-xs text-green-600">{businessStats.conversionRate}% tasa</p>
                                </div>
                                <ShoppingCart className="w-8 h-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-red-200 hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Ingresos</p>
                                    <p className="text-2xl font-bold text-gray-800">${businessStats.revenue.toLocaleString()}</p>
                                    <p className="text-xs text-green-600">+8% vs mes anterior</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="products" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 bg-red-50">
                        <TabsTrigger value="products" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-800 hover:bg-red-100">Productos</TabsTrigger>
                        <TabsTrigger value="promotions" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-800 hover:bg-red-100">Promociones</TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-800 hover:bg-red-100">Analíticas</TabsTrigger>
                        <TabsTrigger value="insights" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-800 hover:bg-red-100">Insights</TabsTrigger>
                        <TabsTrigger value="billing" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-800 hover:bg-red-100">Facturación</TabsTrigger>
                    </TabsList>

                    <TabsContent value="products">
                        <Card className="bg-white border-red-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-gray-800">
                                            <FileSpreadsheet className="w-5 h-5 text-red-600" />
                                            Gestión de Productos
                                        </CardTitle>
                                        <CardDescription className="text-gray-600">
                                            Administra tu catálogo de productos y mantén actualizada la información
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="border-red-300 text-red-700 hover:bg-red-50">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Importar CSV/XLSX
                                        </Button>
                                        <Button className="bg-red-500 hover:bg-orange-500 text-white">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Agregar Producto
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Formato recomendado */}
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-800 mb-2">Formato Recomendado para CSV/XLSX</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Para una importación exitosa, asegúrate de incluir estas columnas:
                                        </p>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
                                            <Badge variant="outline" className="border-red-300 text-red-800">nombre</Badge>
                                            <Badge variant="outline" className="border-red-300 text-red-800">marca</Badge>
                                            <Badge variant="outline" className="border-red-300 text-red-800">categoria</Badge>
                                            <Badge variant="outline" className="border-red-300 text-red-800">precio</Badge>
                                            <Badge variant="outline" className="border-red-300 text-red-800">stock</Badge>
                                            <Badge variant="outline" className="border-red-300 text-red-800">sku</Badge>
                                            <Badge variant="outline" className="border-red-300 text-red-800">descripcion</Badge>
                                            <Badge variant="outline" className="border-red-300 text-red-800">imagen_url</Badge>
                                        </div>
                                    </div>

                                    {/* Lista de productos */}
                                    <div className="space-y-3">
                                        {Array.isArray(importedProducts) && importedProducts.length > 0 ? (
                                            importedProducts.map((product) => (
                                                <Card key={product.id} className="border-l-4 border-l-red-500 bg-white hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                                                    <Badge variant={product.status === "active" ? "default" : "secondary"} className={product.status === "active" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-800"}>
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
                                                                <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-2">No hay productos disponibles</p>
                                                <p className="text-sm text-gray-500">Importa productos usando el botón "Subir Productos" o agrega productos manualmente.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Promotions Tab */}
                    <TabsContent value="promotions">
                        <Card className="bg-white border-red-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <Star className="w-5 h-5 text-red-600" />
                                    Productos Promocionados
                                </CardTitle>
                                <CardDescription className="text-gray-600">Gestiona tus promociones activas y su rendimiento</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Array.isArray(promotedProducts) && promotedProducts.length > 0 ? (
                                        promotedProducts.map((product) => (
                                            <Card key={product.id} className="border-l-4 border-l-red-500 bg-white hover:shadow-md transition-shadow">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                {product.brand} • {product.category}
                                                            </p>
                                                        </div>
                                                        <Badge variant={product.status === "active" ? "default" : "secondary"} className={product.status === "active" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-800"}>
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
                                                        <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                                                            Editar
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                                                            {product.status === "active" ? "Pausar" : "Activar"}
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                                                            Ver Detalles
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2">No hay promociones activas</p>
                                            <p className="text-sm text-gray-500">Crea tu primera promoción usando el botón "Nueva Promoción".</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-white border-red-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                        <BarChart3 className="w-5 h-5 text-red-600" />
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

                            <Card className="bg-white border-red-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                        <TrendingUp className="w-5 h-5 text-red-600" />
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
                        <Card className="bg-white border-red-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <Users className="w-5 h-5 text-red-600" />
                                    Insights de Clientes
                                </CardTitle>
                                <CardDescription className="text-gray-600">Conoce mejor a tu audiencia y sus patrones de compra</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {customerInsights.map((insight, index) => (
                                        <Card key={index} className="border-l-4 border-l-red-500 bg-white hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-gray-800">{insight.demographic}</h4>
                                                    <Badge variant="outline" className="border-red-300 text-red-800">{insight.percentage}%</Badge>
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
                                                                <Badge key={idx} variant="secondary" className="text-xs bg-red-100 text-red-800">
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
                            <Card className="bg-white border-red-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                        <DollarSign className="w-5 h-5 text-red-600" />
                                        Plan Actual
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-800">Plan Empresarial</span>
                                            <Badge variant="default" className="bg-red-500 text-white">Activo</Badge>
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
                                        <Button className="w-full bg-transparent border-red-300 text-red-700 hover:bg-red-50" variant="outline">
                                            Actualizar Plan
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-red-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                        <Calendar className="w-5 h-5 text-red-600" />
                                        Historial de Pagos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Enero 2024</p>
                                                <p className="text-sm text-gray-600">Plan Empresarial</p>
                                            </div>
                                            <span className="font-medium text-gray-800">$299</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Diciembre 2023</p>
                                                <p className="text-sm text-gray-600">Plan Empresarial</p>
                                            </div>
                                            <span className="font-medium text-gray-800">$299</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Noviembre 2023</p>
                                                <p className="text-sm text-gray-600">Plan Empresarial</p>
                                            </div>
                                            <span className="font-medium text-gray-800">$299</span>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4 bg-transparent border-red-300 text-red-700 hover:bg-red-50" variant="outline">
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
