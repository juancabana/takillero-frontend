import Link from 'next/link';
import { MapPin, Phone, Clock, MessageCircle, Shield } from 'lucide-react';

export function Footer() {
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
            <p className="text-gray-400">
              La mejor comida rápida de la ciudad. Preparada con amor y los mejores ingredientes.
            </p>
          </div>

          <div>
            <h3 className="text-white mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} className="text-orange-400 shrink-0" />
                <span>Cra 15 #45-20, Barrio Centro, Bogotá</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={18} className="text-orange-400 shrink-0" />
                <span>+57 300 123 4567</span>
              </div>
              <a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-green-400 hover:text-green-300 transition-colors"
              >
                <MessageCircle size={18} className="shrink-0" />
                <span>WhatsApp: 300 123 4567</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white mb-4">Horarios</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-orange-400 shrink-0" />
                <span>Lun - Jue: 4:00 PM - 11:00 PM</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-orange-400 shrink-0" />
                <span>Vie - Sáb: 4:00 PM - 1:00 AM</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-orange-400 shrink-0" />
                <span>Domingos: 12:00 PM - 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Takillero. Todos los derechos reservados.</p>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-orange-400 transition-colors"
            style={{ fontSize: '13px' }}
          >
            <Shield size={14} /> Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
