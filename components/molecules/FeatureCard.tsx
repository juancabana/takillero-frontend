interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

/**
 * Molecule: Card de característica/beneficio del negocio.
 * Componente puramente presentacional (sin estado ni efectos).
 */
export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow duration-200">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl" role="img" aria-hidden="true">
          {icon}
        </span>
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
