/**
 * Constantes de la gestión de productos de admin (app/admin/productos/page.tsx).
 */
export const ADMIN_PRODUCTS = {
  TITLE: 'Gestión de Productos',
  SUBTITLE: 'Agrega, edita y administra los productos del menú',
  NEW_PRODUCT_BUTTON: 'Nuevo producto',

  // ── Stats ──────────────────────────────────────────────────────────
  STATS_TOTAL: 'Total',
  STATS_AVAILABLE: 'Disponibles',
  STATS_SOLD_OUT: 'Agotados',

  // ── Búsqueda y filtros ─────────────────────────────────────────────
  SEARCH_PLACEHOLDER: 'Buscar producto...',
  FILTER_ALL: 'Todos',
  FILTER_AVAILABLE: 'Disponibles',
  FILTER_SOLD_OUT: 'Agotados',

  // ── Formulario ─────────────────────────────────────────────────────
  FORM_NAME_LABEL: 'Nombre del producto *',
  FORM_DESCRIPTION_LABEL: 'Descripción *',
  FORM_PRICE_LABEL: 'Precio (COP) *',
  FORM_CATEGORY_LABEL: 'Categoría *',
  FORM_SELECT_CATEGORY: 'Selecciona categoría',
  FORM_IMAGE_URL_LABEL: 'URL de imagen',
  FORM_IMAGE_URL_HINT: 'Opcional. Si no se proporciona, se usará una imagen por defecto.',
  FORM_IMAGE_PREVIEW_ALT: 'Vista previa',
  FORM_CANCEL: 'Cancelar',
  FORM_CREATE: 'Crear producto',
  FORM_SAVE: 'Guardar cambios',
  FORM_PLACEHOLDER_NAME: 'Ej: Hamburguesa Premium',
  FORM_PLACEHOLDER_DESCRIPTION: 'Describe los ingredientes y preparación...',
  FORM_PLACEHOLDER_IMAGE_URL: 'https://ejemplo.com/imagen.jpg',

  // ── Modales ────────────────────────────────────────────────────────
  MODAL_TITLE_NEW: 'Nuevo Producto',
  MODAL_TITLE_EDIT: 'Editar Producto',

  // ── Badges ─────────────────────────────────────────────────────────
  SOLD_OUT_BADGE: 'Agotado',
  NO_PRODUCTS: 'No se encontraron productos',

  // ── Validaciones ───────────────────────────────────────────────────
  VALIDATION_NAME_REQUIRED: 'El nombre es requerido',
  VALIDATION_DESCRIPTION_REQUIRED: 'La descripción es requerida',
  VALIDATION_PRICE_INVALID: 'Ingresa un precio válido',
  VALIDATION_CATEGORY_REQUIRED: 'Selecciona una categoría',

  // ── Confirmaciones ─────────────────────────────────────────────────
  DELETE_CONFIRM: (name: string) =>
    `¿Eliminar "${name}"? Esta acción no se puede deshacer.`,

  // ── Toasts ─────────────────────────────────────────────────────────
  TOAST_CREATED: 'Producto creado exitosamente',
  TOAST_CREATE_ERROR: 'Error al crear el producto',
  TOAST_UPDATED: 'Producto actualizado exitosamente',
  TOAST_UPDATE_ERROR: 'Error al actualizar el producto',
  TOAST_SOLD_OUT: 'Producto marcado como agotado',
  TOAST_AVAILABLE: 'Producto disponible',
  TOAST_DELETED: 'Producto eliminado',
  TOAST_AVAILABILITY_ERROR: 'Error al actualizar disponibilidad',
  TOAST_DELETE_ERROR: 'Error al eliminar el producto',
} as const;
