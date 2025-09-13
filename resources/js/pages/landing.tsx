import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import {
    Bot,
    Users,
    Package,
    ShoppingCart,
    TrendingDown,
    Zap,
    ArrowRight,
    TrendingUp,
    Sparkles
} from "lucide-react";

const features = [
    {
        icon: Bot,
        title: "Chat IA Personalizado",
        description: "Asistente inteligente que conoce tus restricciones dietéticas, alergias y preferencias para darte consejos personalizados.",
        gradient: "from-[#8B4513] to-[#A0522D]"
    },
    {
        icon: Users,
        title: "Comunidad Vibrante",
        description: "Conecta con otros usuarios, comparte recetas, tips de ahorro y encuentra inspiración para una alimentación saludable.",
        gradient: "from-[#8B4513] to-[#A0522D]"
    },
    {
        icon: Package,
        title: "Gestión de Despensa",
        description: "Controla tu inventario, recibe alertas de vencimiento y obtén sugerencias para aprovechar al máximo tus ingredientes.",
        gradient: "from-[#8B4513] to-[#A0522D]"
    },
    {
        icon: ShoppingCart,
        title: "Listas Inteligentes",
        description: "Genera listas de compras automáticas basadas en tus menús planificados y productos favoritos.",
        gradient: "from-[#8B4513] to-[#A0522D]"
    },
    {
        icon: TrendingDown,
        title: "Monitor de Ahorros",
        description: "Rastrea tus gastos en alimentación, encuentra las mejores ofertas y optimiza tu presupuesto mensual.",
        gradient: "from-[#8B4513] to-[#A0522D]"
    },
    {
        icon: Zap,
        title: "Ofertas en Tiempo Real",
        description: "Descubre descuentos exclusivos en supermercados cercanos y recibe notificaciones de ofertas personalizadas.",
        gradient: "from-[#8B4513] to-[#A0522D]"
    }
];

// Mock data para productos destacados
const featuredProducts = [
    {
        id: 1,
        name: "Pollo Entero Fresco",
        brand: "Sadia",
        store: "Walmart",
        category: "Carnes",
        price: 45.99,
        originalPrice: 65.99,
        discount: 30,
        image: "/images/pechuga-pollo-empaque.jpg",
        sponsored: false
    },
    {
        id: 2,
        name: "Arroz Integral 1kg",
        brand: "Morena",
        store: "Soriana",
        category: "Granos",
        price: 12.50,
        originalPrice: 18.00,
        discount: 31,
        image: "/images/arroz-blanco-empaque.jpg",
        sponsored: true
    },
    {
        id: 3,
        name: "Leche Deslactosada 1L",
        brand: "Lala",
        store: "Chedraui",
        category: "Lácteos",
        price: 22.99,
        originalPrice: 28.99,
        discount: 21,
        image: "/images/leche-lala-carton.jpg",
        sponsored: false
    },
    {
        id: 4,
        name: "Aceite de Oliva Extra Virgen",
        brand: "Bertolli",
        store: "Walmart",
        category: "Aceites",
        price: 89.99,
        originalPrice: 120.00,
        discount: 25,
        image: "/images/aceite-oliva-botella.jpg",
        sponsored: true
    }
];

// Mock data para pasos de cómo funciona
const howItWorksSteps = [
    {
        icon: Users,
        title: "Regístrate Gratis",
        description: "Crea tu cuenta en segundos y personaliza tu perfil con tus preferencias alimentarias y restricciones dietéticas."
    },
    {
        icon: ShoppingCart,
        title: "Explora Ofertas",
        description: "Descubre las mejores ofertas en supermercados cercanos y recibe notificaciones personalizadas de descuentos."
    },
    {
        icon: TrendingDown,
        title: "Ahorra Dinero",
        description: "Planifica tus compras, optimiza tu presupuesto y ahorra hasta un 40% en tus gastos de alimentación."
    }
];

