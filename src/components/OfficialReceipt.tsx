import React from 'react';
import { Order } from '../types/order';
import { BAKERY_INFO, STATUS_LABELS } from '../data/constants';
import { Printer, Share2, ShieldCheck, CheckCircle2, MessageCircle, Send } from 'lucide-react';
import { openCustomerWhatsAppReceipt } from '../utils/whatsapp';
import { BakeryLogo } from './BakeryLogo';

interface OfficialReceiptProps {
  order: Order;
  onClose?: () => void;
}

export const OfficialReceipt: React.FC<OfficialReceiptProps> = ({ order }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShareCustomerWhatsApp = () => {
    openCustomerWhatsAppReceipt(order);
  };

  const handleShareBakeryWhatsApp = () => {
    const text = `Hola La Viña Dulce, tengo una consulta sobre mi Nota de Pedido Nº ${order.orderNumber} a nombre de ${order.customer.name}. Fecha de entrega: ${order.deliveryDate} a las ${order.deliveryTime}.`;
    const url = `https://wa.me/593995639050?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.recibido;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Top action bar - hidden during print */}
      <div className="no-print bg-white rounded-2xl border border-pink-200 p-4 space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado de Taller:</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${statusInfo.colorClass}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
              title="Imprimir formato físico"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600" />
              <span>Imprimir Nota</span>
            </button>
            <button
              onClick={handleShareBakeryWhatsApp}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Escribir a la pastelería"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Taller</span>
            </button>
          </div>
        </div>

        {/* Dedicated Prominent Customer WhatsApp Action */}
        <div className="pt-2 border-t border-pink-100 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-950 block">
                Enviar Recibo al WhatsApp del Cliente
              </span>
              <span className="text-[11px] text-emerald-800">
                Destinatario: {order.customer.name} ({order.customer.phone})
              </span>
            </div>
          </div>

          <button
            onClick={handleShareCustomerWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar Recibo WhatsApp</span>
          </button>
        </div>
      </div>

      {/* THE PHYSICAL NOTA DE PEDIDO REPLICA */}
      <div className="receipt-printable bg-white border border-stone-300 rounded-xl shadow-lg p-6 sm:p-8 text-stone-900 relative">
        {/* UPPER SLIP: COMPROBANTE DE PAGO Y CLIENTE */}
        <div className="pb-6">
          <div className="flex items-start justify-between border-b border-stone-300 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <BakeryLogo variant="horizontal" size="md" showSubtitle={false} showTomaPedidos={true} />
              <div className="sm:border-l sm:border-stone-200 sm:pl-3 text-[11px] text-stone-600">
                <p className="font-medium text-stone-700">
                  {BAKERY_INFO.subtitle}
                </p>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  📍 {BAKERY_INFO.address}
                </p>
                <p className="text-[11px] font-bold text-stone-800 mt-0.5 flex items-center gap-1 font-mono">
                  📞 {BAKERY_INFO.phone}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-stone-900 text-white text-[11px] font-bold tracking-wider px-3 py-1 rounded-sm uppercase">
                NOTA DE PEDIDO
              </div>
              <div className="mt-2 receipt-stamp-number text-lg sm:text-xl">
                Nº {order.orderNumber}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                Copia Cliente
              </div>
            </div>
          </div>

          {/* Customer and financial details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-4 text-xs">
            <div className="space-y-2">
              <div className="flex items-baseline border-b border-stone-200 pb-1">
                <span className="font-bold text-stone-700 min-w-[70px]">Sr. (es):</span>
                <span className="font-medium text-stone-900 truncate">{order.customer.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b border-stone-200 pb-1">
                <div className="flex items-baseline">
                  <span className="font-bold text-stone-700 mr-1.5">RUC/CI:</span>
                  <span className="font-mono text-stone-900">{order.customer.idNumber || 'Consumidor Final'}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-bold text-stone-700 mr-1.5">Teléf:</span>
                  <span className="font-mono text-stone-900">{order.customer.phone}</span>
                </div>
              </div>
              <div className="flex items-baseline border-b border-stone-200 pb-1">
                <span className="font-bold text-stone-700 min-w-[70px]">Entrega:</span>
                <span className="text-stone-900 truncate font-semibold">
                  Retiro en Tienda (18 de Noviembre 211-11 y Mercadillo)
                </span>
              </div>
            </div>

            {/* Delivery Date & Financial Summary */}
            <div className="space-y-2 bg-stone-50 p-3 rounded-lg border border-stone-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-stone-500 block">Fecha Entrega:</span>
                  <span className="font-bold text-stone-900 text-xs">{order.deliveryDate}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-stone-500 block">Hora:</span>
                  <span className="font-bold text-stone-900 text-xs">{order.deliveryTime}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-700">Valor Total:</span>
                  <span className="font-bold font-mono text-stone-900">${order.financials.totalValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-pink-700 font-semibold">
                  <span>Abono (Anticipo):</span>
                  <span className="font-bold font-mono">-${order.financials.depositPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-dashed border-stone-300 font-bold">
                  <span className={order.financials.balanceDue > 0 ? 'text-amber-800' : 'text-stone-700'}>
                    Saldo Pendiente:
                  </span>
                  <span className={`font-mono text-sm ${order.financials.balanceDue > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    ${order.financials.balanceDue.toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 text-[11px] space-y-0.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Forma de Pago:</span>
                    <span className="font-bold text-stone-900 uppercase">
                      {order.financials.paymentMethod === 'efectivo' && 'EFECTIVO'}
                      {order.financials.paymentMethod === 'ahorita' && 'AHORITA BANCO DE LOJA'}
                      {order.financials.paymentMethod === 'deuna' && 'DE UNA BANCO PICHINCHA'}
                      {order.financials.paymentMethod === 'pago_mego' && 'PAGO MEGO'}
                      {order.financials.paymentMethod === 'jep_fast' && 'JEP FAST'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Nº Transacción / Ref:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {order.financials.paymentReference || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Warning Text - Exact copy from original receipt */}
          <div className="mt-4 p-2.5 bg-stone-100 rounded border border-stone-200 text-[10px] leading-relaxed text-stone-700 font-medium">
            <p className="font-bold mb-0.5 text-stone-900">
              TÉRMINOS Y CONDICIONES DE PEDIDO:
            </p>
            {BAKERY_INFO.legalWarning}
          </div>

          {/* Payment Methods Banner with the 5 official channels */}
          <div className="mt-3 border-t border-stone-200 pt-3 space-y-2">
            <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wide">
              {BAKERY_INFO.acceptedPaymentMethods}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-stone-700 font-mono">
              <span className="px-2 py-0.5 bg-stone-100 border border-stone-300 text-stone-800 rounded">💵 EFECTIVO</span>
              <span className="px-2 py-0.5 bg-purple-100 border border-purple-200 text-purple-800 rounded">🟣 AHORITA BANCO DE LOJA</span>
              <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded">🟢 DE UNA BANCO PICHINCHA</span>
              <span className="px-2 py-0.5 bg-sky-100 border border-sky-200 text-sky-800 rounded">🔵 PAGO MEGO</span>
              <span className="px-2 py-0.5 bg-amber-100 border border-amber-200 text-amber-900 rounded">🟡 JEP FAST</span>
            </div>
          </div>
        </div>

        {/* PERFORATED CUT LINE */}
        <div className="relative my-6 py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-dashed border-stone-300"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono text-stone-600 bg-white px-3 w-fit mx-auto">
            ✂ Desprender por la línea punteada · Orden de Taller
          </div>
        </div>

        {/* LOWER SLIP: ORDEN DE TALLER / PASTELERÍA */}
        <div className="border-2 border-stone-800 rounded-lg p-5 bg-white space-y-4">
          <div className="flex justify-between items-center border-b-2 border-stone-800 pb-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <BakeryLogo variant="icon" size="sm" />
              <span className="bg-stone-900 text-white text-[11px] font-bold px-3 py-1 rounded-sm uppercase tracking-wide">
                NOTA DE PEDIDO · TOMA PEDIDOS
              </span>
              <span className="text-xs font-semibold text-stone-600 uppercase">
                (Control de Pastelería)
              </span>
            </div>
            <div className="receipt-stamp-number text-lg font-bold">
              Nº {order.orderNumber}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div className="flex items-baseline border-b border-stone-300 pb-1">
              <span className="font-bold text-stone-800 min-w-[60px]">Sr. (es):</span>
              <span className="text-stone-900 font-medium truncate">{order.customer.name}</span>
            </div>
            <div className="flex items-baseline border-b border-stone-300 pb-1">
              <span className="font-bold text-stone-800 min-w-[65px]">MOTIVO:</span>
              <span className="text-stone-900 font-semibold uppercase">{order.cake.occasion}</span>
            </div>
          </div>

          {/* Counts and molds strip */}
          <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded border border-stone-200 text-xs">
            <div>
              <span className="font-bold text-stone-700 block text-[10px] uppercase">#Pasteles</span>
              <span className="text-sm font-bold text-stone-900">{order.cake.cakeCount}</span>
            </div>
            <div>
              <span className="font-bold text-stone-700 block text-[10px] uppercase">#Porciones</span>
              <span className="text-sm font-bold text-stone-900">{order.cake.portions}</span>
            </div>
            <div>
              <span className="font-bold text-stone-700 block text-[10px] uppercase">#Molde(s)</span>
              <span className="text-xs font-medium text-stone-900 truncate block">{order.cake.moldType}</span>
            </div>
          </div>

          {/* MASA (Vainilla, Chocolate, Mixta, Otra) and SHAPE checklist matching physical format */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-stone-50 p-3 rounded border border-stone-200 text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center font-bold text-[10px] ${order.cake.dough === 'Vainilla' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-400 bg-white'}`}>
                {order.cake.dough === 'Vainilla' ? '✓' : ''}
              </div>
              <span className="font-medium">Vainilla</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center font-bold text-[10px] ${order.cake.dough === 'Chocolate' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-400 bg-white'}`}>
                {order.cake.dough === 'Chocolate' ? '✓' : ''}
              </div>
              <span className="font-medium">Chocolate</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center font-bold text-[10px] ${order.cake.dough === 'Mixta' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-400 bg-white'}`}>
                {order.cake.dough === 'Mixta' ? '✓' : ''}
              </div>
              <span className="font-medium">Mixta</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center font-bold text-[10px] ${order.cake.dough === 'Otra' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-400 bg-white'}`}>
                {order.cake.dough === 'Otra' ? '✓' : ''}
              </div>
              <span className="font-medium truncate" title={order.cake.customDoughText || 'Otra'}>
                {order.cake.customDoughText ? `Otra: ${order.cake.customDoughText}` : 'Otra'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center font-bold text-[10px] ${order.cake.shape === 'Redondo' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-400 bg-white'}`}>
                {order.cake.shape === 'Redondo' ? '✓' : ''}
              </div>
              <span className="font-medium">Redondo</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center font-bold text-[10px] ${order.cake.shape === 'Cuadrado' || order.cake.shape === 'Rectangular' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-400 bg-white'}`}>
                {order.cake.shape === 'Cuadrado' || order.cake.shape === 'Rectangular' ? '✓' : ''}
              </div>
              <span className="font-medium">{order.cake.shape}</span>
            </div>
          </div>

          {/* Rellenos */}
          <div className="text-xs border-b border-stone-200 pb-2">
            <span className="font-bold text-stone-800">Rellenos: </span>
            <span className="text-stone-900 font-medium">
              {order.cake.fillings.length > 0 ? order.cake.fillings.join(' · ') : 'Sin relleno'}
            </span>
          </div>

          {/* Checkboxes: Papel comestible, Topper personalizados, Otros especifique */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs bg-stone-50 p-2.5 rounded border border-stone-200">
            <label className="flex items-center gap-2 cursor-default">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center font-bold text-[10px] ${order.cake.hasEdiblePaper ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-400 bg-white'}`}>
                {order.cake.hasEdiblePaper ? '✓' : ''}
              </div>
              <span className="font-semibold text-stone-800">Papel Comestible</span>
            </label>

            <label className="flex items-center gap-2 cursor-default">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center font-bold text-[10px] ${order.cake.hasTopper ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-400 bg-white'}`}>
                {order.cake.hasTopper ? '✓' : ''}
              </div>
              <span className="font-semibold text-stone-800">Topper Personalizado</span>
            </label>

            <label className="flex items-center gap-2 cursor-default">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center font-bold text-[10px] ${order.cake.hasCustomTopper ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-400 bg-white'}`}>
                {order.cake.hasCustomTopper ? '✓' : ''}
              </div>
              <span className="font-semibold text-stone-800">Otro Topper</span>
            </label>
          </div>

          {/* Decoración details with paper ruled style */}
          <div className="space-y-1 text-xs">
            <span className="font-bold text-stone-800">Decoración:</span>
            <div className="bg-stone-50/70 p-3 rounded border border-stone-200 space-y-2 text-stone-800 font-sans leading-relaxed">
              <p className="italic">
                {order.cake.decorationNotes || 'Diseño según motivo.'}
              </p>
              {order.cake.topperText && (
                <p className="text-[11px] text-pink-900 font-medium">
                  <strong>Texto de Topper:</strong> "{order.cake.topperText}"
                </p>
              )}
              {order.cake.customTopperText && (
                <p className="text-[11px] text-purple-900 font-medium">
                  <strong>Otro Topper (Especifique):</strong> "{order.cake.customTopperText}"
                </p>
              )}
            </div>
          </div>

          {/* Mensaje & Entrega */}
          <div className="pt-2 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-bold text-stone-800 block text-[10px] uppercase">Mensaje en el pastel:</span>
              <span className="text-stone-900 italic font-medium">
                "{order.cake.cakeMessage || 'Sin texto'}"
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] uppercase text-stone-500 block">Fecha:</span>
                <span>{order.deliveryDate}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-stone-500 block">Hora:</span>
                <span>{order.deliveryTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security watermark footer */}
        <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between text-[10px] text-stone-700">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
            <span>Documento Oficial Electrónico · La Viña Dulce Loja · Transacción Cifrada</span>
          </div>
          <span className="font-mono">Ref: {order.financials.paymentReference || 'VENTANILLA-LOJA'}</span>
        </div>
      </div>

      {/* Bottom Dispatch Action Bar - Hidden during print */}
      <div className="no-print bg-white rounded-2xl border border-pink-200 p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-serif-title font-bold text-slate-900 text-sm">
              ¿Deseas enviar el comprobante al cliente?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Envía el desglose completo de la Nota de Pedido Nº {order.orderNumber} con un solo toque al WhatsApp registrado.
            </p>
          </div>

          <button
            onClick={handleShareCustomerWhatsApp}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar al WhatsApp ({order.customer.phone})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
