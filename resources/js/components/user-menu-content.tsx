import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings, User as UserIcon, Bell, HelpCircle } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full text-gray-800 font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-md" href="/profile" as="button" prefetch onClick={cleanup}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        Mi Perfil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link className="block w-full text-gray-800 font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-md" href="/settings" as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2 h-4 w-4" />
                        Configuración
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link className="block w-full text-gray-800 font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-md" href="/notifications" as="button" prefetch onClick={cleanup}>
                        <Bell className="mr-2 h-4 w-4" />
                        Notificaciones
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link className="block w-full text-gray-800 font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-md" href="/help" as="button" prefetch onClick={cleanup}>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Ayuda
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 rounded-md" method="post" href="/logout" as="button" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                </Link>
            </DropdownMenuItem>
        </>
    );
}
