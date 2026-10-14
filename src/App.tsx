import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CakeBuilder } from './components/CakeBuilder';
import { OfficialReceipt } from './components/OfficialReceipt';
import { AdminPanel } from './components/AdminPanel';
import { SecurityModal } from './components/SecurityModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { BakeryLogo } from './components/BakeryLogo';
import { Order, OrderStatus, NotificationItem } from './types/order';
import { INITIAL_ORDERS, BAKERY_INFO, STATUS_LABELS } from './data/constants';
import { Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vina_dulce_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  // Tracking tab eliminated: activeTab is 'builder' | 'receipt' | 'admin'
  const [activeTab, setActiveTab] = useState<'builder' | 'receipt' | 'admin'>('builder');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order>(orders[0]);

  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      orderId: 'ord-000051404',
      orderNumber: '000051404',
      title: 'Pastel en Decoración',
      message: 'Tu pastel para Sofía está recibiendo los acabados en crema y topper.',
      timestamp: '14:15',
      read: false,
      type: 'status_update'
    },
    {
      id: 'notif-2',
      orderId: 'ord-000051406',
      orderNumber: '000051406',
      title: 'Listo para Retiro',
      message: 'Pastel de cumpleaños terminado y listo en vitrina fría de Loja.',
      timestamp: '10:30',
      read: true,
      type: 'status_update'
    }
  ]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('vina_dulce_orders', JSON.stringify(orders));
  }, [orders]);

  // Handler when a new order is completed in CakeBuilder
  const handleOrderCreated = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setSelectedReceiptOrder(newOrder);

    // Add new notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      title: 'Nota de Pedido Creada',
      message: `Nota Nº ${newOrder.orderNumber} confirmada con abono de $${newOrder.financials.depositPaid.toFixed(2)}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'payment_confirmed'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handler when viewing physical receipt
  const handleViewReceipt = (order: Order) => {
    setSelectedReceiptOrder(order);
    setActiveTab('receipt');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler when an admin advances status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, comment: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
          const updatedLogs = [
            ...ord.statusHistory,
            {
              status: newStatus,
              timestamp: nowStr,
              comment,
              updatedBy: 'Taller Loja'
            }
          ];

          // Trigger notification
          const statusMeta = STATUS_LABELS[newStatus];
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            orderId: ord.id,
            orderNumber: ord.orderNumber,
            title: statusMeta?.label || 'Actualización de Pedido',
            message: comment,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false,
            type: 'status_update'
          };
          setNotifications(nPrev => [newNotif, ...nPrev]);

          return {
            ...ord,
            status: newStatus,
            statusHistory: updatedLogs,
            updatedAt: nowStr
          };
        }
        return ord;
      })
    );
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf5f8] text-slate-800 selection:bg-pink-100 selection:text-pink-900">
      {/* Top Bar with pastel pink and sky blue elements */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {/* Banner with artisanal heritage in signature logo colors (Candy Pink & Celeste) */}
        <div className="no-print mb-6 bg-gradient-to-r from-[#f45b96] via-[#ec4899] to-[#00b4d8] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-pink-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-sm border border-white/80 flex items-center justify-center shrink-0">
                <BakeryLogo variant="icon" size="sm" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="font-script-brand font-black text-xl sm:text-2xl text-white tracking-wide drop-shadow-xs"
                    style={{ color: '#ffffff' }}
                  >
                    La Viña Dulce
                  </span>
                  <span className="text-pink-100 text-xs hidden sm:inline">·</span>
                  <span className="text-xs text-white/95 hidden sm:inline">
                    {BAKERY_INFO.address}
                  </span>
                </div>
                <p className="text-[11px] text-white/90 mt-0.5">
                  Pastelería personalizada de acuerdo al formato oficial de Nota de Pedido física y digital.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/593995639050?text=${encodeURIComponent('Hola La Viña Dulce, deseo realizar una consulta sobre los pasteles personalizados.')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-pink-700 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-pink-600" />
                <span>WhatsApp: 0995639050</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tab view routing (Seguimiento eliminated) */}
        {activeTab === 'builder' && (
          <CakeBuilder
            onOrderCreated={handleOrderCreated}
            onViewReceipt={handleViewReceipt}
          />
        )}

        {activeTab === 'receipt' && (
          <OfficialReceipt
            order={selectedReceiptOrder}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onViewReceipt={handleViewReceipt}
          />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Tab Bar */}
      <MobileBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Real-time Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onSelectNotification={(orderNumber) => {
          const match = orders.find(o => o.orderNumber === orderNumber);
          if (match) {
            handleViewReceipt(match);
          }
        }}
      />

      {/* Security & Confidentiality Modal */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Footer in pastel theme */}
      <footer className="no-print mt-auto border-t border-pink-100 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-700">
            <BakeryLogo variant="horizontal" size="xs" showSubtitle={false} />
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{BAKERY_INFO.address}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="hover:text-pink-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>Cifrado E2EE & Datos Seguros</span>
            </button>
            <span>·</span>
            <span>Políticas de Anticipo ($5.00)</span>
            <span>·</span>
            <span>📞 0995639050</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
