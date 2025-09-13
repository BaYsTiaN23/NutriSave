import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, ArrowLeft, Plus, Heart, MessageCircle, Share2, Clock, Search, TrendingUp } from "lucide-react"
import { Link, usePage, router } from "@inertiajs/react"

// Datos de ejemplo para posts de la comunidad
const communityPosts = [
    {
        id: 1,
        author: {
            name: "María González",
            avatar: "/user-avatar.jpg",
            badge: "Ahorradora Experta",
        },
        title: "Menú completo por $150 pesos para 4 personas",
        content:
            "Logré hacer un menú completo para toda la semana gastando solo $150 pesos. Les comparto mi estrategia y lista de compras.",
        category: "Consejos de Ahorro",
        likes: 24,
        comments: 8,
        shares: 5,
        timeAgo: "2 horas",
        tags: ["presupuesto", "familia", "ahorro"],
    },
    {
        id: 2,
        author: {
            name: "Carlos Ruiz",
            avatar: "/user-avatar.jpg",
            badge: "Chef Casero",
        },
        title: "Receta: Pollo en salsa verde súper rendidor",
        content:
            "Esta receta me rinde para 6 porciones y cuesta menos de $80 pesos. El secreto está en usar muslos en lugar de pechuga.",
        category: "Recetas",
        likes: 18,
        comments: 12,
        shares: 7,
        timeAgo: "4 horas",
        tags: ["receta", "pollo", "rendidor"],
    },
    {
        id: 3,
        author: {
            name: "Ana Martínez",
            avatar: "/user-avatar.jpg",
            badge: "Organizadora Pro",
        },
        title: "Cómo organizo mi despensa para no desperdiciar nada",
        content:
            "Mi sistema de rotación de productos me ha ayudado a reducir el desperdicio en un 80%. Aquí les explico paso a paso.",
        category: "Organización",
        likes: 31,
        comments: 15,
        shares: 12,
        timeAgo: "1 día",
        tags: ["despensa", "organización", "desperdicio"],
    },
    {
        id: 4,
        author: {
            name: "Luis Hernández",
            avatar: "/user-avatar.jpg",
            badge: "Cazador de Ofertas",
        },
        title: "Ofertas de la semana en Soriana y Walmart",
        content: "Encontré ofertas increíbles esta semana. Pollo a $35/kg en Soriana y arroz a $12/kg en Walmart. ¡Corran!",
        category: "Ofertas",
        likes: 45,
        comments: 22,
        shares: 18,
        timeAgo: "6 horas",
        tags: ["ofertas", "soriana", "walmart"],
    },
]

const categories = ["Todos", "Consejos de Ahorro", "Recetas", "Organización", "Ofertas", "Menús Semanales"]