const FeaturesSection = () => {
    return (
        <section className="py-16 px-6 bg-[#fef8eb]">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-4">
                        Todo lo que necesitas en una{" "}
                        <span className="text-[#A0522D]">
                            sola plataforma
                        </span>
                    </h2>
                    <p className="text-lg text-[#8B4513] max-w-2xl mx-auto">
                        Descubre cómo NutriSave puede transformar tu relación con la alimentación
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-[#EFDBCD] rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                        >
                            <div className="pb-4">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} p-3 mb-4 shadow-lg`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#A0522D] transition-colors text-[#8B4513]">
                                    {feature.title}
                                </h3>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-4">
                                    {feature.description}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default function Landing() {
    const page = usePage();
    const { auth } = page.props as any;
    const getInitials = useInitials();

    return (
        <>
            <Head title="NutriSave - Tu Coach de Nutrición IA" />

            <div className="min-h-screen bg-[#fef8eb]">
                {/* Header */}
                <header className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/">
                                <span className="text-2xl font-bold text-[#8B4513]">Nutrisave</span>
                            </Link>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="#" className="text-[#8B4513] hover:text-[#A0522D] transition-colors">
                                Inicio
                            </Link>
                            <Link href="#" className="text-[#8B4513] hover:text-[#A0522D] transition-colors">
                                Servicios
                            </Link>
                            <Link href="#" className="text-[#8B4513] hover:text-[#A0522D] transition-colors">
                                Precios
                            </Link>
                            <Link href="#" className="text-[#8B4513] hover:text-[#A0522D] transition-colors">
                                Acerca de
                            </Link>
                        </nav>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <>
                                    <Link href="/feed">
                                        <Button
                                            variant="outline"
                                            className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white bg-[#f5f5dc]"
                                        >
                                            Feed
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard">
                                        <Button
                                            variant="outline"
                                            className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white bg-[#f5f5dc]"
                                        >
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="size-10 rounded-full p-1 hover:bg-[#8B4513]/10">
                                                <Avatar className="size-8 overflow-hidden rounded-full">
                                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                    <AvatarFallback className="rounded-lg bg-[#8B4513] text-white">
                                                        {getInitials(auth.user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 bg-[#faf9f7] border-[#8B4513]/40 shadow-xl backdrop-blur-sm" align="end">
                                            <UserMenuContent user={auth.user} />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button
                                            variant="outline"
                                            className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white bg-[#f5f5dc]"
                                        >
                                            Iniciar Sesión
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="bg-[#8B4513] hover:bg-[#A0522D] text-white">
                                            Registrarse
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto text-center max-w-4xl">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-primary-gradient bg-clip-text text-transparent bg-[#DA5B20]">
                            Tu Coach de Nutrición IA para Planificación de Comidas Personalizada.
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            NutriSave utiliza IA avanzada para crear planes de comidas personalizados que se
                            adaptan a tus objetivos de salud, necesidades dietéticas y presupuesto. Come más
                            inteligente, saludable y económico.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="shadow-warm hover:shadow-glow transition-all bg-[#DA5B20] text-white">
                                Comenzar Gratis
                            </Button>
                            <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5">
                                Comunidad
                            </Button>
                        </div>
                    </div>
                </section>
                {/* Content Blocks Section */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Placeholder */}
                        <div className="bg-[#FFEEDC] border-2 border-orange-200 rounded-2xl h-56 lg:min-h-[416px] flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-gray-300 rounded-xl flex items-center justify-center transform -rotate-2 translate-x-14 translate-y-10">
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl flex items-center justify-center">
                                    <img src="/images/uno.png" alt="Imagen" className="w-full h-full object-fit" />
                                </div>
                            </div>
                        </div>

                        {/* Right Placeholders */}
                        <div className="space-y-8">
                            {/* Top Right Placeholder */}
                            <div className="bg-[#F1E8FE] border-2 border-purple-200 rounded-2xl h-48 lg:h-48 flex items-center justify-center overflow-hidden">
                                <div className="w-[80%] h-[80%] bg-gray-300 rounded-xl flex items-center justify-center mx-auto translate-y-5">
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl flex items-center justify-center">
                                        <img src="/images/dos.png" alt="Imagen" className="w-full h-full object-fit" />
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Right Placeholder */}
                            <div className="bg-[#FFE6E6] border-2 border-pink-200 rounded-2xl h-48 lg:h-48 flex items-center justify-center overflow-hidden">
                                <div className="w-[90%] h-[80%] bg-gray-300 rounded-xl flex items-center justify-center transform rotate-2 translate-y-6">
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl flex items-center justify-center">
                                        <img src="/images/tres.png" alt="Imagen" className="w-full h-full object-fit" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Brand Is Featured On Section */}
                <section className="py-16 px-6 bg-[#faf9f7]">
                    <div className="container mx-auto text-center max-w-4xl">
                        <h2 className="text-2xl font-semibold text-[#8B4513] mb-8">
                            Nuestras Marcas Destacadas
                        </h2>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-[#8B4513] rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">S</span>
                                </div>
                                <span className="text-[#8B4513] font-bold">Soriana</span>
                            </div>
                            <div className="text-[#8B4513] font-bold">Walmart</div>
                            <div className="text-[#8B4513] font-bold">Chedraui</div>
                            <div className="text-[#8B4513] font-bold">Danone</div>
                            <div className="flex items-center space-x-2">
                                <span className="text-[#8B4513] font-bold">Calimax</span>

                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <FeaturesSection />

                {/* Featured Products */}
                <section className="py-20 px-4 bg-white/30 backdrop-blur-sm">
                    <div className="container mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-primary mb-4">Ofertas Destacadas</h2>
                            <p className="text-lg text-muted-foreground">
                                Productos seleccionados con los mejores precios y descuentos exclusivos
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product, index) => (
                                <div
                                    key={index}
                                    className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:shadow-glow transition-all group"
                                >
                                    <div className="bg-gradient-to-br from-muted/20 to-muted/40 h-48 flex items-center justify-center relative">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center" />
                                        <div className="absolute top-4 left-4 bg-destructive text-white px-2 py-1 rounded-lg text-sm font-medium">
                                            -{product.discount}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="text-sm text-muted-foreground mb-2">{product.category}</div>
                                        <h3 className="font-semibold text-foreground mb-3">{product.name}</h3>

                                        <div className="flex items-center space-x-2 mb-4">
                                            <span className="text-2xl font-bold text-[#DA5B20]">{product.price}</span>
                                            <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                                        </div>

                                        <Button className="w-full bg-[#DA5B20] hover:shadow-warm transition-all">
                                            Agregar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-muted-foreground mb-6">Regístrate para acceder a todas las ofertas y funcionalidades</p>
                            <Button size="lg" className="bg-[#DA5B20] shadow-warm hover:shadow-glow transition-all">
                                Ver Todas las Ofertas
                            </Button>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-16 px-4 bg-[#EFDBCD]">
                    <div className="container mx-auto max-w-4xl">
                        <h3 className="text-3xl font-bold text-center text-balance mb-12 text-[#8B4513]">Cómo Funciona NutriSave</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {howItWorksSteps.map((step, index) => {
                                const IconComponent = step.icon
                                return (
                                    <div key={index} className="text-center">
                                        <div className="flex items-center justify-center w-16 h-16 bg-[#8B4513] rounded-full mx-auto mb-4">
                                            <IconComponent className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex items-center justify-center w-8 h-8 bg-[#8B4513]/10 rounded-full mx-auto mb-4 text-[#8B4513] font-bold">
                                            {index + 1}
                                        </div>
                                        <h4 className="text-xl font-semibold mb-2 text-[#8B4513]">{step.title}</h4>
                                        <p className="text-[#8B4513]/70 text-pretty">{step.description}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Business Section */}
                <section className="py-16 px-4 bg-gradient-to-r from-[#8B4513]/5 to-[#A0522D]/5 border-y border-[#8B4513]/20">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold text-balance mb-6 text-[#8B4513]">¿Eres un Supermercado o Marca?</h3>
                            <p className="text-xl text-[#8B4513]/70 text-pretty mb-8 max-w-3xl mx-auto">
                                Conecta directamente con clientes que buscan tus productos. Promociona ofertas, obtén insights valiosos
                                sobre tendencias de consumo y aumenta tus ventas con nuestra plataforma B2B.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center">
                                <div className="flex items-center justify-center w-16 h-16 bg-[#8B4513] rounded-full mx-auto mb-4">
                                    <TrendingUp className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold mb-2 text-[#8B4513]">Aumenta Ventas</h4>
                                <p className="text-[#8B4513]/70">Promociona productos directamente a usuarios interesados</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center w-16 h-16 bg-[#8B4513] rounded-full mx-auto mb-4">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold mb-2 text-[#8B4513]">Conecta con Clientes</h4>
                                <p className="text-[#8B4513]/70">Accede a una base de usuarios activos y comprometidos</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center w-16 h-16 bg-[#8B4513] rounded-full mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold mb-2 text-[#8B4513]">Insights Valiosos</h4>
                                <p className="text-[#8B4513]/70">Obtén datos sobre tendencias y preferencias de consumo</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/business">
                                <Button size="lg" className="text-lg px-8 bg-[#8B4513] hover:bg-[#A0522D] text-white">
                                    Panel Empresarial
                                    <TrendingUp className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Button variant="outline" onClick={() => window.location.href = 'mailto:ventas@nutrisave.com'} size="lg" className="text-lg px-8 bg-transparent border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10">
                                Contactar Ventas
                            </Button>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 bg-[#faf9f7]">
                    <div className="container mx-auto text-center max-w-4xl">
                        <h3 className="text-4xl font-bold text-balance mb-6 text-[#8B4513]">Comienza a Ahorrar Hoy</h3>
                        <p className="text-xl text-[#8B4513]/70 text-pretty mb-8">
                            Únete a miles de usuarios que ya están ahorrando tiempo y dinero con NutriSave
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="text-lg px-8 bg-[#8B4513] hover:bg-[#A0522D] text-white">
                                    Crear Cuenta Gratis
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10">
                                    Ya tengo cuenta
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#8B4513] text-white py-16 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Brand Section */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                        <span className="text-[#8B4513] font-bold text-sm">N</span>
                                    </div>
                                    <span className="text-2xl font-bold">NutriSave</span>
                                </div>
                                <p className="text-gray-300 mb-6 max-w-md">
                                    Tu coach de nutrición inteligente que utiliza IA avanzada para crear planes de comidas personalizados que se adaptan a tus objetivos de salud, necesidades dietéticas y presupuesto.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                                        <span className="text-sm">f</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                                        <span className="text-sm">t</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                                        <span className="text-sm">in</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                                        <span className="text-sm">ig</span>
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                            Inicio
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                            Servicios
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                            Precios
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                            Sobre Nosotros
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                            Contacto
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Soporte</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                            Centro de Ayuda
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                            Preguntas Frecuentes
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                            Política de Privacidad
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                            Términos de Servicio
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                            Cookies
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="border-t border-white/20 mt-12 pt-8">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <p className="text-gray-300 text-sm mb-4 md:mb-0">
                                    © 2025 NutriSave. Todos los derechos reservados.
                                </p>
                                <div className="flex items-center space-x-6 text-sm text-gray-300">
                                    <span>Hecho con ❤️ para tu salud</span>
                                    <div className="flex items-center space-x-2">
                                        <span>🌱</span>
                                        <span>100% Natural</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
