import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Upload, X, ImageIcon } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function CreatePost() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        category: '',
        content: '',
        tags: '',
        image: '' // Now stores URL instead of File
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageUploading, setImageUploading] = useState(false);

    const categories = ['Recipes', 'Organizations', 'Offers', 'Weekly Menu'];

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageUploading(true);
            
            try {
                // Create preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImagePreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);

                // Upload to S3 via web route
                const formData = new FormData();
                formData.append('file', file);

                const response = await axios.post('/upload/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.success) {
                    // Set the image URL from the upload response
                    setData('image', response.data.data.url);
                } else {
                    console.error('Upload failed:', response.data);
                    alert('Image upload failed. Please try again.');
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('Image upload failed. Please try again.');
                setImagePreview(null);
            } finally {
                setImageUploading(false);
            }
        }
    };

    const removeImage = () => {
        // If there's an image URL, we could optionally delete it from S3
        setData('image', '');
        setImagePreview(null);
        // Reset file input
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('posts.store'), {
            onSuccess: () => {
                reset();
                setImagePreview(null);
                // Redirect to feed after successful creation
            },
            onError: (errors) => {
                console.error('Error creating post:', errors);
            }
        });
    };

    return (
        <>
            <Head title="Create Post" />
            
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
                                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium bg-gray-100"
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
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            href="/feed"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Feed
                        </Link>
                    </div>

                    {/* Create Post Form */}
                    <Card className="bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl">Create New Post</CardTitle>
                            <p className="text-gray-600">Share your recipes, organization updates, offers, or weekly menus with the community.</p>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="Enter a catchy title for your post"
                                        value={data.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
                                        className={errors.title ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                        required
                                    >
                                        <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-sm text-red-600">{errors.category}</p>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <Label htmlFor="content">Content *</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Write your post content here... Share recipes, tips, offers, or any nutritional information that would be valuable to the community."
                                        value={data.content}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('content', e.target.value)}
                                        className={`min-h-[200px] ${errors.content ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-red-600">{errors.content}</p>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input
                                        id="tags"
                                        type="text"
                                        placeholder="healthy, vegan, quick-meal, budget-friendly (comma separated)"
                                        value={data.tags}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('tags', e.target.value)}
                                        className={errors.tags ? 'border-red-500' : ''}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Add relevant tags separated by commas to help others find your post
                                    </p>
                                    {errors.tags && (
                                        <p className="text-sm text-red-600">{errors.tags}</p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                        {imagePreview ? (
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={removeImage}
                                                        className="absolute top-2 right-2"
                                                        disabled={imageUploading}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                {imageUploading ? (
                                                    <p className="text-sm text-blue-600 text-center">
                                                        Uploading to S3...
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-green-600 text-center">
                                                        ✓ Uploaded successfully
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="mt-4">
                                                    <Label
                                                        htmlFor="image"
                                                        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        {imageUploading ? 'Uploading...' : 'Upload Image'}
                                                    </Label>
                                                    <Input
                                                        id="image"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                        disabled={imageUploading}
                                                    />
                                                </div>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    PNG, JPG, GIF up to 2MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {errors.image && (
                                        <p className="text-sm text-red-600">{errors.image}</p>
                                    )}
                                </div>

                                {/* Category-specific Guidelines */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">Category Guidelines:</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li><strong>Recipes:</strong> Include ingredients, instructions, and nutritional benefits</li>
                                        <li><strong>Organizations:</strong> Share updates, events, or partnerships</li>
                                        <li><strong>Offers:</strong> Post special deals, discounts, or promotions</li>
                                        <li><strong>Weekly Menu:</strong> Share planned meals with nutritional information</li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[120px]"
                                    >
                                        {processing ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creating...
                                            </div>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Create Post
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
