import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Utensils,
    ShoppingCart,
    PiggyBank,
    Users,
    Bot,
    TrendingUp,
    Clock,
    ArrowRight,
    Sparkles,
    Package,
    Bell,
    Settings,
} from "lucide-react"
import { Link } from "@inertiajs/react"

const featureCards = [
    {
        id: "pantry-manager",
        title: "Organizar Despensa",
        icon: Package,
        color: "text-[#8B4513]",
        bgColor: "bg-[#EFDBCD]",
        borderColor: "border-[#8B4513]/20",
        features: ["Inventario digital", "Fechas de vencimiento", "Sugerencias de uso"],
        description: "Mantén tu despensa organizada y evita desperdicios",
        href: "/pantry",
    },
    {
        id: "smart-shopping",
        title: "Lista Inteligente",
        icon: ShoppingCart,
        color: "text-[#8B4513]",
        bgColor: "bg-[#EFDBCD]",
        borderColor: "border-[#8B4513]/20",
        features: ["Precios comparados", "Ofertas locales", "Optimización de ruta"],
        description: "Listas de compras con los mejores precios cerca de ti",
        href: "/shopping",
    },
    {
        id: "savings-tracker",
        title: "Monitor de Ahorros",
        icon: PiggyBank,
        color: "text-[#8B4513]",
        bgColor: "bg-[#EFDBCD]",
        borderColor: "border-[#8B4513]/20",
        features: ["Ahorro semanal", "Comparativas", "Metas de presupuesto"],
        description: "Rastrea cuánto ahorras con decisiones inteligentes",
        href: "/savings",
    },
]

const mainFeatures = [
    {
        id: "ai-assistant",
        title: "Chat con IA",
        icon: Bot,
        color: "text-[#8B4513]",
        bgColor: "bg-[#EFDBCD]",
        borderColor: "border-[#8B4513]/20",
        features: ["Respuestas instantáneas", "Recomendaciones", "Aprende de ti"],
        description: "Chat inteligente para dudas culinarias y recomendaciones",
        href: "/chat",
    },
    {
        id: "community",
        title: "Comunidad",
        icon: Users,
        color: "text-[#8B4513]",
        bgColor: "bg-[#EFDBCD]",
        borderColor: "border-[#8B4513]/20",
        features: ["Comparte recetas", "Tips de ahorro", "Intercambia menús"],
        description: "Conecta con otros usuarios y comparte experiencias",
        href: "/feed",
    },
]

const featuredProducts = [
    {
        id: 1,
        name: "Avena Quaker Original",
        brand: "Quaker",
        price: 45.9,
        originalPrice: 52.0,
        discount: 12,
        image: "/avena-quaker-cereal-box.jpg",
        store: "Soriana",
        category: "Cereales",
        sponsored: true,
    },
    {
        id: 2,
        name: "Pechuga de Pollo Bachoco",
        brand: "Bachoco",
        price: 89.5,
        originalPrice: 95.0,
        discount: 6,
        image: "/pechuga-pollo-empaque.jpg",
        store: "Walmart",
        category: "Carnes",
        sponsored: true,
    },
    {
        id: 3,
        name: "Aceite de Oliva Capullo",
        brand: "Capullo",
        price: 78.9,
        originalPrice: 85.0,
        discount: 7,
        image: "/aceite-oliva-botella.jpg",
        store: "Chedraui",
        category: "Aceites",
        sponsored: true,
    },
    {
        id: 4,
        name: "Yogurt Griego Danone",
        brand: "Danone",
        price: 32.5,
        originalPrice: 38.0,
        discount: 14,
        image: "/yogurt-griego-danone.jpg",
        store: "Soriana",
        category: "Lácteos",
        sponsored: true,
    },
]

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#faf9f7]">
            {/* Header */}
            <header className="border-b border-[#8B4513]/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-[#8B4513] rounded-lg">
                                <Utensils className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[#8B4513] text-balance">NutriSave</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="text-[#8B4513] hover:bg-[#8B4513]/10">
                                <Bell className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[#8B4513] hover:bg-[#8B4513]/10">
                                <Settings className="w-4 h-4" />
                            </Button>
                            <Badge variant="secondary" className="hidden sm:flex bg-[#EFDBCD] text-[#8B4513] border-[#8B4513]/20">
                                Actualizado hoy
                            </Badge>
                            <Avatar>
                                <AvatarImage src="/user-avatar.jpg" alt="Usuario" />
                                <AvatarFallback className="bg-[#8B4513] text-white">U</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </header>

            {/* Welcome Section */}
            <section className="py-8 px-4">
                <div className="container mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-[#8B4513] text-balance mb-2">¡Bienvenido de vuelta!</h2>
                        <p className="text-lg text-[#8B4513]/80">
                            Aquí tienes un resumen de tus ahorros y actividades recientes
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-[#8B4513]/70">Ahorro este mes</p>
                                        <p className="text-2xl font-bold text-[#8B4513]">$234.50</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-[#8B4513]" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-[#8B4513]/70">Productos en despensa</p>
                                        <p className="text-2xl font-bold text-[#8B4513]">47</p>
                                    </div>
                                    <Package className="w-8 h-8 text-[#8B4513]" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-[#8B4513]/70">Ofertas disponibles</p>
                                        <p className="text-2xl font-bold text-[#8B4513]">12</p>
                                    </div>
                                    <Sparkles className="w-8 h-8 text-[#8B4513]" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-[#8B4513]/70">Próximos a vencer</p>
                                        <p className="text-2xl font-bold text-[#A0522D]">3</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-[#A0522D]" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Main Features */}
            <section className="py-8 px-4 bg-[#faf9f7]">
                <div className="container mx-auto">
                    <h3 className="text-3xl font-bold text-center text-[#8B4513] text-balance mb-12">Funcionalidades Principales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                        {mainFeatures.map((feature) => {
                            const IconComponent = feature.icon
                            return (
                                <Card
                                    key={feature.id}
                                    className={`group hover:-translate-y-1 transition-all duration-300 cursor-pointer ${feature.borderColor} ${feature.bgColor} border-2`}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`p-3 rounded-lg bg-white ${feature.color}`}>
                                                <IconComponent className="w-8 h-8" />
                                            </div>
                                            <Badge variant="outline" className="text-xs bg-[#8B4513] text-white border-[#8B4513]">
                                                Principal
                                            </Badge>
                                        </div>
                                        <CardTitle className={`text-2xl group-hover:text-[#A0522D] transition-colors text-[#8B4513]`}>
                                            {feature.title}
                                        </CardTitle>
                                        <CardDescription className="text-base text-[#8B4513]/80">{feature.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 mb-6">
                                            {feature.features.map((item, index) => (
                                                <li key={index} className="flex items-center text-sm text-[#8B4513]/80">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B4513] mr-2" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href={feature.href}>
                                            <Button className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-white" size="lg">
                                                Comenzar Ahora
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}