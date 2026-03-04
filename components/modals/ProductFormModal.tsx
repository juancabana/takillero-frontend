'use client';

import React, { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import { Modal } from '@/components/atoms/Modal';
import { FormField, FormTextarea, FormSelect } from '@/components/atoms/FormField';
import { btn } from '@/config/theme';
import type { Category } from '@/features/category/domain/entities/category';
import { ADMIN_PRODUCTS } from '@/constants/admin/products';

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryId: string;
}

export const emptyProductForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  categoryId: '',
};

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData: ProductFormData;
  title: string;
  categories: Category[];
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  categories,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setForm(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = ADMIN_PRODUCTS.VALIDATION_NAME_REQUIRED;
    if (!form.description.trim()) newErrors.description = ADMIN_PRODUCTS.VALIDATION_DESCRIPTION_REQUIRED;
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = ADMIN_PRODUCTS.VALIDATION_PRICE_INVALID;
    if (!form.categoryId) newErrors.categoryId = ADMIN_PRODUCTS.VALIDATION_CATEGORY_REQUIRED;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const updateField = (field: keyof ProductFormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image preview */}
        <div className="flex flex-col items-center gap-3">
          {form.imageUrl ? (
            <img
              src={form.imageUrl}
              alt={ADMIN_PRODUCTS.FORM_IMAGE_PREVIEW_ALT}
              className="w-32 h-32 rounded-xl object-cover border-2 border-gray-100"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              <ImageIcon size={32} className="text-gray-400" />
            </div>
          )}
        </div>

        <FormField
          label={ADMIN_PRODUCTS.FORM_NAME_LABEL}
          value={form.name}
          onChange={updateField('name')}
          placeholder={ADMIN_PRODUCTS.FORM_PLACEHOLDER_NAME}
          error={errors.name}
        />

        <FormTextarea
          label={ADMIN_PRODUCTS.FORM_DESCRIPTION_LABEL}
          value={form.description}
          onChange={updateField('description')}
          placeholder={ADMIN_PRODUCTS.FORM_PLACEHOLDER_DESCRIPTION}
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label={ADMIN_PRODUCTS.FORM_PRICE_LABEL}
            type="number"
            value={form.price}
            onChange={updateField('price')}
            placeholder="12000"
            error={errors.price}
          />
          <FormSelect
            label={ADMIN_PRODUCTS.FORM_CATEGORY_LABEL}
            value={form.categoryId}
            onChange={updateField('categoryId')}
            placeholder={ADMIN_PRODUCTS.FORM_SELECT_CATEGORY}
            options={categories.map((cat) => ({
              value: cat.id,
              label: `${cat.icon} ${cat.name}`,
            }))}
            error={errors.categoryId}
          />
        </div>

        <FormField
          label={ADMIN_PRODUCTS.FORM_IMAGE_URL_LABEL}
          type="url"
          value={form.imageUrl}
          onChange={updateField('imageUrl')}
          placeholder={ADMIN_PRODUCTS.FORM_PLACEHOLDER_IMAGE_URL}
        />
        <p className="text-gray-400 -mt-2" style={{ fontSize: '11px' }}>
          {ADMIN_PRODUCTS.FORM_IMAGE_URL_HINT}
        </p>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 px-4 py-2.5 ${btn.base} bg-gray-100 text-gray-600 hover:bg-gray-200`}
            style={{ fontWeight: 500 }}
          >
            {ADMIN_PRODUCTS.FORM_CANCEL}
          </button>
          <button
            type="submit"
            className={`flex-1 px-4 py-2.5 ${btn.base} ${btn.primary}`}
            style={{ fontWeight: 600 }}
          >
            {title.includes('Nuevo') ? ADMIN_PRODUCTS.FORM_CREATE : ADMIN_PRODUCTS.FORM_SAVE}
          </button>
        </div>
      </form>
    </Modal>
  );
}
