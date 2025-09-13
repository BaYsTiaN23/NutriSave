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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        Post Details
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : post ? (
                    <div className="space-y-6">
                        {/* Post Content */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            {post.user.profile_image ? (
                                                <img
                                                    src={post.user.profile_image}
                                                    alt={post.user.name}
                                                    className="w-12 h-12 rounded-full object-cover"
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
                                <CardTitle className="text-xl mt-4">{post.title}</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="prose max-w-none mb-6">
                                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                                </div>
                                
                                {/* Display image if exists */}
                                {post.image && (
                                    <div className="mb-6">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-auto max-h-96 object-cover rounded-lg"
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
                                        onClick={handleLike}
                                        className={`flex items-center space-x-2 ${
                                            isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                                        }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                        <span>{post.likes_count}</span>
                                    </Button>

                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <MessageCircle className="w-5 h-5" />
                                        <span>{post.comments_count}</span>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleShare}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        <span>{post.shares_count}</span>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>

                        {/* Comments Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Comments ({post.comments_count})
                            </h3>

                            {/* Add Comment Form */}
                            <Card>
                                <CardContent className="pt-6">
                                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                                        <textarea
                                            placeholder="Write a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            required
                                        />
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={submittingComment || !commentText.trim()}>
                                                {submittingComment ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                ) : (
                                                    <Send className="w-4 h-4 mr-2" />
                                                )}
                                                Post Comment
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Comments List */}
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {post.comments && post.comments.length > 0 ? (
                                    post.comments.map((comment) => (
                                        <Card key={comment.id}>
                                            <CardContent className="pt-4">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                        {comment.user.profile_image ? (
                                                            <img
                                                                src={comment.user.profile_image}
                                                                alt={comment.user.name}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <User className="w-4 h-4 text-gray-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="font-semibold text-gray-900 text-sm">
                                                                {comment.user.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(comment.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 text-sm">{comment.comment}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">No comments yet. Be the first to comment!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>Failed to load post details.</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
