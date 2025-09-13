import { Clock, Star, ShoppingCart, Users } from "lucide-react";

export function ActivityFeed() {
  const activities = [
    {
      type: "product",
      title: "Nuevo producto añadido",
      description: "Yogur natural - Categoría: Lácteos",
      time: "Hace 2 horas",
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600"
    },
    {
      type: "promotion",
      title: "¡Oferta destacada!",
      description: "20% descuento en pan integral - Tienda La Panadería",
      time: "Hace 4 horas",
      icon: Star,
      color: "from-yellow-500 to-orange-500"
    },
    {
      type: "community",
      title: "Nueva receta compartida",
      description: "Ana compartió: 'Ensalada mediterránea' en la comunidad",
      time: "Hace 6 horas",
      icon: Users,
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Actividad Reciente</h3>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="group relative flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-orange-200 hover:bg-white/80 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Timeline line */}
            {index !== activities.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-orange-300 to-transparent" />
            )}

            {/* Icon */}
            <div className={`flex-shrink-0 p-2.5 rounded-lg bg-gradient-to-r ${activity.color} shadow-lg group-hover:scale-110 transition-transform`}>
              <activity.icon className="h-4 w-4 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-800 text-sm">{activity.title}</h4>
                <span className="text-xs text-gray-600 bg-orange-100 px-2 py-1 rounded-md">
                  {activity.time}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}