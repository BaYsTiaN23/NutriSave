import { MessageSquare, Heart, Share2, Clock } from "lucide-react";
import { Link } from "@inertiajs/react";

export function CommunityPosts() {
  const posts = [
    {
      id: 1,
      title: "Ensalada Mediterránea Perfecta",
      author: "Ana García",
      category: "Recipes",
      content: "Una receta refrescante con ingredientes locales...",
      likes: 24,
      comments: 8,
      shares: 3,
      time: "2h",
      calories: 320,
      tags: ["saludable", "mediterránea", "fácil"]
    },
    {
      id: 2,
      title: "Ofertas de la Semana",
      author: "Súper Mercado Local",
      category: "Offers",
      content: "20% descuento en todos los productos orgánicos...",
      likes: 18,
      comments: 5,
      shares: 12,
      time: "4h",
      tags: ["ofertas", "orgánico", "descuento"]
    },
    {
      id: 3,
      title: "Tips para Reducir Desperdicio",
      author: "EcoChef",
      category: "Organizations",
      content: "Consejos prácticos para aprovechar mejor los alimentos...",
      likes: 31,
      comments: 12,
      shares: 7,
      time: "6h",
      tags: ["eco", "tips", "desperdicio"]
    },
    {
      id: 4,
      title: "Receta de Pasta Integral",
      author: "María López",
      category: "Recipes",
      content: "Una deliciosa pasta integral con vegetales frescos y queso parmesano...",
      likes: 15,
      comments: 6,
      shares: 4,
      time: "8h",
      calories: 280,
      tags: ["pasta", "integral", "vegetales"]
    },
    {
      id: 5,
      title: "Descuentos en Frutas de Temporada",
      author: "Mercado Central",
      category: "Offers",
      content: "30% de descuento en frutas de temporada hasta el viernes...",
      likes: 22,
      comments: 9,
      shares: 15,
      time: "10h",
      tags: ["frutas", "temporada", "descuento"]
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Recipes": return "from-green-500 to-emerald-600";
      case "Offers": return "from-blue-500 to-blue-600";
      case "Organizations": return "from-purple-500 to-indigo-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/feed" className="hover:opacity-80 transition-opacity">
          <h3 className="text-xl font-bold text-gray-800 cursor-pointer">Comunidad Activa</h3>
        </Link>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          En vivo
        </div>
      </div>

      <div className="space-y-4 flex flex-col gap-4">
        {posts.map((post, index) => (
          <Link key={post.id} href="/feed">
            <div
              className="group p-5 rounded-xl bg-white/60 backdrop-blur-sm border border-orange-200 hover:bg-white/80 transition-all duration-300 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{post.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>

                <div className={`px-2 py-1 rounded-md bg-gradient-to-r ${getCategoryColor(post.category)} text-white text-xs font-medium`}>
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {post.content}
              </p>

              {/* Tags and calories */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
                {post.calories && (
                  <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-md">
                    {post.calories} cal
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <button className="flex items-center gap-2 hover:text-red-500 group-hover:scale-105 transition-all duration-200">
                  <Heart className="h-4 w-4" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500 group-hover:scale-105 transition-all duration-200">
                  <MessageSquare className="h-4 w-4" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-2 hover:text-green-500 group-hover:scale-105 transition-all duration-200">
                  <Share2 className="h-4 w-4" />
                  {post.shares}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}