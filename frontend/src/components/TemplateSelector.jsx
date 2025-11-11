import { Palette } from "lucide-react";

const TemplateSelector = ({ template, setTemplate }) => {
  const templates = [
    {
      id: "modern",
      name: "Moderno",
      description: "Design limpo e profissional",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      id: "classic",
      name: "Clássico",
      description: "Layout tradicional elegante",
      gradient: "from-gray-600 to-gray-800",
    },
    {
      id: "creative",
      name: "Criativo",
      description: "Para perfis inovadores",
      gradient: "from-green-500 to-blue-600",
    },
  ];

  return (
    <div className="flex items-center space-x-2">
      <Palette className="h-4 w-4 text-gray-500" />
      <span className="text-sm font-medium text-gray-700 hidden sm:block">
        Template:
      </span>
      <div className="flex space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-lg border border-gray-200/50">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={`relative px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              template === t.id
                ? "text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
            }`}
            title={t.description}
          >
            {template === t.id && (
              <div
                className={`absolute inset-0 bg-gradient-to-r ${t.gradient} rounded-lg -z-10`}
              ></div>
            )}
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
