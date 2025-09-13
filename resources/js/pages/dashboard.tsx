import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
    X,
    CheckCircle,
    AlertCircle,
    Info,
} from "lucide-react"
import { Link } from "@inertiajs/react"
import { useState } from "react"

// Datos estáticos para notificaciones
const staticNotifications = [
    {
        id: 1,
        type: "success",
        title: "¡Bienvenido a NutriSave!",
        message: "Tu cuenta ha sido creada exitosamente. Comienza explorando las funcionalidades.",
        time: "Hace 2 horas",
        read: false,
    },
    {
        id: 2,
        type: "info",
        title: "Nueva receta disponible",
        message: "Se ha agregado una nueva receta de ensalada mediterránea a tu feed.",
        time: "Hace 5 horas",
        read: false,
    },
    {
        id: 3,
        type: "warning",
        title: "Producto próximo a vencer",
        message: "Tu leche vence en 2 días. Considera usarla en una receta.",
        time: "Ayer",
        read: true,
    },
    {
        id: 4,
        type: "success",
        title: "Ahorro registrado",
        message: "Has ahorrado $15.50 esta semana comparado con la semana pasada.",
        time: "Hace 3 días",
        read: true,
    },
];

// Datos estáticos para configuración
const staticSettings = {
    profile: {
        name: "Usuario Demo",
        email: "usuario@nutrisave.com",
        avatar: "/user-avatar.jpg",
    },
    preferences: {
        notifications: true,
        emailUpdates: true,
        darkMode: false,
        language: "Español",
    },
    stats: {
        postsCreated: 12,
        moneySaved: 156.75,
        recipesShared: 8,
        daysActive: 45,
    },
};

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
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [notifications, setNotifications] = useState(staticNotifications);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case "warning":
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            case "info":
                return <Info className="w-5 h-5 text-blue-600" />;
            default:
                return <Bell className="w-5 h-5 text-[#8B4513]" />;
        }
    };

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const unreadCount = notifications.filter(n => !n.read).length;

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
                                <Link href="/">
                                    <h1 className="text-xl font-bold text-[#8B4513] text-balance">NutriSave</h1>
                                </Link>

                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div
                                className="relative flex items-center justify-center w-10 h-10 bg-[#EFDBCD] hover:bg-[#8B4513]/10 rounded-lg transition-colors cursor-pointer"
                                onClick={() => setIsNotificationsOpen(true)}
                            >
                                <Bell className="w-4 h-4 text-[#8B4513]" />
                                {unreadCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </div>
                            <div
                                className="flex items-center justify-center w-10 h-10 bg-[#EFDBCD] hover:bg-[#8B4513]/10 rounded-lg transition-colors cursor-pointer"
                                onClick={() => setIsSettingsOpen(true)}
                            >
                                <Settings className="w-4 h-4 text-[#8B4513]" />
                            </div>
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

            {/* Modal de Notificaciones */}
            <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <DialogContent className="max-w-2xl w-[95vw] max-h-[80vh] overflow-y-auto bg-[#faf9f7] border-[#8B4513]/20">
                    <DialogHeader className="border-b border-[#8B4513]/20 pb-4 relative">
                        <DialogTitle className="text-[#8B4513] text-2xl font-bold pr-8">
                            Notificaciones
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsNotificationsOpen(false)}
                            className="absolute top-0 right-0 text-[#8B4513] hover:text-[#A0522D] hover:bg-[#8B4513]/10"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </DialogHeader>

                    <div className="space-y-4 p-2">
                        {notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${notification.read
                                    ? 'bg-white border-[#8B4513]/10'
                                    : 'bg-[#EFDBCD]/30 border-[#8B4513]/30'
                                    }`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        {getNotificationIcon(notification.type)}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className={`font-semibold ${notification.read ? 'text-[#8B4513]/70' : 'text-[#8B4513]'}`}>
                                                    {notification.title}
                                                </h4>
                                                <span className="text-xs text-[#8B4513]/60">{notification.time}</span>
                                            </div>
                                            <p className={`text-sm mt-1 ${notification.read ? 'text-[#8B4513]/60' : 'text-[#8B4513]/80'}`}>
                                                {notification.message}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-[#8B4513] rounded-full flex-shrink-0 mt-2"></div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal de Configuración */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent className="max-w-2xl w-[95vw] max-h-[80vh] overflow-y-auto bg-[#faf9f7] border-[#8B4513]/20">
                    <DialogHeader className="border-b border-[#8B4513]/20 pb-4 relative">
                        <DialogTitle className="text-[#8B4513] text-2xl font-bold pr-8">
                            Configuración
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute top-0 right-0 text-[#8B4513] hover:text-[#A0522D] hover:bg-[#8B4513]/10"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </DialogHeader>

                    <div className="space-y-6 p-2">
                        {/* Perfil */}
                        <Card className="bg-white border-[#8B4513]/20">
                            <CardHeader>
                                <CardTitle className="text-[#8B4513]">Perfil</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src={staticSettings.profile.avatar} alt={staticSettings.profile.name} />
                                        <AvatarFallback className="bg-[#8B4513] text-white text-lg">
                                            {staticSettings.profile.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#8B4513]">{staticSettings.profile.name}</h3>
                                        <p className="text-[#8B4513]/70">{staticSettings.profile.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Estadísticas */}
                        <Card className="bg-white border-[#8B4513]/20">
                            <CardHeader>
                                <CardTitle className="text-[#8B4513]">Estadísticas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-[#EFDBCD]/30 rounded-lg">
                                        <div className="text-2xl font-bold text-[#8B4513]">{staticSettings.stats.postsCreated}</div>
                                        <div className="text-sm text-[#8B4513]/70">Posts Creados</div>
                                    </div>
                                    <div className="text-center p-4 bg-[#EFDBCD]/30 rounded-lg">
                                        <div className="text-2xl font-bold text-[#8B4513]">${staticSettings.stats.moneySaved}</div>
                                        <div className="text-sm text-[#8B4513]/70">Dinero Ahorrado</div>
                                    </div>
                                    <div className="text-center p-4 bg-[#EFDBCD]/30 rounded-lg">
                                        <div className="text-2xl font-bold text-[#8B4513]">{staticSettings.stats.recipesShared}</div>
                                        <div className="text-sm text-[#8B4513]/70">Recetas Compartidas</div>
                                    </div>
                                    <div className="text-center p-4 bg-[#EFDBCD]/30 rounded-lg">
                                        <div className="text-2xl font-bold text-[#8B4513]">{staticSettings.stats.daysActive}</div>
                                        <div className="text-sm text-[#8B4513]/70">Días Activo</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preferencias */}
                        <Card className="bg-white border-[#8B4513]/20">
                            <CardHeader>
                                <CardTitle className="text-[#8B4513]">Preferencias</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#8B4513]">Notificaciones</span>
                                    <Badge className={staticSettings.preferences.notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                        {staticSettings.preferences.notifications ? 'Activadas' : 'Desactivadas'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#8B4513]">Actualizaciones por Email</span>
                                    <Badge className={staticSettings.preferences.emailUpdates ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                        {staticSettings.preferences.emailUpdates ? 'Activadas' : 'Desactivadas'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#8B4513]">Modo Oscuro</span>
                                    <Badge className={staticSettings.preferences.darkMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                        {staticSettings.preferences.darkMode ? 'Activado' : 'Desactivado'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#8B4513]">Idioma</span>
                                    <Badge className="bg-[#EFDBCD] text-[#8B4513]">
                                        {staticSettings.preferences.language}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}