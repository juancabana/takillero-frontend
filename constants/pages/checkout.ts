/**
 * Constantes de la página de checkout (app/checkout/page.tsx).
 */
export const CHECKOUT_PAGE = {
  // ── Carrito vacío ──────────────────────────────────────────────────
  EMPTY_CART_TITLE: 'No tienes productos en el carrito',
  EMPTY_CART_CTA: 'Ir al Menu',

  // ── Pedido enviado (confirmación) ──────────────────────────────────
  ORDER_SENT_TITLE: 'Pedido Enviado',
  ORDER_SENT_DESCRIPTION: 'Tu pedido ha sido registrado y esta pendiente de confirmacion.',
  ORDER_NUMBER_LABEL: 'Tu numero de pedido es:',
  ORDER_NUMBER_COPIED: 'Numero copiado al portapapeles',
  ORDER_NUMBER_SAVE_HINT: 'Guarda este numero para dar seguimiento a tu pedido',
  TRANSFER_DATA_TITLE: 'Datos para transferencia:',
  SEND_RECEIPT_WHATSAPP: 'Enviar Comprobante por WhatsApp',
  VIEW_ORDER_STATUS: 'Ver Estado de mi Pedido',
  OPEN_WHATSAPP: 'Abrir WhatsApp',
  NEW_ORDER: 'Hacer Nuevo Pedido',

  // ── Cabecera del formulario ────────────────────────────────────────
  PAGE_TITLE: 'Finalizar Pedido',
  PAGE_SUBTITLE: 'Completa tus datos para enviar el pedido',

  // ── Paso 1: Datos personales ───────────────────────────────────────
  STEP_1_TITLE: 'Datos Personales',
  STEP_1_SUBTITLE: 'Informacion del cliente',
  LABEL_FULL_NAME: 'Nombre completo *',
  LABEL_CEDULA: 'Cedula *',
  LABEL_PHONE: 'Telefono / WhatsApp *',
  PLACEHOLDER_NAME: 'Ej: Juan Perez',
  PLACEHOLDER_CEDULA: 'Ej: 1234567890',
  PLACEHOLDER_PHONE: 'Ej: 300 123 4567',

  // ── Paso 2: Dirección de entrega ───────────────────────────────────
  STEP_2_TITLE: 'Direccion de Entrega',
  STEP_2_SUBTITLE: 'A donde llevamos tu pedido?',
  LABEL_ADDRESS: 'Direccion completa *',
  LABEL_NEIGHBORHOOD: 'Barrio *',
  LABEL_NOTES: 'Notas adicionales',
  PLACEHOLDER_ADDRESS: 'Ej: Calle 45 #23-10, Apto 302',
  PLACEHOLDER_NOTES: 'Ej: Timbre no funciona, llamar al llegar...',
  SELECT_NEIGHBORHOOD: 'Selecciona tu barrio',

  // ── Paso 3: Forma de pago ─────────────────────────────────────────
  STEP_3_TITLE: 'Forma de Pago',
  STEP_3_SUBTITLE: 'Elige como deseas pagar',
  TRANSFER_RECEIPT_HINT:
    'Al confirmar, podras enviar el comprobante por WhatsApp con tu numero de pedido.',

  // ── Resumen ────────────────────────────────────────────────────────
  ORDER_SUMMARY_TITLE: 'Resumen del Pedido',
  DELIVERY_DATA_TITLE: 'Datos de Entrega',
  SELECT_NEIGHBORHOOD_PLACEHOLDER: 'Selecciona barrio',

  // ── Verificación manual ────────────────────────────────────────────
  MANUAL_VERIFICATION_TITLE: 'Verificacion manual de pedidos',
  MANUAL_VERIFICATION_DESCRIPTION:
    'Al enviar tu pedido, recibiras un numero de pedido. Nuestro equipo lo revisara y te confirmara por WhatsApp.',

  // ── Acciones ───────────────────────────────────────────────────────
  SUBMITTING: 'Enviando...',
  SUBMIT_ORDER: 'Enviar Pedido',

  // ── Sidebar ────────────────────────────────────────────────────────
  SIDEBAR_TITLE: 'Tu Pedido',
  SIDEBAR_WHATSAPP_TITLE: 'WhatsApp del negocio',
  SIDEBAR_MANUAL_CONFIRM: 'Tu pedido sera confirmado manualmente',

  // ── Errores ────────────────────────────────────────────────────────
  ERROR_CREATE_ORDER: 'Error al crear el pedido. Intenta nuevamente.',

  // ── Plantilla mensaje WhatsApp ─────────────────────────────────────
  WA_MSG_HEADER: '🔥 *NUEVO PEDIDO',
  WA_MSG_CUSTOMER_TITLE: '👤 *Datos del cliente:*',
  WA_MSG_CUSTOMER_NAME: 'Nombre:',
  WA_MSG_CUSTOMER_CEDULA: 'Cedula:',
  WA_MSG_CUSTOMER_PHONE: 'Telefono:',
  WA_MSG_ADDRESS_TITLE: '📍 *Direccion de entrega:*',
  WA_MSG_NEIGHBORHOOD: 'Barrio:',
  WA_MSG_ORDER_TITLE: '🛒 *Pedido:*',
  WA_MSG_SUBTOTAL: '💰 Subtotal:',
  WA_MSG_DELIVERY: '🛵 Domicilio:',
  WA_MSG_TOTAL: '💵 *TOTAL:',
  WA_MSG_PAYMENT: '💳 Forma de pago:',
  WA_MSG_NOTES: '📝 Notas:',
  WA_MSG_STATUS: '⏳ *Estado: PENDIENTE DE CONFIRMACION*',
  WA_MSG_AWAITING: 'El cliente espera confirmacion de su pedido.',
} as const;
