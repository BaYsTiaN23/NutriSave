import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, Upload, X, ImageIcon } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
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
                onClose();
                // Refresh the page to show the new post
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Error creating post:', errors);
            }
        });
    };

    const handleClose = () => {
        reset();
        setImagePreview(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto bg-[#faf9f7] border-[#8B4513]/20">
                <DialogHeader className="border-b border-[#8B4513]/20 pb-4 relative">
                    <DialogTitle className="text-[#8B4513] text-2xl font-bold pr-8">
                        Crear Nueva Publicación
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="absolute top-0 right-0 text-[#8B4513] hover:text-[#A0522D] hover:bg-[#8B4513]/10"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </DialogHeader>

                <div className="p-2">
                    <Card className="bg-white border-[#8B4513]/20">
                        <CardHeader>
                            <CardTitle className="text-xl text-[#8B4513]">Comparte con la Comunidad</CardTitle>
                            <p className="text-[#8B4513]/70">Comparte tus recetas, actualizaciones de organizaciones, ofertas o menús semanales.</p>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-[#8B4513] font-medium">Título *</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="Ingresa un título llamativo para tu publicación"
                                        value={data.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
                                        className={`${errors.title ? 'border-red-500' : 'border-[#8B4513]/20 focus:border-[#8B4513]'} text-[#8B4513] placeholder:text-[#8B4513]/60`}
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-[#8B4513] font-medium">Categoría *</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                        required
                                    >
                                        <SelectTrigger className={`${errors.category ? 'border-red-500' : 'border-[#8B4513]/30 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20'} text-[#8B4513] bg-white hover:bg-[#EFDBCD]/50 hover:border-[#8B4513]/50 transition-all duration-200`}>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#8B4513]/20 shadow-lg">
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category}
                                                    value={category}
                                                    className="text-[#8B4513] hover:bg-[#8B4513]/10 hover:text-[#8B4513] focus:bg-[#8B4513]/10 focus:text-[#8B4513] cursor-pointer transition-colors duration-200"
                                                >
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
                                    <Label htmlFor="content" className="text-[#8B4513] font-medium">Contenido *</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Escribe el contenido de tu publicación aquí... Comparte recetas, consejos, ofertas o cualquier información nutricional valiosa para la comunidad."
                                        value={data.content}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('content', e.target.value)}
                                        className={`min-h-[200px] ${errors.content ? 'border-red-500' : 'border-[#8B4513]/20 focus:border-[#8B4513]'} text-[#8B4513] placeholder:text-[#8B4513]/60`}
                                        required
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-red-600">{errors.content}</p>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <Label htmlFor="tags" className="text-[#8B4513] font-medium">Etiquetas</Label>
                                    <Input
                                        id="tags"
                                        type="text"
                                        placeholder="saludable, vegano, comida-rápida, económico (separado por comas)"
                                        value={data.tags}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('tags', e.target.value)}
                                        className={`${errors.tags ? 'border-red-500' : 'border-[#8B4513]/20 focus:border-[#8B4513]'} text-[#8B4513] placeholder:text-[#8B4513]/60`}
                                    />
                                    <p className="text-sm text-[#8B4513]/60">
                                        Agrega etiquetas relevantes separadas por comas para ayudar a otros a encontrar tu publicación
                                    </p>
                                    {errors.tags && (
                                        <p className="text-sm text-red-600">{errors.tags}</p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="image" className="text-[#8B4513] font-medium">Imagen</Label>
                                    <div className="border-2 border-dashed border-[#8B4513]/30 rounded-lg p-6 bg-[#EFDBCD]/30">
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
                                                    <p className="text-sm text-[#8B4513] text-center">
                                                        Subiendo a S3...
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-green-600 text-center">
                                                        ✓ Subido exitosamente
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <ImageIcon className="mx-auto h-12 w-12 text-[#8B4513]/50" />
                                                <div className="mt-4">
                                                    <Label
                                                        htmlFor="image"
                                                        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-[#8B4513]/30 rounded-md shadow-sm text-sm font-medium text-[#8B4513] bg-white hover:bg-[#8B4513]/10 ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        {imageUploading ? 'Subiendo...' : 'Subir Imagen'}
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
                                                <p className="mt-2 text-sm text-[#8B4513]/60">
                                                    PNG, JPG, GIF hasta 2MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {errors.image && (
                                        <p className="text-sm text-red-600">{errors.image}</p>
                                    )}
                                </div>

                                {/* Category-specific Guidelines */}
                                <div className="bg-[#EFDBCD] border border-[#8B4513]/20 rounded-lg p-4">
                                    <h4 className="font-semibold text-[#8B4513] mb-2">Guías por Categoría:</h4>
                                    <ul className="text-sm text-[#8B4513]/80 space-y-1">
                                        <li><strong>Recetas:</strong> Incluye ingredientes, instrucciones y beneficios nutricionales</li>
                                        <li><strong>Organizaciones:</strong> Comparte actualizaciones, eventos o asociaciones</li>
                                        <li><strong>Ofertas:</strong> Publica ofertas especiales, descuentos o promociones</li>
                                        <li><strong>Menú Semanal:</strong> Comparte comidas planificadas con información nutricional</li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        className="border-2 border-[#8B4513]/40 text-[#8B4513] hover:bg-[#8B4513]/15 hover:border-[#8B4513]/70 hover:text-[#8B4513] bg-white/90 backdrop-blur-sm transition-all duration-200 font-medium px-6 py-2 shadow-sm hover:shadow-md"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[120px] bg-[#8B4513] hover:bg-[#A0522D] hover:shadow-lg text-white font-medium px-6 py-2 shadow-md transition-all duration-200 hover:scale-105"
                                    >
                                        {processing ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creando...
                                            </div>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Crear Publicación
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
