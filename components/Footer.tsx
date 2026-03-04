"use client";

import Link from "next/link";
import { MapPin, Phone, Clock, MessageCircle, Shield } from "lucide-react";
import { FOOTER } from "@/constants/components/footer";
import { useStoreSettings } from "@/features/store-settings/presentation/hooks/use-store-settings-queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { StoreSchedule } from "@/features/store-settings/domain/entities/store-settings";

export function Footer() {
  const { data: storeSettings } = useStoreSettings();

  const scheduleItems: string[] = storeSettings?.schedule?.length
    ? storeSettings.schedule.map(
        (s: StoreSchedule) => `${s.days}: ${s.open} - ${s.close}`,
      )
    : [];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.svg"
                alt="Takillero"
                className="w-32 h-20 rounded-xl"
              />
            </div>
            <p className="text-gray-400">{FOOTER.DESCRIPTION}</p>
          </div>

          <div>
            <h3 className="text-white mb-4">{FOOTER.CONTACT_TITLE}</h3>
            <div className="space-y-3">
              {storeSettings?.address && (
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin size={18} className="text-orange-400 shrink-0 mt-0.5" />
                  <span style={{ whiteSpace: 'pre-line' }}>{storeSettings.address}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={18} className="text-orange-400 shrink-0" />
                <span>+57-{storeSettings?.whatsappNumber}</span>
              </div>
              <a
                href={buildWhatsAppUrl(storeSettings?.whatsappNumber ?? '')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-green-400 hover:text-green-300 transition-colors"
              >
                <MessageCircle size={18} className="shrink-0" />
                <span>{storeSettings?.whatsappNumber}</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white mb-4">{FOOTER.SCHEDULE_TITLE}</h3>
            <div className="space-y-2 text-gray-400">
              {scheduleItems.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Clock size={18} className="text-orange-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>{FOOTER.COPYRIGHT}</p>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-orange-400 transition-colors"
            style={{ fontSize: "13px" }}
          >
            <Shield size={14} /> {FOOTER.ADMIN_LINK_LABEL}
          </Link>
        </div>
      </div>
    </footer>
  );
}
