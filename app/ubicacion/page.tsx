"use client";

import { MapPin, Clock, Phone, MessageCircle, Navigation } from "lucide-react";
import { motion } from "motion/react";
import { LOCATION_PAGE } from '@/constants/pages/location';

export default function UbicacionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1
            className="text-gray-900 mb-2"
            style={{ fontSize: "32px", fontWeight: 700 }}
          >
            {LOCATION_PAGE.TITLE}
          </h1>
          <p className="text-gray-500">{LOCATION_PAGE.SUBTITLE}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe
                title={LOCATION_PAGE.MAP_TITLE}
                src={LOCATION_PAGE.MAP_EMBED_URL}
                className="w-full h-80 md:h-[450px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href={LOCATION_PAGE.MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all shadow-md"
              style={{ fontWeight: 600 }}
            >
              <Navigation size={18} /> {LOCATION_PAGE.OPEN_GOOGLE_MAPS}
            </a>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Address */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-orange-600" />
                </div>
                <h3 className="text-gray-900" style={{ fontWeight: 600 }}>
                  {LOCATION_PAGE.ADDRESS_TITLE}
                </h3>
              </div>
              <p className="text-gray-600">
                {LOCATION_PAGE.ADDRESS_LINE_1}
                <br />
                {LOCATION_PAGE.ADDRESS_LINE_2}
                <br />
                {LOCATION_PAGE.ADDRESS_LINE_3}
              </p>
              <p className="text-gray-500 mt-2" style={{ fontSize: "14px" }}>
                {LOCATION_PAGE.ADDRESS_REFERENCE} 
              </p>
            </div>

            {/* Hours */}
            {/* TODO: Obtener información real de horarios de la base de datos y mostrar si el local está abierto o cerrado en tiempo real */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900" style={{ fontWeight: 600 }}>
                    {LOCATION_PAGE.SCHEDULE_TITLE}
                  </h3>
                  <span
                    className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full"
                    style={{ fontSize: "12px", fontWeight: 500 }}
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    {LOCATION_PAGE.SCHEDULE_OPEN_NOW}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {LOCATION_PAGE.SCHEDULE.map((schedule) => (
                  <div
                    key={schedule.days}
                    className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                    style={{ fontSize: "14px" }}
                  >
                    <span className="text-gray-600">{schedule.days}</span>
                    <span className="text-gray-900" style={{ fontWeight: 500 }}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            {/* TODO: Obtener información real de contacto de la base de datos y mostrarla */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <h3 className="text-gray-900" style={{ fontWeight: 600 }}>
                  {LOCATION_PAGE.CONTACT_TITLE}
                </h3>
              </div>
              <div className="space-y-3">
                <a
                  href={LOCATION_PAGE.PHONE_HREF}
                  className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Phone size={18} />
                  {LOCATION_PAGE.PHONE_NUMBER}
                </a>
                <a
                  href={LOCATION_PAGE.WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition-all"
                  style={{ fontWeight: 600 }}
                >
                  <MessageCircle size={20} />
                  {LOCATION_PAGE.WHATSAPP_CTA}
                </a>
              </div>
            </div>

            {/* Delivery zones */}
            {/* TODO: Obtener información real de zonas de domicilio de la base de datos y mostrarla */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
              <h3 className="text-white mb-3" style={{ fontWeight: 600 }}>
                {LOCATION_PAGE.DELIVERY_ZONES_TITLE}
              </h3>
              <div className="space-y-2" style={{ fontSize: "14px" }}>
                {LOCATION_PAGE.DELIVERY_ZONES.map((zone) => (
                  <div key={zone} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>{zone}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-orange-100" style={{ fontSize: "13px" }}>
                {LOCATION_PAGE.DELIVERY_FEE_NOTE}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
