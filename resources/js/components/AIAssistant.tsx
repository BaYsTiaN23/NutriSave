import { Bot, Send, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export function AIAssistant() {
  const suggestions = [
    "¿Qué puedo cocinar con los ingredientes que tengo?",
    "Recetas saludables para bajar de peso",
    "Cómo conservar mejor mis vegetales"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Asistente IA</h3>
          <p className="text-sm text-gray-600">Tu chef personal inteligente</p>
        </div>
      </div>

      {/* Chat Preview */}
      <Link href="/chat" className="block">
        <div className="space-y-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-orange-200 hover:bg-white/80 transition-all duration-200 cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white/80 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm text-gray-800">
                ¡Hola! Tengo algunas sugerencias de recetas basadas en los productos que están por vencer en tu despensa.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 justify-end">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">
                ...
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-orange-700">Tú</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Quick Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-800">Sugerencias rápidas</span>
        </div>

        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <Link key={index} href="/chat">
              <button className="w-full text-left p-3 rounded-lg bg-white/60 border border-orange-200 hover:bg-white/80 transition-all duration-200 text-sm text-gray-600 hover:text-gray-800 group">
                <div className="flex items-center justify-between">
                  <span>{suggestion}</span>
                  <Send className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            </Link>
          ))}
        </div>
      </div>

      <Link href="/chat">
        <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl border-0 group">
          Iniciar Conversación
          <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
}