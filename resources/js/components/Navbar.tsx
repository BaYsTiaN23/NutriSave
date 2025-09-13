import { Link } from '@inertiajs/react';

interface NavbarProps {
    currentPage?: 'feed' | 'create' | 'profile';
}

export default function Navbar({ currentPage = 'feed' }: NavbarProps) {
    const getLinkClass = (page: string) => {
        const baseClass = "text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium";
        return currentPage === page ? `${baseClass} bg-gray-100` : baseClass;
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/feed" className="text-xl font-semibold text-gray-900">
                            NutriSave
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/feed"
                            className={getLinkClass('feed')}
                        >
                            Feed
                        </Link>
                        <Link
                            href="/posts/create"
                            className={getLinkClass('create')}
                        >
                            Create Post
                        </Link>
                        <Link
                            href="/profile"
                            className={getLinkClass('profile')}
                        >
                            Profile
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
