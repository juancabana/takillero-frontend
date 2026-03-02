import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/category.types';
import { appRoutes } from '@/config/appRoutes';

interface CategoryCardProps {
  category: Category;
}

/**
 * Molecule: Card de categoría para el grid del homepage.
 * Al hacer clic navega a /menu?categoria=[id].
 * Componente de servidor puro — sin interactividad client-side necesaria.
 */
export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={appRoutes.MENU.BY_CATEGORY.getHref({ categoriaId: category.id })}
      className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
      aria-label={`Ver productos de ${category.name}`}
    >
      {/* Imagen de fondo */}
      <div className="relative h-40 w-full">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Contenido sobre la imagen */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={category.name}>
            {category.icon}
          </span>
          <span className="font-bold text-lg leading-tight">{category.name}</span>
        </div>
      </div>
    </Link>
  );
}
