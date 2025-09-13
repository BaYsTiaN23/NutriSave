import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, User } from 'lucide-react';
import axios from 'axios';
import PostDetailModal from '@/components/PostDetailModal';

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
    const [posts, setPosts] = useState(initialPosts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Recipes':
                return 'bg-green-100 text-green-800';
            case 'Organizations':
                return 'bg-blue-100 text-blue-800';
            case 'Offers':
                return 'bg-red-100 text-red-800';
            case 'Weekly Menu':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
            
            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-semibold text-gray-900">NutriSave</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/feed"
                                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Feed
                                </Link>
                                <Link
                                    href="/posts/create"
                                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Create Post
                                </Link>
                                <Link
                                    href="/profile"
                                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {posts.data.map((post) => (
                            <Card key={post.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                {post.user.profile_image ? (
                                                    <img
                                                        src={post.user.profile_image}
                                                        alt={post.user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-6 h-6 text-gray-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{post.user.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className={getCategoryColor(post.category)}>
                                            {post.category}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl">{post.title}</CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-gray-700 mb-4">
                                        {truncateContent(post.content)}
                                    </p>
                                    
                                    {/* Display image if exists */}
                                    {post.image && (
                                        <div className="mb-4">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                    
                                    {getTags(post.tags).length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {getTags(post.tags).map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex items-center space-x-6">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleLike(post.id)}
                                            className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
                                        >
                                            <Heart className="w-5 h-5" />
                                            <span>{post.likes_count}</span>
                                        </Button>

                                        <Link
                                            href={`/posts/${post.id}`}
                                            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            <span>{post.comments_count}</span>
                                        </Link>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleShare(post.id)}
                                            className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
                                        >
                                            <Share2 className="w-5 h-5" />
                                            <span>{post.shares_count}</span>
                                        </Button>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        onClick={() => openPostModal(post.id)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Read more →
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex space-x-2">
                                {Array.from({ length: posts.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/feed?page=${page}`}
                                        className={`px-4 py-2 rounded-md ${
                                            page === posts.current_page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
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

            {/* Post Detail Modal */}
            <PostDetailModal
                isOpen={isModalOpen}
                onClose={closePostModal}
                postId={selectedPostId}
            />
        </>
    );
}
