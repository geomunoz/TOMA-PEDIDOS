import React from 'react';
import { NotificationItem } from '../types/order';
import { Bell, X, ArrowRight, Clock } from 'lucide-react';
import { BakeryLogo } from './BakeryLogo';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (orderNumber: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-pink-100">
        {/* Header */}
        <div className="p-4 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50 to-sky-50">
          <div className="flex items-center gap-2.5">
            <BakeryLogo variant="icon" size="xs" />
            <h3 className="font-serif-title font-bold text-slate-800 text-base">
              Notificaciones de Taller
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 bg-pink-50/40 border-b border-pink-100 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">
            {notifications.length} actualizaciones registradas
          </span>
          <button
            onClick={onMarkAllAsRead}
            className="text-pink-600 font-semibold hover:underline cursor-pointer"
          >
            Marcar leídas
          </button>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No tienes notificaciones recientes.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectNotification(item.orderNumber);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-xs space-y-1 cursor-pointer transition-all hover:border-pink-300 ${
                  item.read
                    ? 'border-slate-200 bg-white text-slate-600'
                    : 'border-pink-300 bg-pink-50/50 text-slate-900 font-medium ring-1 ring-pink-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.title}</span>
                  <span className="receipt-stamp-number text-[11px] font-bold">
                    #{item.orderNumber}
                  </span>
                </div>
                <p className="text-slate-600 leading-snug">{item.message}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-sky-500" />
                    {item.timestamp}
                  </span>
                  <span className="text-pink-600 font-semibold flex items-center gap-0.5">
                    Ver nota <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-pink-100 text-center text-[11px] text-slate-500 bg-sky-50/30">
          Notificaciones sincronizadas con WhatsApp 0995639050
        </div>
      </div>
    </div>
  );
};
