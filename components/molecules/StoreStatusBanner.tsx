import { STORE_STATUS_BANNER } from '@/constants/components/store-status-banner';

interface StoreStatusBannerProps {
  closedMessage: string | null;
  whatsappNumber: string | null;
}

/**
 * Molecule: Banner que se muestra cuando la tienda está cerrada.
 * Se renderiza encima del contenido del homepage como overlay fijo.
 */
export function StoreStatusBanner({
  closedMessage,
  whatsappNumber,
}: StoreStatusBannerProps) {
  const message = closedMessage ?? STORE_STATUS_BANNER.DEFAULT_CLOSED_MESSAGE;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4" role="img" aria-label={STORE_STATUS_BANNER.CLOSED_ARIA_LABEL}>
          {STORE_STATUS_BANNER.CLOSED_EMOJI}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {STORE_STATUS_BANNER.CLOSED_TITLE}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">{message}</p>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition-colors duration-200"
          >
            <span aria-hidden="true">{STORE_STATUS_BANNER.WHATSAPP_EMOJI}</span>
            {STORE_STATUS_BANNER.WHATSAPP_CTA}
          </a>
        )}
      </div>
    </div>
  );
}
