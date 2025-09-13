import TitleGenerator from '@/components/title-generator';
import SidebarTitleUpdater from '@/components/sidebar-title-updater';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Head, router, usePage } from '@inertiajs/react';
import { useStream } from '@laravel/stream-react';
import { Info, Bot, User, ArrowLeft, Send, Sparkles, ShoppingCart, Clock, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';

type Message = {
    id?: number;
    type: 'response' | 'error' | 'prompt';
    content: string;
};

type ChatType = {
    id: number;
    title: string;
    messages: Message[];
    created_at: string;
    updated_at: string;
};

type TipOfDay = {
    title: string;
    description: string;
};

type PageProps = {
    auth: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
    chat?: ChatType;
    flash?: {
        stream?: boolean;
    };
};

function ChatWithStream({ chat, auth, flash }: { chat: ChatType | undefined; auth: PageProps['auth']; flash: PageProps['flash'] }) {
    const [messages, setMessages] = useState<Message[]>(chat?.messages || []);
    const [currentTitle, setCurrentTitle] = useState<string>(chat?.title || 'Untitled');
    const [shouldGenerateTitle, setShouldGenerateTitle] = useState<boolean>(false);
    const [isTitleStreaming, setIsTitleStreaming] = useState<boolean>(false);
    const [shouldUpdateSidebar, setShouldUpdateSidebar] = useState<boolean>(false);
    const [tipOfDay, setTipOfDay] = useState<TipOfDay | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(true);
    const [isTopicsOpen, setIsTopicsOpen] = useState(true);
    const [isTipOpen, setIsTipOpen] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentChatId = chat?.id || null;
    const streamUrl = currentChatId ? `/chat/${currentChatId}/stream` : '/chat/stream';

    const { data, send, isStreaming, isFetching } = useStream(streamUrl);

    // Fetch tip of the day
    useEffect(() => {
        fetch('/api/tip-of-day')
            .then(response => response.json())
            .then(data => setTipOfDay(data))
            .catch(error => console.error('Error fetching tip of day:', error));
    }, []);

    // Auto-focus input and handle auto-streaming on mount
    useEffect(() => {
        inputRef.current?.focus();

        // Auto-stream if we have a chat with exactly 1 message (newly created chat)
        // OR if flash.stream is true (fallback)
        const shouldAutoStream = chat?.messages?.length === 1 || (flash?.stream && chat?.messages && chat.messages.length > 0);

        if (shouldAutoStream) {
            setTimeout(() => {
                send({ messages: chat.messages });
            }, 100);
        }
    }, [chat?.messages, flash?.stream, send]); // Only run on mount

    // Scroll to bottom when streaming
    useEffect(() => {
        if (isStreaming) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [isStreaming, data]);

    // Focus input when streaming completes and trigger title generation
    useEffect(() => {
        if (!isStreaming && inputRef.current) {
            inputRef.current.focus();
            
            // Trigger title generation if this is an authenticated user with "Untitled" chat and we have a response
            if (auth.user && chat && currentTitle === 'Untitled' && data && data.trim()) {
                setShouldGenerateTitle(true);
                setShouldUpdateSidebar(true);
            }
        }
    }, [isStreaming, auth.user, chat, currentTitle, data]);

    // Update current title when chat changes
    useEffect(() => {
        if (chat?.title) {
            setCurrentTitle(chat.title);
        }
    }, [chat?.title]);

    // Track title state changes
    useEffect(() => {
        // Title state tracking
    }, [currentTitle, isTitleStreaming]);

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = inputValue.trim();

        if (!query) return;

        const toAdd: Message[] = [];

        // If there's a completed response from previous streaming, add it first
        if (data && data.trim()) {
            toAdd.push({
                type: 'response',
                content: data,
            });
        }

        // Add the new prompt
        toAdd.push({
            type: 'prompt',
            content: query,
        });

        // Update local state
        setMessages((prev) => [...prev, ...toAdd]);

        // Send all messages including the new ones
        send({ messages: [...messages, ...toAdd] });

        setInputValue('');
        inputRef.current?.focus();
    }, [send, data, messages, inputValue]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    const handleSendClick = () => {
        if (inputValue.trim()) {
            const query = inputValue.trim();
            const toAdd: Message[] = [];

            // If there's a completed response from previous streaming, add it first
            if (data && data.trim()) {
                toAdd.push({
                    type: 'response',
                    content: data,
                });
            }

            // Add the new prompt
            toAdd.push({
                type: 'prompt',
                content: query,
            });

            // Update local state
            setMessages((prev) => [...prev, ...toAdd]);

            // Send all messages including the new ones
            send({ messages: [...messages, ...toAdd] });

            setInputValue('');
            inputRef.current?.focus();
        }
    };

    return (
        <>
            <Head title={currentTitle} />
            {/* Title generator with working EventStream */}
            {shouldGenerateTitle && auth.user && chat && (
                <TitleGenerator
                    chatId={chat.id}
                    onTitleUpdate={(newTitle, isStreaming = false) => {
                        setCurrentTitle(newTitle);
                        setIsTitleStreaming(isStreaming);
                        document.title = `${newTitle} - NutriSave`;
                    }}
                    onComplete={() => {
                        setIsTitleStreaming(false);
                        setShouldGenerateTitle(false);
                    }}
                />
            )}
            
            {/* Sidebar title updater - separate EventStream for sidebar */}
            {shouldUpdateSidebar && auth.user && chat && (
                <SidebarTitleUpdater
                    chatId={chat.id}
                    onComplete={() => {
                        setShouldUpdateSidebar(false);
                    }}
                />
            )}
            
            <div className="h-screen bg-background flex flex-col">
                {/* Header */}
                <header className="border-b bg-card/50 backdrop-blur-sm z-50 flex-shrink-0">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="sm" onClick={() => router.visit('/')}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Bot className="w-6 h-6 text-primary" />
                                    <div>
                                        <h1 className="text-xl font-bold">
                                            {currentTitle}
                                            {isTitleStreaming && (
                                                <span className="ml-1 animate-pulse">|</span>
                                            )}
                                        </h1>
                                        <Badge variant="secondary" className="text-xs">
                                            En línea
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {!auth.user && (
                    <div className="bg-background border-b p-4 flex-shrink-0">
                        <Alert className="mx-auto max-w-7xl">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                You're chatting anonymously. Your conversation won't be saved.
                                <Button variant="link" className="h-auto p-0 text-sm" onClick={() => router.visit('/login')}>
                                    Sign in to save your chats
                                </Button>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                <div className="flex-1 overflow-hidden">
                    <div className="container mx-auto px-4 py-8 h-full">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                            {/* Chat Area */}
                            <div className="lg:col-span-2 flex flex-col">
                                <Card className="flex-1 flex flex-col">
                                    <CardHeader className="flex-shrink-0">
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            Chat Inteligente
                                        </CardTitle>
                                        <CardDescription>
                                            Pregúntame sobre recetas, precios, organización o cualquier duda culinaria
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col min-h-0">
                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto pr-4">
                                            <div className="space-y-4">
                                                {messages.map((message, index) => (
                                                    <div
                                                        key={message.id || index}
                                                        className={`flex gap-3 ${message.type === 'prompt' ? "justify-end" : "justify-start"}`}
                                                    >
                                                        {(message.type === 'response' || message.type === 'error') && (
                                                            <Avatar className="w-8 h-8">
                                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                                    <Bot className="w-4 h-4" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                        <div
                                                            className={`max-w-[80%] rounded-lg p-3 ${
                                                                message.type === 'prompt' ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                                                            }`}
                                                        >
                                                            <p className="text-sm">{message.content}</p>
                                                            <p className="text-xs opacity-70 mt-1">
                                                                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                            </p>
                                                        </div>
                                                        {message.type === 'prompt' && (
                                                            <Avatar className="w-8 h-8">
                                                                <AvatarImage src="/user-avatar.jpg" alt="Usuario" />
                                                                <AvatarFallback>
                                                                    <User className="w-4 h-4" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Current streaming response */}
                                                {data && data.trim() && (
                                                    <div className="flex gap-3 justify-start">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                                <Bot className="w-4 h-4" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                                                            <p className="text-sm">{data}</p>
                                                            <p className="text-xs opacity-70 mt-1">
                                                                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Typing Indicator */}
                                                {isStreaming && (
                                                    <div className="flex gap-3 justify-start">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                                <Bot className="w-4 h-4" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="bg-muted rounded-lg p-3">
                                                            <div className="flex space-x-1">
                                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                                                <div
                                                                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                                                    style={{ animationDelay: "0.1s" }}
                                                                ></div>
                                                                <div
                                                                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                                                    style={{ animationDelay: "0.2s" }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Input */}
                                        <form onSubmit={handleSubmit} className="mt-4 flex-shrink-0">
                                            <div className="flex gap-2">
                                                <Input
                                                    ref={inputRef}
                                                    placeholder="Pregúntame sobre recetas, precios, organización..."
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    className="flex-1"
                                                    disabled={isStreaming || isFetching}
                                                />
                                                <Button 
                                                    type="button"
                                                    onClick={handleSendClick}
                                                    disabled={!inputValue.trim() || isStreaming || isFetching}
                                                >
                                                    <Send className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Fixed Suggestions Sidebar */}
                            <div className="lg:col-span-1 hidden lg:block">
                                <div className="fixed top-24 right-8 w-80 h-[calc(100vh-7rem)] overflow-y-auto">
                                    <div className="space-y-4 pr-4">
                                        {/* Quick Actions */}
                                        <Collapsible open={isQuickActionsOpen} onOpenChange={setIsQuickActionsOpen}>
                                            <Card>
                                                <CollapsibleTrigger asChild>
                                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                                        <CardTitle className="text-lg flex items-center justify-between">
                                                            Acciones Rápidas
                                                            {isQuickActionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </CardTitle>
                                                    </CardHeader>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <CardContent className="space-y-2">
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-start bg-transparent"
                                                            onClick={() => setInputValue("¿Qué puedo cocinar con pollo y arroz?")}
                                                        >
                                                            <Sparkles className="w-4 h-4 mr-2" />
                                                            Sugerir receta
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-start bg-transparent"
                                                            onClick={() => setInputValue("¿Dónde está más barato el aceite de oliva?")}
                                                        >
                                                            <DollarSign className="w-4 h-4 mr-2" />
                                                            Comparar precios
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-start bg-transparent"
                                                            onClick={() => setInputValue("¿Cómo organizo mi despensa?")}
                                                        >
                                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                                            Tips de organización
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-start bg-transparent"
                                                            onClick={() => setInputValue("Menú semanal para 4 personas con $300")}
                                                        >
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            Planificar menú
                                                        </Button>
                                                    </CardContent>
                                                </CollapsibleContent>
                                            </Card>
                                        </Collapsible>

                                        {/* Recent Topics */}
                                        <Collapsible open={isTopicsOpen} onOpenChange={setIsTopicsOpen}>
                                            <Card>
                                                <CollapsibleTrigger asChild>
                                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                                        <CardTitle className="text-lg flex items-center justify-between">
                                                            Temas Populares
                                                            {isTopicsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </CardTitle>
                                                    </CardHeader>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <CardContent>
                                                        <div className="space-y-3">
                                                            <div 
                                                                className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                                                                onClick={() => setInputValue("Recetas con pollo económicas")}
                                                            >
                                                                <p className="text-sm font-medium">Recetas con pollo económicas</p>
                                                                <p className="text-xs text-muted-foreground">Preguntado 15 veces hoy</p>
                                                            </div>
                                                            <div 
                                                                className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                                                                onClick={() => setInputValue("Organizar despensa pequeña")}
                                                            >
                                                                <p className="text-sm font-medium">Organizar despensa pequeña</p>
                                                                <p className="text-xs text-muted-foreground">Preguntado 12 veces hoy</p>
                                                            </div>
                                                            <div 
                                                                className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                                                                onClick={() => setInputValue("Menús vegetarianos baratos")}
                                                            >
                                                                <p className="text-sm font-medium">Menús vegetarianos baratos</p>
                                                                <p className="text-xs text-muted-foreground">Preguntado 8 veces hoy</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </CollapsibleContent>
                                            </Card>
                                        </Collapsible>

                                        {/* Tips */}
                                        <Collapsible open={isTipOpen} onOpenChange={setIsTipOpen}>
                                            <Card>
                                                <CollapsibleTrigger asChild>
                                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                                        <CardTitle className="text-lg flex items-center justify-between">
                                                            Tip del Día
                                                            {isTipOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </CardTitle>
                                                    </CardHeader>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <CardContent>
                                                        <div className="p-3 bg-primary/10 rounded-lg">
                                                            <p className="text-sm font-medium mb-2">
                                                                {tipOfDay?.title || "Ahorra comprando en temporada"}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {tipOfDay?.description || "Las frutas y verduras de temporada pueden costar hasta 40% menos. Pregúntame qué está en temporada este mes."}
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </CollapsibleContent>
                                            </Card>
                                        </Collapsible>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function Chat() {
    const { auth, chat, flash } = usePage<PageProps>().props;

    // Use the chat ID as a key to force complete re-creation of the ChatWithStream component
    // This ensures useStream is completely reinitialized with the correct URL
    const key = chat?.id ? `chat-${chat.id}` : 'no-chat';

    return <ChatWithStream key={key} chat={chat} auth={auth} flash={flash} />;
}
