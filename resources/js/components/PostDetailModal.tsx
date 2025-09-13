import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Heart, MessageCircle, Share2, User, Send, X } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    profile_image?: string;
}

interface Comment {
    id: number;
    comment: string;
    created_at: string;
    user: User;
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
    comments?: Comment[];
}

interface PostDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: number | null;
}

export default function PostDetailModal({ isOpen, onClose, postId }: PostDetailModalProps) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchPostDetail = async () => {
            if (!postId) return;

            setLoading(true);
            try {
                const response = await axios.get(`/api/posts/${postId}`);
                if (response.data.success) {
                    setPost(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching post details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && postId) {
            fetchPostDetail();
        }
    }, [isOpen, postId]);

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

    const handleLike = async () => {
        if (!post) return;

        try {
            const response = await axios.post('/api/likes', { post_id: post.id });
            setIsLiked(response.data.data.liked);
            setPost(prev => prev ? {
                ...prev,
                likes_count: response.data.data.likes_count
            } : null);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleShare = async () => {
        if (!post) return;

        try {
            await axios.post('/api/shares', { post_id: post.id });
            setPost(prev => prev ? {
                ...prev,
                shares_count: prev.shares_count + 1
            } : null);
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post || !commentText.trim()) return;

        setSubmittingComment(true);
        try {
            const response = await axios.post('/comments', {
                post_id: post.id,
                comment: commentText
            }, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (response.data.success) {
                const newComment = response.data.data;
                setPost(prev => prev ? {
                    ...prev,
                    comments: [...(prev.comments || []), newComment],
                    comments_count: prev.comments_count + 1
                } : null);
                setCommentText('');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const getTags = (tags: string | undefined) => {
        if (!tags) return [];
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-y-auto bg-[#faf9f7] border-[#8B4513]/20">
                <DialogHeader className="border-b border-[#8B4513]/20 pb-4 relative">
                    <DialogTitle className="text-[#8B4513] text-2xl font-bold pr-8">
                        Detalles del Post
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="absolute top-0 right-0 text-[#8B4513] hover:text-[#A0522D] hover:bg-[#8B4513]/10"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B4513]"></div>
                    </div>
                ) : post ? (
                    <div className="space-y-6 p-2">
                        {/* Post Content */}
                        <Card className="bg-white border-[#8B4513]/20">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-[#8B4513]/10 rounded-full flex items-center justify-center">
                                            {post.user.profile_image ? (
                                                <img
                                                    src={post.user.profile_image}
                                                    alt={post.user.name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-8 h-8 text-[#8B4513]" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#8B4513] text-lg">{post.user.name}</p>
                                            <p className="text-sm text-[#8B4513]/70">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className={getCategoryColor(post.category)}>
                                        {post.category}
                                    </Badge>
                                </div>
                                <CardTitle className="text-3xl mt-6 text-[#8B4513] leading-tight">{post.title}</CardTitle>
                            </CardHeader>

                            <CardContent className="px-6">
                                <div className="prose max-w-none mb-8">
                                    <p className="text-[#8B4513]/80 whitespace-pre-wrap text-lg leading-relaxed">{post.content}</p>
                                </div>

                                {/* Display image if exists */}
                                {post.image && (
                                    <div className="mb-8 post-image-container rounded-lg overflow-hidden max-w-2xl mx-auto">
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

                                {getTags(post.tags).length > 0 && (
                                    <div className="flex flex-wrap gap-3">
                                        {getTags(post.tags).map((tag, index) => (
                                            <Badge key={index} variant="outline" className="text-sm border-[#8B4513]/20 text-[#8B4513] px-3 py-1">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex items-center justify-between pt-6 border-t border-[#8B4513]/20 px-6">
                                <div className="flex items-center space-x-8">
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        onClick={handleLike}
                                        className={`flex items-center space-x-3 px-4 py-2 ${isLiked ? 'text-red-600' : 'text-[#8B4513]/70 hover:text-red-600 hover:bg-red-50'
                                            }`}
                                    >
                                        <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                                        <span className="text-lg font-medium">{post.likes_count}</span>
                                    </Button>

                                    <div className="flex items-center space-x-3 text-[#8B4513]/70 px-4 py-2">
                                        <MessageCircle className="w-6 h-6" />
                                        <span className="text-lg font-medium">{post.comments_count}</span>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        onClick={handleShare}
                                        className="flex items-center space-x-3 px-4 py-2 text-[#8B4513]/70 hover:text-green-600 hover:bg-green-50"
                                    >
                                        <Share2 className="w-6 h-6" />
                                        <span className="text-lg font-medium">{post.shares_count}</span>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>

                        {/* Comments Section */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-[#8B4513]">
                                Comentarios ({post.comments_count})
                            </h3>

                            {/* Add Comment Form */}
                            <Card className="bg-white border-[#8B4513]/20">
                                <CardContent className="pt-6 px-6">
                                    <form onSubmit={handleCommentSubmit} className="space-y-6">
                                        <textarea
                                            placeholder="Escribe un comentario..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            className="min-h-[120px] w-full rounded-md border border-[#8B4513]/20 px-4 py-3 text-base text-[#8B4513] placeholder:text-[#8B4513]/60 focus:border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                                            required
                                        />
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={submittingComment || !commentText.trim()} className="bg-[#8B4513] hover:bg-[#A0522D] text-white px-6 py-2 text-base">
                                                {submittingComment ? (
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                ) : (
                                                    <Send className="w-5 h-5 mr-2" />
                                                )}
                                                Comentar
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Comments List */}
                            <div className="space-y-4 max-h-80 overflow-y-auto">
                                {post.comments && post.comments.length > 0 ? (
                                    post.comments.map((comment) => (
                                        <Card key={comment.id} className="bg-white border-[#8B4513]/20">
                                            <CardContent className="pt-6 px-6">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-12 h-12 bg-[#8B4513]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                        {comment.user.profile_image ? (
                                                            <img
                                                                src={comment.user.profile_image}
                                                                alt={comment.user.name}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <User className="w-6 h-6 text-[#8B4513]" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <span className="font-semibold text-[#8B4513] text-base">
                                                                {comment.user.name}
                                                            </span>
                                                            <span className="text-sm text-[#8B4513]/70">
                                                                {new Date(comment.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-[#8B4513]/80 text-base leading-relaxed">{comment.comment}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-[#8B4513]/70">
                                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[#8B4513]/30" />
                                        <p className="text-lg">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-[#8B4513]/70">
                        <p>Error al cargar los detalles del post.</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
