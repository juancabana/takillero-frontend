import { FeatureCard } from '@/components/molecules/FeatureCard';
import { HOME_CONTENT } from '@/constants/ui';

/**
 * Organism: Sección de características/beneficios del negocio.
 * Componente de servidor puro — datos estáticos, sin interactividad.
 */
export function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOME_CONTENT.FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
