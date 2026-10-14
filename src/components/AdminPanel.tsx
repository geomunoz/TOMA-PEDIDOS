import React, { useState } from 'react';
import { Order, OrderStatus } from '../types/order';
import { STATUS_LABELS } from '../data/constants';
import {
  FileText,
  Search,
  ChevronRight,
  MessageCircle,
  Eye,
  Printer
} from 'lucide-react';
import { playNotificationDing } from '../utils/audio';
import { openCustomerWhatsAppReceipt } from '../utils/whatsapp';
import { BakeryLogo } from './BakeryLogo';
import { PosPrinterModal } from './PosPrinterModal';

interface AdminPanelProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, comment: string) => void;
  onViewReceipt: (order: Order) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  onUpdateOrderStatus,
  onViewReceipt
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPosOrder, setSelectedPosOrder] = useState<Order | null>(null);
  const [isPosModalOpen, setIsPosModalOpen] = useState<boolean>(false);

  // Financial and status aggregations
  const totalOrders = orders.length;
  const inProduction = orders.filter(o => o.status === 'en_horneado' || o.status === 'en_decoracion').length;
  const readyForPickup = orders.filter(o => o.status === 'listo_despacho').length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.financials.totalValue, 0);
  const totalDeposits = orders.reduce((acc, o) => acc + o.financials.depositPaid, 0);
  const totalBalanceDue = orders.reduce((acc, o) => acc + o.financials.balanceDue, 0);

  // Filtering
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      order.orderNumber.includes(searchTerm) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm) ||
      order.cake.occasion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'recibido':
        return 'anticipo_confirmado';
      case 'anticipo_confirmado':
        return 'en_horneado';
      case 'en_horneado':
        return 'en_decoracion';
      case 'en_decoracion':
        return 'control_calidad';
      case 'control_calidad':
        return 'listo_despacho';
      case 'listo_despacho':
        return 'entregado';
      default:
        return null;
    }
  };

  const handleAdvanceStatus = (order: Order) => {
    const next = getNextStatus(order.status);
    if (!next) return;

    let comment = `Estado actualizado a ${STATUS_LABELS[next]?.label} por taller.`;
    if (next === 'en_horneado') comment = `Masa ${order.cake.dough} en proceso de horneado.`;
    if (next === 'en_decoracion') comment = `Masa enfriada, aplicando rellenos (${order.cake.fillings.join(', ')}).`;
    if (next === 'control_calidad') comment = 'Decoración completada. Inspección de calidad y refrigeración.';
    if (next === 'listo_despacho') comment = 'Pastel listo y empacado para entrega al cliente.';
    if (next === 'entregado') comment = 'Pastel entregado satisfactoriamente.';

    playNotificationDing();
    onUpdateOrderStatus(order.id, next, comment);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header and summary metrics in pastel theme */}
      <div className="bg-gradient-to-r from-pink-50 via-white to-sky-50 rounded-2xl border border-pink-200/80 p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pink-100 pb-5">
          <div className="flex items-center gap-3">
            <BakeryLogo variant="horizontal" size="md" showSubtitle={false} showTomaPedidos={true} />
            <div>
              <span className="text-xs font-bold tracking-wider text-[#f45b96] bg-pink-100/80 px-2.5 py-0.5 rounded-full uppercase border border-pink-200">
                Taller & Mostrador Loja
              </span>
              <h2 className="font-serif-title text-2xl font-bold text-slate-800 mt-1">
                Panel Administrativo de Pedidos
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Gestión de notas de pedido, avance de producción en pastelería y registro de cobros.
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono bg-white px-3 py-1.5 rounded-lg border border-pink-100">
            {new Date().toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* 4-KPI Metric Row with pastel accents */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Total Notas Activas</span>
            <span className="text-2xl font-bold font-mono text-slate-900 block mt-1">{totalOrders}</span>
            <span className="text-[10px] text-pink-600 font-medium">Registradas en sistema</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500 block">En Producción Taller</span>
            <span className="text-2xl font-bold font-mono text-pink-600 block mt-1">{inProduction}</span>
            <span className="text-[10px] text-slate-500">Horneando o decorando</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Listos para Entrega</span>
            <span className="text-2xl font-bold font-mono text-sky-600 block mt-1">{readyForPickup}</span>
            <span className="text-[10px] text-slate-500">En vitrina refrigerada</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Saldos por Cobrar</span>
            <span className="text-2xl font-bold font-mono text-slate-900 block mt-1">${totalBalanceDue.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500">A liquidar al retirar</span>
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'anticipo_confirmado', label: 'Confirmados' },
            { id: 'en_horneado', label: 'Horneando' },
            { id: 'en_decoracion', label: 'Decoración' },
            { id: 'listo_despacho', label: 'Listos' },
            { id: 'entregado', label: 'Entregados' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-xs font-bold'
                  : 'bg-slate-50 text-slate-700 hover:bg-pink-50 border border-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Nº, cliente o teléfono..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-pink-100 p-8 text-center text-slate-500 text-sm">
            No se encontraron pedidos con los criterios seleccionados.
          </div>
        ) : (
          filteredOrders.map(order => {
            const statusMeta = STATUS_LABELS[order.status] || STATUS_LABELS.recibido;
            const nextStatus = getNextStatus(order.status);
            const nextStatusMeta = nextStatus ? STATUS_LABELS[nextStatus] : null;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-pink-100/90 p-5 shadow-sm space-y-4 hover:border-pink-300 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="receipt-stamp-number text-base font-bold">
                        Nº {order.orderNumber}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${statusMeta.colorClass}`}>
                        {statusMeta.label}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {order.deliveryType === 'delivery' ? 'Domicilio' : 'Retiro en Local'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                      <span>{order.customer.name}</span>
                      <span className="text-xs font-normal text-slate-500 font-mono">
                        ({order.customer.phone})
                      </span>
                    </h4>
                  </div>

                  {/* Financial mini badge */}
                  <div className="text-right text-xs font-mono bg-pink-50/50 px-3 py-1.5 rounded-lg border border-pink-100">
                    <div className="text-slate-700">
                      Total: <strong>${order.financials.totalValue.toFixed(2)}</strong>
                    </div>
                    <div className="text-pink-600">
                      Abono: <strong>${order.financials.depositPaid.toFixed(2)}</strong>
                    </div>
                    {order.financials.balanceDue > 0 ? (
                      <div className="text-sky-700 font-bold">
                        Saldo: ${order.financials.balanceDue.toFixed(2)}
                      </div>
                    ) : (
                      <div className="text-emerald-600 font-bold">Saldo: $0.00 ✓</div>
                    )}
                  </div>
                </div>

                {/* Cake specifications summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-r from-pink-50/30 to-sky-50/30 p-3 rounded-xl border border-pink-100/80 text-xs">
                  <div>
                    <span className="text-slate-500 uppercase text-[10px] block font-bold">Motivo & Masa:</span>
                    <span className="font-semibold text-slate-900">{order.cake.occasion}</span>
                    <span className="text-pink-600 block text-[11px] font-medium">
                      Masa {order.cake.dough === 'Otra' && order.cake.customDoughText ? order.cake.customDoughText : order.cake.dough} · {order.cake.shape}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase text-[10px] block font-bold">Porciones / Molde:</span>
                    <span className="font-semibold text-slate-900">{order.cake.portions} porciones</span>
                    <span className="text-slate-600 block text-[11px] truncate">{order.cake.moldType}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase text-[10px] block font-bold">Rellenos:</span>
                    <span className="font-semibold text-slate-900 line-clamp-1">
                      {order.cake.fillings.join(', ') || 'Sin relleno'}
                    </span>
                    <span className="text-sky-700 text-[10px] block font-medium">
                      {order.cake.hasTopper ? 'Topper' : ''}
                      {order.cake.hasEdiblePaper ? ' · Papel' : ''}
                      {order.cake.hasCustomTopper ? ' · Otro Topper' : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase text-[10px] block font-bold">Fecha / Hora Entrega:</span>
                    <span className="font-bold text-slate-900">{order.deliveryDate}</span>
                    <span className="text-slate-600 block font-mono">{order.deliveryTime}</span>
                  </div>
                </div>

                {/* Decoración excerpt */}
                {order.cake.decorationNotes && (
                  <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                    <strong>Decoración:</strong> "{order.cake.decorationNotes}"
                    {order.cake.cakeMessage && (
                      <span className="block not-italic text-slate-900 mt-0.5">
                        <strong>Mensaje:</strong> "{order.cake.cakeMessage}"
                      </span>
                    )}
                  </p>
                )}

                {/* Action buttons toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-pink-50">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => onViewReceipt(order)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Nota de Pedido</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPosOrder(order);
                        setIsPosModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                      title="Imprimir ticket térmico en impresora punto de venta"
                    >
                      <Printer className="w-3.5 h-3.5 text-sky-600" />
                      <span>Ticket POS</span>
                    </button>
                    <button
                      onClick={() => openCustomerWhatsAppReceipt(order)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 cursor-pointer"
                      title="Enviar nota de pedido completa al WhatsApp del cliente"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Enviar Recibo WhatsApp</span>
                    </button>
                  </div>

                  {/* Advance to next state button */}
                  {nextStatus && nextStatusMeta && (
                    <button
                      onClick={() => handleAdvanceStatus(order)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-pink-500 to-sky-400 hover:from-pink-600 hover:to-sky-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>Avanzar: {nextStatusMeta.label}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* POS Printer Modal in Admin Panel */}
      {selectedPosOrder && (
        <PosPrinterModal
          order={selectedPosOrder}
          isOpen={isPosModalOpen}
          onClose={() => {
            setIsPosModalOpen(false);
            setSelectedPosOrder(null);
          }}
        />
      )}
    </div>
  );
};
