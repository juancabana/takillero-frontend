import React from 'react';
import { Search } from 'lucide-react';
import { input } from '@/config/theme';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Input de búsqueda con ícono — reutilizado en menú, admin/pedidos, admin/productos.
 */
export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${input.base} ${input.withIcon} !bg-white`}
      />
    </div>
  );
}
