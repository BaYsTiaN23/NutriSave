import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, User, ArrowLeft, Plus, Clock, Search, TrendingUp } from 'lucide-react';
import axios from 'axios';
import PostDetailModal from '@/components/PostDetailModal';
import CreatePostModal from '@/components/CreatePostModal';

interface User {
    id: number;
    name: string;
    email: string;
    profile_image?: string;
}

interface Post {
    id: number;
    title: string;
    category: 'Recipes' | 'Organizations' | 'Offers' | 'Weekly Menu';
    content: string;
    tags?: string;
    image?: string;
    created_at: string;
    user: User;
    likes_count: number;
    comments_count: number;
    shares_count: number;
}

interface FeedProps {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
    };
}

export default function Feed({ posts: initialPosts }: FeedProps) {
    const { auth } = usePage().props as any;
    const [posts, setPosts] = useState(initialPosts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Recipes':
                return 'bg-[#EFDBCD] text-[#8B4513] border-[#8B4513]/20';
            case 'Organizations':
                return 'bg-[#EFDBCD] text-[#8B4513] border-[#8B4513]/20';
            case 'Offers':
                return 'bg-[#EFDBCD] text-[#8B4513] border-[#8B4513]/20';
            case 'Weekly Menu':
                return 'bg-[#EFDBCD] text-[#8B4513] border-[#8B4513]/20';
            default:
                return 'bg-[#EFDBCD] text-[#8B4513] border-[#8B4513]/20';
        }
    };

    const categories = ["Todos", "Recipes", "Organizations", "Offers", "Weekly Menu"];

    const filteredPosts = posts.data.filter((post) => {
        const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleBackClick = () => {
        if (auth.user) {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/';
        }
    };

    const handleLike = async (postId: number) => {
        try {
            await axios.post('/api/likes', { post_id: postId });
            // Refresh posts to get updated like count
            const response = await axios.get('/api/posts');
            setPosts(response.data.data);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleShare = async (postId: number) => {
        try {
            await axios.post('/api/shares', { post_id: postId });
            // Refresh posts to get updated share count
            const response = await axios.get('/api/posts');
            setPosts(response.data.data);
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    const getTags = (tags: string | undefined) => {
        if (!tags) return [];
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    };

    const truncateContent = (content: string, maxLength: number = 200) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const openPostModal = (postId: number) => {
        setSelectedPostId(postId);
        setIsModalOpen(true);
    };

    const closePostModal = () => {
        setIsModalOpen(false);
        setSelectedPostId(null);
    };

    return (
        <>
            <Head title="Feed" />

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
                                    <User className="w-6 h-6 text-[#8B4513]" />
                                    <h1 className="text-xl font-bold text-[#8B4513]">Feed NutriSave</h1>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="bg-[#8B4513] hover:bg-[#A0522D] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Crear Post
                                </Button>
                                <Link
                                    href="/profile"
                                    className="text-[#8B4513] hover:text-[#A0522D] px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Perfil
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-[#8B4513]">{posts.data.length}</div>
                                <div className="text-sm text-[#8B4513]/70">Posts Totales</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-[#8B4513]">
                                    {posts.data.reduce((sum, post) => sum + post.likes_count, 0)}
                                </div>
                                <div className="text-sm text-[#8B4513]/70">Likes Totales</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-[#8B4513]">
                                    {posts.data.reduce((sum, post) => sum + post.comments_count, 0)}
                                </div>
                                <div className="text-sm text-[#8B4513]/70">Comentarios</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#EFDBCD] border-[#8B4513]/20">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-[#8B4513]">
                                    {posts.data.reduce((sum, post) => sum + post.shares_count, 0)}
                                </div>
                                <div className="text-sm text-[#8B4513]/70">Compartidos</div>
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
                                        <label className="text-sm font-medium text-[#8B4513]">Buscar</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]/50 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Buscar posts..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-3 py-2 border border-[#8B4513]/20 rounded-md focus:border-[#8B4513] text-[#8B4513] placeholder:text-[#8B4513]/60 bg-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#8B4513]">Categoría</label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full p-2 border border-[#8B4513]/20 rounded-md focus:border-[#8B4513] text-[#8B4513] bg-white"
                                        >
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
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
                                            <span className="text-sm text-[#8B4513]">#recetas</span>
                                            <Badge variant="secondary" className="text-xs bg-[#8B4513] text-white">
                                                {posts.data.filter(p => p.category === 'Recipes').length} posts
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[#8B4513]">#ofertas</span>
                                            <Badge variant="secondary" className="text-xs bg-[#8B4513] text-white">
                                                {posts.data.filter(p => p.category === 'Offers').length} posts
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[#8B4513]">#organizaciones</span>
                                            <Badge variant="secondary" className="text-xs bg-[#8B4513] text-white">
                                                {posts.data.filter(p => p.category === 'Organizations').length} posts
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[#8B4513]">#menus</span>
                                            <Badge variant="secondary" className="text-xs bg-[#8B4513] text-white">
                                                {posts.data.filter(p => p.category === 'Weekly Menu').length} posts
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
                                                        <AvatarImage src={post.user.profile_image || "/placeholder.svg"} alt={post.user.name} />
                                                        <AvatarFallback className="bg-[#8B4513] text-white">{post.user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-semibold text-sm text-[#8B4513]">{post.user.name}</h4>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-[#8B4513]/70">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(post.created_at).toLocaleDateString()}
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
                                            <p className="text-[#8B4513]/80 mb-4 text-pretty">
                                                {truncateContent(post.content)}
                                            </p>

                                            {/* Display image if exists */}
                                            {post.image && (
                                                <div className="post-image-container mb-4 rounded-lg overflow-hidden max-w-md mx-auto">
                                                    <div className="relative w-full aspect-[4/3] bg-gray-100">
                                                        <img
                                                            src={post.image}
                                                            alt={post.title}
                                                            className="post-image absolute inset-0 w-full h-full object-contain object-center transition-transform duration-300 hover:scale-105"
                                                            loading="lazy"
                                                            decoding="async"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                            onLoad={(e) => {
                                                                e.currentTarget.style.opacity = '1';
                                                            }}
                                                            style={{
                                                                opacity: 0,
                                                                transition: 'opacity 0.3s ease'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Tags */}
                                            {getTags(post.tags).length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {getTags(post.tags).map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs border-[#8B4513]/20 text-[#8B4513]">
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Acciones */}
                                            <div className="flex items-center justify-between pt-4 border-t border-[#8B4513]/20">
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleLike(post.id)}
                                                        className="text-[#8B4513]/70 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    >
                                                        <Heart className="w-4 h-4 mr-1" />
                                                        {post.likes_count}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedPostId(post.id);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="flex items-center gap-1 text-[#8B4513]/70 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md transition-colors"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        {post.comments_count}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleShare(post.id)}
                                                        className="text-[#8B4513]/70 hover:bg-green-50 hover:text-green-600 transition-colors"
                                                    >
                                                        <Share2 className="w-4 h-4 mr-1" />
                                                        {post.shares_count}
                                                    </Button>
                                                </div>

                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {filteredPosts.length === 0 && (
                                <div className="text-center py-12">
                                    <User className="w-16 h-16 text-[#8B4513]/50 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2 text-[#8B4513]">No se encontraron publicaciones</h3>
                                    <p className="text-[#8B4513]/70 mb-4">
                                        Intenta cambiar los filtros o sé el primero en compartir algo
                                    </p>
                                    <Button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="bg-[#8B4513] hover:bg-[#A0522D] text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Crear Primera Publicación
                                    </Button>
                                </div>
                            )}

                            {/* Pagination */}
                            {posts.last_page > 1 && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex space-x-2">
                                        {Array.from({ length: posts.last_page }, (_, i) => i + 1).map((page) => (
                                            <Link
                                                key={page}
                                                href={`/feed?page=${page}`}
                                                className={`px-4 py-2 rounded-md ${page === posts.current_page
                                                    ? 'bg-[#8B4513] text-white'
                                                    : 'bg-white text-[#8B4513] hover:bg-[#8B4513]/10 border border-[#8B4513]/20'
                                                    }`}
                                            >
                                                {page}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Detail Modal */}
            <PostDetailModal
                isOpen={isModalOpen}
                onClose={closePostModal}
                postId={selectedPostId}
            />

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    );
}
