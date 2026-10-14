import React from 'react';
import { ShieldCheck, Bell, ClipboardCheck } from 'lucide-react';
import { BAKERY_INFO } from '../data/constants';
import { BakeryLogo } from './BakeryLogo';

interface HeaderProps {
  activeTab: 'builder' | 'receipt' | 'admin';
  onSelectTab: (tab: 'builder' | 'receipt' | 'admin') => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenSecurity: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenSecurity
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-2 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: Prominent Official Bakery Logo with VD mascot and TOMA PEDIDOS label */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <button
            onClick={() => onSelectTab('builder')}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group cursor-pointer hover:opacity-95 transition-opacity"
            title="La Viña Dulce - Toma Pedidos"
          >
            <BakeryLogo variant="horizontal" size="md" showSubtitle={true} />
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-[#f45b96] via-pink-500 to-[#00b4d8] text-white font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-md border border-white/60 ring-2 ring-pink-300">
              <ClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
              <span className="font-extrabold whitespace-nowrap">TOMA PEDIDOS</span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation links (Seguimiento eliminated) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => onSelectTab('builder')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'builder'
                ? 'text-pink-600 font-bold border-b-2 border-pink-500 py-1'
                : 'hover:text-pink-600'
            }`}
          >
            Personalizar
          </button>
          <button
            onClick={() => onSelectTab('receipt')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'receipt'
                ? 'text-pink-600 font-bold border-b-2 border-pink-500 py-1'
                : 'hover:text-pink-600'
            }`}
          >
            Nota de Pedido
          </button>
          <button
            onClick={() => onSelectTab('admin')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'admin'
                ? 'text-sky-600 font-bold border-b-2 border-sky-500 py-1'
                : 'hover:text-sky-600'
            }`}
          >
            Panel Taller
          </button>
        </nav>

        {/* Zone 3: 1 primary action + notification and security trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSecurity}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer border border-sky-100"
            title="Seguridad y Protección de Datos"
          >
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            <span className="hidden lg:inline text-[11px] font-semibold">Cifrado E2EE</span>
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer border border-pink-100"
            title="Notificaciones de Taller"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('builder')}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#f45b96] to-[#00b4d8] rounded-xl hover:opacity-95 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs active:scale-95"
          >
            Nuevo Pedido
          </button>
        </div>
      </div>
    </header>
  );
};
