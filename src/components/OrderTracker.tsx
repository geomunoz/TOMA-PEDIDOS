import React, { useState } from 'react';
import { Order, OrderStatus } from '../types/order';
import { STATUS_LABELS, BAKERY_INFO } from '../data/constants';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Phone,
  FileText,
  AlertCircle,
  CreditCard,
  MessageCircle,
  ChefHat,
  Sparkles,
  PackageCheck,
  Truck
} from 'lucide-react';
import { playSuccessChime } from '../utils/audio';

interface OrderTrackerProps {
  orders: Order[];
  currentOrderNumber?: string;
  onViewReceipt: (order: Order) => void;
  onPayBalance?: (orderId: string, amount: number) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  orders,
  currentOrderNumber,
  onViewReceipt,
  onPayBalance
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(currentOrderNumber || '000051404');
  const [activeOrder, setActiveOrder] = useState<Order | undefined>(() => {
    if (currentOrderNumber) {
      return orders.find(o => o.orderNumber === currentOrderNumber) || orders[0];
    }
    return orders[0];
  });
  const [isPayingBalance, setIsPayingBalance] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = orders.find(
      o =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.customer.phone.includes(query) ||
        o.customer.name.toLowerCase().includes(query)
    );

    if (found) {
      setActiveOrder(found);
    } else {
      alert(`No se encontró ningún pedido con el número o teléfono "${searchQuery}". Verifique el número de Nota de Pedido.`);
    }
  };

  const handlePayRemainingBalance = () => {
    if (!activeOrder) return;
    setIsPayingBalance(true);
    setTimeout(() => {
      setIsPayingBalance(false);
      playSuccessChime();
      if (onPayBalance) {
        onPayBalance(activeOrder.id, activeOrder.financials.balanceDue);
      }
      activeOrder.financials.depositPaid = activeOrder.financials.totalValue;
      activeOrder.financials.balanceDue = 0;
      activeOrder.financials.isPaidInFull = true;
      activeOrder.statusHistory.push({
        status: activeOrder.status,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        comment: 'Saldo restante pagado con éxito mediante pasarela digital.',
        updatedBy: 'Cliente Móvil'
      });
      alert(`¡Saldo restante cancelado con éxito! Tu pedido #${activeOrder.orderNumber} está 100% pagado.`);
    }, 1000);
  };

  // Milestone stages
  const STAGES: { status: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { status: 'recibido', label: 'Nota Registrada', icon: FileText },
    { status: 'anticipo_confirmado', label: 'Anticipo Confirmado', icon: CheckCircle2 },
    { status: 'en_horneado', label: 'En Horneado', icon: ChefHat },
    { status: 'en_decoracion', label: 'En Decoración', icon: Sparkles },
    { status: 'control_calidad', label: 'Control de Calidad', icon: PackageCheck },
    { status: 'listo_despacho', label: 'Listo para Entrega', icon: Truck },
    { status: 'entregado', label: 'Entregado', icon: CheckCircle2 },
  ];

  const currentStep = activeOrder ? (STATUS_LABELS[activeOrder.status]?.step || 1) : 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-wider text-amber-900 uppercase">
            Rastreo en Tiempo Real
          </span>
          <h2 className="font-serif-title text-2xl font-bold text-stone-900 mt-1">
            Seguimiento de tu Pastel Artesanal
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Ingresa tu <strong>Nº de Nota de Pedido</strong> (ej. <em>000051404</em>) o número de teléfono registrado.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mt-4 flex gap-2 max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar Nº 000051404 o teléfono..."
              className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:outline-none font-mono"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
          >
            Consultar
          </button>
        </form>

        {/* Quick select buttons from existing orders */}
        <div className="flex items-center gap-2 mt-4 text-xs overflow-x-auto pb-1">
          <span className="text-stone-500 shrink-0">Pedidos recientes:</span>
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setActiveOrder(o);
                setSearchQuery(o.orderNumber);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer shrink-0 ${
                activeOrder?.id === o.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              #{o.orderNumber}
            </button>
          ))}
        </div>
      </div>

      {activeOrder ? (
        <div className="space-y-6">
          {/* Main Status Hero Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Nota de Pedido
                  </span>
                  <span className="receipt-stamp-number text-lg font-bold">
                    Nº {activeOrder.orderNumber}
                  </span>
                </div>
                <h3 className="font-serif-title text-xl font-bold text-stone-900 mt-0.5">
                  {activeOrder.customer.name}
                </h3>
                <p className="text-xs text-stone-500">
                  Motivo: {activeOrder.cake.occasion} · {activeOrder.cake.portions} porciones · {activeOrder.cake.dough}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewReceipt(activeOrder)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Talón Físico</span>
                </button>
                <a
                  href={`https://wa.me/593995639050?text=${encodeURIComponent(`Hola La Viña Dulce, consulto por mi orden Nº ${activeOrder.orderNumber}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Taller</span>
                </a>
              </div>
            </div>

            {/* Current Stage Indicator */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold">
                  {currentStep}
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-stone-500 block">Estado Actual</span>
                  <span className="text-base font-bold text-stone-900">
                    {STATUS_LABELS[activeOrder.status]?.label || activeOrder.status}
                  </span>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {STATUS_LABELS[activeOrder.status]?.description}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs bg-white px-3 py-2 rounded-lg border border-stone-200 shrink-0">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Fecha Comprometida</span>
                <span className="font-bold text-stone-900 text-sm">
                  {activeOrder.deliveryDate} · {activeOrder.deliveryTime}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {activeOrder.deliveryType === 'delivery' ? 'Entrega a domicilio' : 'Retiro en mostrador Loja'}
                </span>
              </div>
            </div>

            {/* Interactive Timeline Stepper */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Progreso del Taller en Vivo
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {STAGES.map((stg, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = stepNum < currentStep;
                  const isCurrent = stepNum === currentStep;
                  const Icon = stg.icon;

                  return (
                    <div
                      key={stg.status}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'border-stone-900 bg-stone-900 text-white shadow-md ring-2 ring-stone-900/20'
                          : isCompleted
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                          : 'border-stone-200 bg-stone-50/60 text-stone-400'
                      }`}
                    >
                      <div className="flex justify-center mb-1.5">
                        <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-700' : 'text-stone-400'}`} />
                      </div>
                      <span className="text-[10px] font-bold block leading-tight">
                        {stg.label}
                      </span>
                      <span className="text-[9px] block mt-0.5 opacity-80">
                        {isCompleted ? 'Listo ✓' : isCurrent ? 'En proceso' : 'Pendiente'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Cake Specifications & Photo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-200">
              <div className="md:col-span-1 rounded-xl overflow-hidden border border-stone-200 relative aspect-4/3 bg-stone-100">
                <img
                  src={activeOrder.cake.referencePhotoUrl || BAKERY_INFO.address}
                  alt={activeOrder.cake.occasion}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 p-2 text-white text-[11px] font-medium">
                  Estilo: {activeOrder.cake.shape} · {activeOrder.cake.dough}
                </div>
              </div>

              <div className="md:col-span-2 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div>
                    <span className="font-bold text-stone-500 uppercase text-[10px] block">Rellenos Seleccionados:</span>
                    <span className="font-semibold text-stone-900">
                      {activeOrder.cake.fillings.join(', ') || 'Tradicional'}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-500 uppercase text-[10px] block">Molde de Horneado:</span>
                    <span className="font-semibold text-stone-900">{activeOrder.cake.moldType}</span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-700 block">Detalles de Decoración y Acabado:</span>
                  <p className="text-stone-800 leading-relaxed italic">
                    "{activeOrder.cake.decorationNotes}"
                  </p>
                  {activeOrder.cake.cakeMessage && (
                    <div className="pt-1 text-stone-900">
                      <strong>Mensaje en el pastel:</strong> "{activeOrder.cake.cakeMessage}"
                    </div>
                  )}
                  {activeOrder.cake.topperText && (
                    <div className="text-purple-900">
                      <strong>Topper personalizado:</strong> "{activeOrder.cake.topperText}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Status and Pending Balance Payment */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-stone-700 uppercase">Estado Financiero</span>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span>Total: <strong>${activeOrder.financials.totalValue.toFixed(2)}</strong></span>
                    <span className="text-emerald-700">Abono: <strong>${activeOrder.financials.depositPaid.toFixed(2)}</strong></span>
                    <span className={activeOrder.financials.balanceDue > 0 ? 'text-amber-800' : 'text-stone-600'}>
                      Saldo: <strong>${activeOrder.financials.balanceDue.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                {activeOrder.financials.balanceDue > 0 ? (
                  <button
                    onClick={handlePayRemainingBalance}
                    disabled={isPayingBalance}
                    className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>
                      {isPayingBalance ? 'Liquidando...' : `Pagar Saldo Restante ($${activeOrder.financials.balanceDue.toFixed(2)})`}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs bg-emerald-100 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pagado en su Totalidad (100%)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Historical Status Logs */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Bitácora de Actualizaciones en Tiempo Real
              </span>
              <div className="space-y-2">
                {activeOrder.statusHistory.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border border-stone-200 text-xs flex items-start justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">
                          {STATUS_LABELS[log.status]?.label || log.status}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">por {log.updatedBy}</span>
                      </div>
                      <p className="text-stone-600">{log.comment}</p>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono whitespace-nowrap">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
          No se encontró el pedido consultado. Por favor verifique el número en su comprobante o consulte a la pastelería.
        </div>
      )}
    </div>
  );
};