export default function CommunityPage() {
    const { auth } = usePage().props as any
    const [selectedCategory, setSelectedCategory] = useState("Todos")
    const [searchTerm, setSearchTerm] = useState("")
    const [isNewPostOpen, setIsNewPostOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    const handleNewPostClick = () => {
        if (!auth.user) {
            // Mostrar modal de inicio de sesión si no está autenticado
            setIsLoginModalOpen(true)
            return
        }
        setIsNewPostOpen(true)
    }

    const handleLoginRedirect = () => {
        window.location.href = '/login'
    }

    const handleBackClick = () => {
        if (auth.user) {
            // Si está autenticado, ir al dashboard
            window.location.href = '/dashboard'
        } else {
            // Si no está autenticado, ir al inicio
            window.location.href = '/'
        }
    }

    const filteredPosts = communityPosts.filter((post) => {
        const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="min-h-screen bg-[#faf9f7]">
            {/* Header */}
            <header className="border-b border-[#8B4513]/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#8B4513] hover:bg-[#8B4513] hover:text-white transition-colors"
                                onClick={handleBackClick}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Button>
                            <div className="flex items-center gap-2">
                                <Users className="w-6 h-6 text-[#8B4513]" />
                                <h1 className="text-xl font-bold text-[#8B4513]">Comunidad NutriSave</h1>
                            </div>
                        </div>
                        <Button
                            className="bg-[#8B4513] hover:bg-[#A0522D] text-white"
                            onClick={handleNewPostClick}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Post
                        </Button>

                        <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                            <DialogContent className="max-w-2xl bg-[#faf9f7] border-[#8B4513]/20">
                                <DialogHeader className="bg-[#8B4513] text-white p-6 -m-6 mb-6 rounded-t-lg">
                                    <DialogTitle className="text-xl font-bold">Compartir con la Comunidad</DialogTitle>
                                    <DialogDescription className="text-white/90">Comparte tus tips, recetas o experiencias de ahorro</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="post-title" className="text-[#8B4513]">Título</Label>
                                        <Input id="post-title" placeholder="Ej: Mi receta favorita para ahorrar..." className="text-[#8B4513] placeholder:text-[#8B4513]/60 border-[#8B4513]/20 focus:border-[#8B4513] bg-white" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="post-category" className="text-[#8B4513]">Categoría</Label>
                                        <Select>
                                            <SelectTrigger className="text-[#8B4513] border-[#8B4513]/20 focus:border-[#8B4513] bg-white">
                                                <SelectValue placeholder="Selecciona una categoría" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#8B4513]/20">
                                                {categories.slice(1).map((cat) => (
                                                    <SelectItem key={cat} value={cat} className="text-[#8B4513] hover:bg-[#8B4513]/10">
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="post-content" className="text-[#8B4513]">Contenido</Label>
                                        <Textarea
                                            id="post-content"
                                            placeholder="Comparte tu experiencia, receta o tip..."
                                            className="min-h-32 text-[#8B4513] placeholder:text-[#8B4513]/60 border-[#8B4513]/20 focus:border-[#8B4513] bg-white"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="post-tags" className="text-[#8B4513]">Tags (separados por comas)</Label>
                                        <Input id="post-tags" placeholder="ahorro, receta, fácil" className="text-[#8B4513] placeholder:text-[#8B4513]/60 border-[#8B4513]/20 focus:border-[#8B4513] bg-white" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4 border-t border-[#8B4513]/20">
                                    <Button variant="outline" onClick={() => setIsNewPostOpen(false)} className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10 bg-white">
                                        Cancelar
                                    </Button>
                                    <Button onClick={() => setIsNewPostOpen(false)} className="bg-[#8B4513] hover:bg-[#A0522D] text-white">Publicar</Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Modal de Login Requerido */}
                        <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
                            <DialogContent className="max-w-md bg-[#faf9f7] border-[#8B4513]/20">
                                <DialogHeader className="bg-[#8B4513] text-white p-6 -m-6 mb-6 rounded-t-lg">
                                    <DialogTitle className="text-xl font-bold">Iniciar Sesión Requerido</DialogTitle>
                                    <DialogDescription className="text-white/90">
                                        Necesitas iniciar sesión para crear posts en la comunidad
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-[#8B4513]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-8 h-8 text-[#8B4513]" />
                                        </div>
                                        <p className="text-[#8B4513]/80">
                                            Únete a nuestra comunidad para compartir tus tips, recetas y experiencias de ahorro con otros usuarios.
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button
                                            type="button"
                                            onClick={handleLoginRedirect}
                                            className="flex-1 bg-[#8B4513] hover:bg-[#A0522D] text-white"
                                        >
                                            Iniciar Sesión
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsLoginModalOpen(false)}
                                            className="flex-1 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10 bg-white"
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-[#8B4513]">1,247</div>
                            <div className="text-sm text-[#8B4513]/70">Miembros Activos</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-[#8B4513]">$2,340</div>
                            <div className="text-sm text-[#8B4513]/70">Ahorro Promedio</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-[#8B4513]">156</div>
                            <div className="text-sm text-[#8B4513]/70">Recetas Compartidas</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-[#8B4513]">89</div>
                            <div className="text-sm text-[#8B4513]/70">Consejos Esta Semana</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="mb-6 bg-[#EFDBCD] border-[#8B4513]/20">
                            <CardHeader>
                                <CardTitle className="text-lg text-[#8B4513]">Filtros</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-[#8B4513]">Buscar</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]/50 w-4 h-4" />
                                        <Input
                                            placeholder="Buscar posts..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 border-[#8B4513]/20 focus:border-[#8B4513] text-[#8B4513] placeholder:text-[#8B4513]/60"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-[#8B4513]">Categoría</Label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="border-[#8B4513]/20 focus:border-[#8B4513] text-[#8B4513]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Temas Populares */}
                        <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-[#8B4513]">
                                    <TrendingUp className="w-4 h-4" />
                                    Tendencias
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#8B4513]">#ahorro</span>
                                        <Badge variant="secondary" className="text-xs bg-[#8B4513] text-white">
                                            24 publicaciones
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#8B4513]">#recetas</span>
                                        <Badge variant="secondary" className="text-xs bg-[#8B4513] text-white">
                                            18 publicaciones
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#8B4513]">#ofertas</span>
                                        <Badge variant="secondary" className="text-xs bg-[#8B4513] text-white">
                                            15 publicaciones
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#8B4513]">#despensa</span>
                                        <Badge variant="secondary" className="text-xs bg-[#8B4513] text-white">
                                            12 publicaciones
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Feed de Publicaciones */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            {filteredPosts.map((post) => (
                                <Card key={post.id} className="hover:shadow-md transition-shadow bg-white border-[#8B4513]/20">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                                                    <AvatarFallback className="bg-[#8B4513] text-white">{post.author.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold text-sm text-[#8B4513]">{post.author.name}</h4>
                                                        <Badge variant="outline" className="text-xs border-[#8B4513]/20 text-[#8B4513]">
                                                            {post.author.badge}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-[#8B4513]/70">
                                                        <Clock className="w-3 h-3" />
                                                        {post.timeAgo}
                                                        <span>•</span>
                                                        <Badge variant="secondary" className="text-xs bg-[#EFDBCD] text-[#8B4513]">
                                                            {post.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <h3 className="font-bold text-lg mb-2 text-balance text-[#8B4513]">{post.title}</h3>
                                        <p className="text-[#8B4513]/80 mb-4 text-pretty">{post.content}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs border-[#8B4513]/20 text-[#8B4513]">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex items-center justify-between pt-4 border-t border-[#8B4513]/20">
                                            <div className="flex items-center gap-4">
                                                <Button variant="ghost" size="sm" className="text-[#8B4513]/70 hover:bg-red-50 hover:text-red-600 transition-colors">
                                                    <Heart className="w-4 h-4 mr-1" />
                                                    {post.likes}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-[#8B4513]/70 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                                    <MessageCircle className="w-4 h-4 mr-1" />
                                                    {post.comments}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-[#8B4513]/70 hover:bg-green-50 hover:text-green-600 transition-colors">
                                                    <Share2 className="w-4 h-4 mr-1" />
                                                    {post.shares}
                                                </Button>
                                            </div>

                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredPosts.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-[#8B4513]/50 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2 text-[#8B4513]">No se encontraron publicaciones</h3>
                                <p className="text-[#8B4513]/70 mb-4">
                                    Intenta cambiar los filtros o sé el primero en compartir algo
                                </p>
                                <Button onClick={handleNewPostClick} className="bg-[#8B4513] hover:bg-[#A0522D] text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear Primera Publicación
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}