import { FeatureCard } from '@/components/molecules/FeatureCard';
import { HOME_PAGE } from '@/constants/pages/home';

/**
 * Organism: Sección de características/beneficios del negocio.
 * Componente de servidor puro — datos estáticos, sin interactividad.
 */
export function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOME_PAGE.CLASSIC_FEATURES.map((feature) => (
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
