import { Category } from '@/types/category.types';
import { CategoryCard } from '@/components/molecules/CategoryCard';
import { HOME_CONTENT } from '@/constants/ui';

interface CategoriesSectionProps {
  categories: Category[];
}

/**
 * Organism: Grid de categorías del menú.
 * Componente de servidor — recibe datos ya cargados desde la página.
 */
export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
            {HOME_CONTENT.CATEGORIES_TITLE}
          </h2>
          <p className="text-gray-500 text-lg">{HOME_CONTENT.CATEGORIES_SUBTITLE}</p>
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            No hay categorías disponibles en este momento.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
