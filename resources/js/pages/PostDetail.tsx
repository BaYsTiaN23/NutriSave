import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, User, ArrowLeft, Send } from 'lucide-react';

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
    lugar?: string;
    tags?: string;
    image?: string;
    created_at: string;
    user: User;
    likes_count: number;
    comments_count: number;
    shares_count: number;
    comments?: Comment[];
}

interface PostDetailProps {
    post: Post;
    auth: {
        user: User;
    };
}

export default function PostDetail({ post: initialPost, auth }: PostDetailProps) {
    const [post, setPost] = useState(initialPost);
    const [isLiked, setIsLiked] = useState(false);

    const { data, setData, processing, reset } = useForm({
        comment: '',
        post_id: post.id
    });

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
        try {
            const response = await axios.post('/api/likes', { post_id: post.id });
            setIsLiked(response.data.data.liked);
            setPost(prev => ({
                ...prev,
                likes_count: response.data.data.likes_count
            }));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleShare = async () => {
        try {
            await axios.post('/api/shares', { post_id: post.id });
            setPost(prev => ({
                ...prev,
                shares_count: prev.shares_count + 1
            }));
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Use axios to submit the comment to the web route
            const response = await axios.post('/comments', {
                post_id: post.id,
                comment: data.comment
            }, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (response.data.success) {
                // Add the new comment to the state
                const newComment = response.data.data;
                setPost(prev => ({
                    ...prev,
                    comments: [...(prev.comments || []), newComment],
                    comments_count: prev.comments_count + 1
                }));
                reset();
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const getTags = (tags: string | undefined) => {
        if (!tags) return [];
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    };

    return (
        <>
            <Head title={post.title} />

            <div className="min-h-screen bg-[#faf9f7]">
                {/* Navigation */}
                <nav className="bg-white/80 backdrop-blur-sm border-b border-[#8B4513]/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-semibold text-[#8B4513]">NutriSave</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/feed"
                                    className="text-[#8B4513] hover:text-[#A0522D] px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Feed
                                </Link>
                                <Link
                                    href="/posts/create"
                                    className="text-[#8B4513] hover:text-[#A0522D] px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Create Post
                                </Link>
                                <Link
                                    href="/profile"
                                    className="text-[#8B4513] hover:text-[#A0522D] px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            href="/feed"
                            className="inline-flex items-center text-[#8B4513] hover:text-[#A0522D]"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Feed
                        </Link>
                    </div>

                    {/* Post Detail */}
                    <Card className="bg-white shadow-sm mb-8 border-[#8B4513]/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-[#8B4513]/10 rounded-full flex items-center justify-center">
                                        {post.user.profile_image ? (
                                            <img
                                                src={post.user.profile_image}
                                                alt={post.user.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-6 h-6 text-[#8B4513]" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#8B4513]">{post.user.name}</p>
                                        <p className="text-sm text-[#8B4513]/70">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <Badge className={getCategoryColor(post.category)}>
                                    {post.category}
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl mt-4 text-[#8B4513]">{post.title}</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="prose max-w-none mb-6">
                                <p className="text-[#8B4513]/80 whitespace-pre-wrap">{post.content}</p>
                            </div>

                            {/* Display lugar if exists */}
                            {post.lugar && (
                                <div className="mb-6 flex items-center text-[#8B4513]/70">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm italic">{post.lugar}</span>
                                </div>
                            )}

                            {/* Display image if exists */}
                            {post.image && (
                                <div className="mb-6 post-image-container rounded-lg">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="post-image w-full h-auto max-h-96 object-cover rounded-lg"
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
                            )}

                            {getTags(post.tags).length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {getTags(post.tags).map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs border-[#8B4513]/20 text-[#8B4513]">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex items-center justify-between pt-4 border-t border-[#8B4513]/20">
                            <div className="flex items-center space-x-6">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLike}
                                    className={`flex items-center space-x-2 ${isLiked ? 'text-red-600' : 'text-[#8B4513]/70 hover:text-red-600'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                    <span>{post.likes_count}</span>
                                </Button>

                                <div className="flex items-center space-x-2 text-[#8B4513]/70">
                                    <MessageCircle className="w-5 h-5" />
                                    <span>{post.comments_count}</span>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleShare}
                                    className="flex items-center space-x-2 text-[#8B4513]/70 hover:text-green-600"
                                >
                                    <Share2 className="w-5 h-5" />
                                    <span>{post.shares_count}</span>
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Comments Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-[#8B4513]">Comments ({post.comments_count})</h3>

                        {/* Add Comment Form */}
                        {auth.user && (
                            <Card className="bg-white shadow-sm border-[#8B4513]/20">
                                <CardContent className="pt-6">
                                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                                        <textarea
                                            placeholder="Write a comment..."
                                            value={data.comment}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('comment', e.target.value)}
                                            className="min-h-[100px] w-full rounded-md border border-[#8B4513]/20 px-3 py-2 text-sm text-[#8B4513] placeholder:text-[#8B4513]/60 focus:border-[#8B4513] focus:outline-none focus:ring-1 focus:ring-[#8B4513]"
                                            required
                                        />
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={processing} className="bg-[#8B4513] hover:bg-[#A0522D] text-white">
                                                <Send className="w-4 h-4 mr-2" />
                                                Post Comment
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Comments List */}
                        <div className="space-y-4">
                            {post.comments?.map((comment) => (
                                <Card key={comment.id} className="bg-white shadow-sm border-[#8B4513]/20">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-[#8B4513]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                {comment.user.profile_image ? (
                                                    <img
                                                        src={comment.user.profile_image}
                                                        alt={comment.user.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-4 h-4 text-[#8B4513]" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-semibold text-[#8B4513]">{comment.user.name}</span>
                                                    <span className="text-sm text-[#8B4513]/70">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-[#8B4513]/80">{comment.comment}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {(post.comments?.length === 0 || !post.comments) && (
                            <div className="text-center py-8 text-[#8B4513]/70">
                                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-[#8B4513]/30" />
                                <p>No comments yet. Be the first to comment!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
