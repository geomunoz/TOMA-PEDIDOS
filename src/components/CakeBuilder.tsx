import React, { useState, useId } from 'react';
import { DoughFlavor, CakeShape, Order, PaymentMethod } from '../types/order';
import {
  BAKERY_INFO,
  DOUGH_FLAVORS,
  CAKE_SHAPES,
  AVAILABLE_FILLINGS,
  OCCASIONS,
  SUGGESTED_MOLDS,
  PORTION_OPTIONS,
  PAYMENT_METHODS_LIST
} from '../data/constants';
import { playSuccessChime } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CreditCard,
  QrCode,
  Check,
  ChevronRight,
  AlertTriangle,
  FileText,
  MessageCircle,
  CheckCircle2,
  Send,
  X,
  Store,
  Receipt,
  ClipboardCheck
} from 'lucide-react';
import { openCustomerWhatsAppReceipt } from '../utils/whatsapp';
import { BakeryLogo } from './BakeryLogo';

interface CakeBuilderProps {
  onOrderCreated: (newOrder: Order) => void;
  onViewReceipt: (order: Order) => void;
}

export const CakeBuilder: React.FC<CakeBuilderProps> = ({ onOrderCreated, onViewReceipt }) => {
  const occasionSelectId = useId();
  const cakeCountSelectId = useId();
  const deliveryTimeInputId = useId();
  const customerNameInputId = useId();
  const customerIdNumberInputId = useId();
  const customerPhoneInputId = useId();
  const customTopperTextInputId = useId();
  const customFillingInputId = useId();
  const customDoughInputId = useId();
  const customMoldInputId = useId();
  const customDepositInputId = useId();
  const totalValueInputId = useId();
  const cakeMessageInputId = useId();
  const decorationNotesInputId = useId();
  const paymentReferenceInputId = useId();

  // Builder state
  const [occasion, setOccasion] = useState<string>('Cumpleaños Infantil');
  // Dough flavors: Vainilla, Chocolate, Mixta, Otra (especifique)
  const [dough, setDough] = useState<DoughFlavor>('Vainilla');
  const [customDoughText, setCustomDoughText] = useState<string>('');
  const [shape, setShape] = useState<CakeShape>('Redondo');
  
  // Desvinculación de cantidad de pasteles y porciones
  const [cakeCount, setCakeCount] = useState<number>(1);
  const [portions, setPortions] = useState<number>(20);
  
  // Moldes sugeridos con selección múltiple
  const [selectedMolds, setSelectedMolds] = useState<string[]>(['Molde 20']);
  const [customMoldText, setCustomMoldText] = useState<string>('');
  
  // Specific fillings: Manjar, Gelatina, Durazno, CREMA MOCCA, Otros
  const [selectedFillings, setSelectedFillings] = useState<string[]>(['Manjar', 'Durazno']);
  const [customFillingText, setCustomFillingText] = useState<string>('');

  // Extras: Exact 3 Topper options (Papel comestible, Topper personalizados sin texto, Otros especifique)
  const [hasEdiblePaper, setHasEdiblePaper] = useState<boolean>(false);
  const [hasTopper, setHasTopper] = useState<boolean>(true);
  const [hasCustomTopper, setHasCustomTopper] = useState<boolean>(false);
  const [customTopperText, setCustomTopperText] = useState<string>('');
  
  const [decorationNotes, setDecorationNotes] = useState<string>(
    'Decoración en tonos rosa y celeste pastel con crema suave, bordes decorados y detalles delicados.'
  );
  const [cakeMessage, setCakeMessage] = useState<string>('¡Feliz Día!');

  // Customer info
  const [customerName, setCustomerName] = useState<string>('');
  const [customerIdNumber, setCustomerIdNumber] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  // Modalidad de entrega: Solo retiro en tienda
  const deliveryType: 'pickup' = 'pickup';

  // Dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const [deliveryDate, setDeliveryDate] = useState<string>(defaultDateStr);
  const [deliveryTime, setDeliveryTime] = useState<string>('15:30');

  // Formas de pago (Efectivo, Ahorita Banco de Loja, De Una Banco Pichincha, Pago Mego, JEP Fast)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('deuna');
  const [paymentReference, setPaymentReference] = useState<string>('TX-882194');
  
  // Desglose financiero: Valor total del pedido colocado de manera manual
  const [totalValue, setTotalValue] = useState<number>(28.00);
  const [hasManuallyEditedTotal, setHasManuallyEditedTotal] = useState<boolean>(false);
  // Abono: Únicamente opción personalizada de valor (no 50%)
  const [customDeposit, setCustomDeposit] = useState<number>(15);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(true);

  // Modal for official receipt generated with customer WhatsApp option
  const [completedOrderModal, setCompletedOrderModal] = useState<Order | null>(null);
  const [modalPhone, setModalPhone] = useState<string>('');

  const handlePortionsChange = (newPortions: number) => {
    setPortions(newPortions);
  };

  const handleShapeChange = (newShape: CakeShape) => {
    setShape(newShape);
  };

  const toggleMold = (moldName: string) => {
    if (selectedMolds.includes(moldName)) {
      setSelectedMolds(selectedMolds.filter(m => m !== moldName));
    } else {
      setSelectedMolds([...selectedMolds, moldName]);
    }
  };

  const toggleFilling = (fillingName: string) => {
    if (selectedFillings.includes(fillingName)) {
      setSelectedFillings(selectedFillings.filter(f => f !== fillingName));
    } else {
      if (selectedFillings.length >= 3) {
        alert('Puede seleccionar hasta 3 combinaciones de rellenos.');
        return;
      }
      setSelectedFillings([...selectedFillings, fillingName]);
    }
  };

  // Pricing calculations:
  // 1. Total porciones y pasteles desvinculados de precios
  // 2. Topper personalizado eliminado del desglose financiero (sin recargo adicional)
  // 3. Modalidad de entrega únicamente retiro en tienda (sin costo de envío)
  // 4. Valor total del pedido colocado de manera manual y personalizada (sin valor sugerido)

  // Deposit calculation: únicamente opción personalizada de valor (sin 50%)
  const depositPaid = Number(Math.min(totalValue, Math.max(0, customDeposit)).toFixed(2));
  const balanceDue = Number(Math.max(0, totalValue - depositPaid).toFixed(2));

  // Form submission / Payment simulation
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (totalValue <= 0) {
      alert('Por favor ingrese el Valor Total del Pedido en el desglose financiero (debe ser mayor a $0.00).');
      return;
    }
    if (!customerName.trim()) {
      alert('Por favor ingrese el nombre del cliente (Sr. / es) para la Nota de Pedido.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Por favor ingrese un número de teléfono de contacto.');
      return;
    }
    if (dough === 'Otra' && !customDoughText.trim()) {
      alert('Ha seleccionado la opción "Otra" en masa. Por favor especifique cuál masa desea.');
      return;
    }
    if (selectedMolds.length === 0) {
      alert('Por favor seleccione al menos un molde sugerido para el taller.');
      return;
    }
    if (selectedMolds.includes('Otro especifique') && !customMoldText.trim()) {
      alert('Ha seleccionado "Otro especifique" en moldes. Por favor detalle el molde deseado.');
      return;
    }
    if (selectedFillings.includes('Otros (Especifique)') && !customFillingText.trim()) {
      alert('Ha seleccionado "Otros" en rellenos. Por favor especifique cuál relleno desea.');
      return;
    }
    if (hasCustomTopper && !customTopperText.trim()) {
      alert('Ha seleccionado "Otros especifique" en Topper. Por favor detalle el topper deseado.');
      return;
    }
    if (!paymentReference.trim()) {
      alert('Por favor ingrese el número de transacción o comprobante emitido por el sistema bancario o de caja.');
      return;
    }
    if (!acceptedTerms) {
      alert('Debe aceptar las condiciones de pedido y política de anticipo de La Viña Dulce.');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const randomSeq = Math.floor(51407 + Math.random() * 800);
      const generatedOrderNumber = `0000${randomSeq}`.slice(-9);

      // Consolidate fillings array including custom text
      const finalFillings = selectedFillings.map(f => 
        f === 'Otros (Especifique)' ? (customFillingText ? `Otro: ${customFillingText}` : 'Otro especial') : f
      );

      const formattedMolds = selectedMolds.map(m =>
        m === 'Otro especifique' ? (customMoldText ? `Otro: ${customMoldText}` : 'Molde personalizado') : m
      ).join(', ');

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: generatedOrderNumber,
        customer: {
          name: customerName,
          idNumber: customerIdNumber || '1100000000',
          phone: customerPhone,
          address: 'Retiro en Local (18 de Noviembre 211-11 y Mercadillo)'
        },
        cake: {
          occasion,
          cakeCount,
          portions,
          moldType: formattedMolds,
          customMoldText: customMoldText || undefined,
          dough,
          customDoughText: dough === 'Otra' ? customDoughText : undefined,
          shape,
          fillings: finalFillings,
          customFillingText: customFillingText || undefined,
          hasEdiblePaper,
          hasTopper,
          topperText: undefined,
          hasCustomTopper,
          customTopperText: hasCustomTopper ? customTopperText : undefined,
          decorationNotes,
          cakeMessage
        },
        deliveryDate,
        deliveryTime,
        deliveryType: 'pickup',
        financials: {
          totalValue,
          depositPaid,
          balanceDue,
          currency: 'USD',
          paymentMethod,
          paymentReference: paymentReference.trim(),
          isPaidInFull: balanceDue <= 0
        },
        status: 'anticipo_confirmado',
        statusHistory: [
          {
            status: 'recibido',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            comment: 'Nota de pedido generada digitalmente con formato oficial La Viña Dulce.',
            updatedBy: 'App Móvil'
          },
          {
            status: 'anticipo_confirmado',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            comment: `Anticipo de $${depositPaid.toFixed(2)} acreditado mediante comprobante Nº ${paymentReference.trim()} (${paymentMethod.toUpperCase()}).`,
            updatedBy: 'Pasarela / Caja'
          }
        ],
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        notes: `Pedido recibido vía App Móvil. Pasteles: ${cakeCount}, Porciones totales: ${portions}. Masa ${dough === 'Otra' ? (customDoughText || 'Otra') : dough}, Moldes: ${formattedMolds}. Tx: ${paymentReference.trim()}.`
      };

      playSuccessChime();
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#38bdf8', '#fda4af', '#bae6fd']
        });
      } catch {
        // Safe fallback
      }

      setIsProcessingPayment(false);
      onOrderCreated(newOrder);
      setCompletedOrderModal(newOrder);
      setModalPhone(newOrder.customer.phone);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner - Signature Candy Pink & Celeste Theme with Realce to Logo & TOMA PEDIDOS */}
      <div className="bg-gradient-to-r from-pink-50 via-white to-sky-50 rounded-2xl border-2 border-pink-300 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold tracking-wider text-[#f45b96] bg-pink-100 px-3 py-1 rounded-full uppercase border border-pink-200">
              Sistema Oficial
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#f45b96] to-[#00b4d8] text-white font-black text-xs uppercase tracking-wider rounded-full shadow-xs border border-white">
              <ClipboardCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>TOMA PEDIDOS</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <BakeryLogo variant="horizontal" size="lg" showSubtitle={true} showTomaPedidos={true} />
          </div>

          <p className="text-sm text-slate-600 leading-relaxed pt-1">
            Módulo oficial para toma de pedidos de pastelería: seleccione opciones de masa, cantidad de pasteles (hasta 10), porciones contratadas (5 a +100), moldes, rellenos y registre el valor personalizado y comprobante de pago.
          </p>
        </div>
        
        <div className="hidden sm:flex shrink-0 p-4 bg-white rounded-2xl shadow-md border-2 border-pink-200 items-center justify-center">
          <BakeryLogo variant="full" size="md" showTomaPedidos={true} />
        </div>
      </div>

      <form onSubmit={handleConfirmOrder} className="space-y-8">
        {/* SECTION 1: MASA (VAINILLA, CHOCOLATE, MIXTA, OTRA ESPECIFIQUE), CANTIDAD HASTA 10, PORCIONES 5 EN 5 Y MOLDES */}
        <div className="bg-white rounded-2xl border border-pink-100 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-pink-100 pb-4">
            <div>
              <h3 className="font-serif-title text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">1</span>
                <span>Base del Pastel & Masa</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Opciones de masa, porciones (5 a +100) y molde sugerido</p>
            </div>
            <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
              Masa Especializada
            </span>
          </div>

          {/* Dough Flavor Selection (Vainilla, Chocolate, Mixta, Otra) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Opciones de Masa (Selecciona 1):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {DOUGH_FLAVORS.map((flavor) => {
                const isSelected = dough === flavor.id;
                return (
                  <button
                    key={flavor.id}
                    type="button"
                    onClick={() => setDough(flavor.id)}
                    className={`p-4 text-left rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-pink-400 bg-gradient-to-br from-pink-50 to-pink-100/60 text-slate-900 shadow-sm ring-2 ring-pink-200'
                        : 'border-slate-200/80 bg-white hover:border-pink-200 hover:bg-pink-50/30 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-slate-900">{flavor.name}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${isSelected ? 'bg-pink-200 text-pink-800' : 'bg-slate-100 text-slate-500'}`}>
                        Masa
                      </span>
                    </div>
                    <p className="text-xs mt-1.5 leading-snug text-slate-600">
                      {flavor.description}
                    </p>
                    {isSelected && (
                      <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-pink-600">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Seleccionado
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Input when "Otra" dough is selected */}
            {dough === 'Otra' && (
              <div className="p-4 bg-pink-50/70 rounded-xl border border-pink-200 space-y-2 animate-in fade-in duration-200 mt-2">
                <label htmlFor={customDoughInputId} className="block text-xs font-bold text-pink-900 uppercase tracking-wide">
                  Especifique el Tipo de Masa *:
                </label>
                <input
                  id={customDoughInputId}
                  type="text"
                  required
                  value={customDoughText}
                  onChange={(e) => setCustomDoughText(e.target.value)}
                  placeholder="Ej: Red Velvet con cacao fino / Zanahoria y nueces / Tres leches artesanal..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-pink-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 block">
                  El maestro pastelero preparará esta masa personalizada para su pedido.
                </span>
              </div>
            )}
          </div>

          {/* Occasion / Motivo and Quantity (Hasta 10 pasteles) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label htmlFor={occasionSelectId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Motivo de la Celebración *
              </label>
              <select
                id={occasionSelectId}
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-pink-50/40 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
              >
                {OCCASIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor={cakeCountSelectId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                # Pasteles (Cantidad: 1 a 10)
              </label>
              <select
                id={cakeCountSelectId}
                value={cakeCount}
                onChange={(e) => setCakeCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-sky-50/40 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none font-semibold text-slate-800"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Pastel' : 'Pasteles'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Portions selector (Rangos de 5 en 5 desde 5 hasta más de 100 - Desvinculado de cantidad de pasteles) */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-baseline">
              <label htmlFor="portions-select" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                # Porciones Totales Contratadas (De 5 en 5, 5 a +100):{' '}
                <span className="text-pink-600 text-sm font-extrabold">
                  {portions > 100 ? '+ de 100 personas' : `${portions} personas`}
                </span>
              </label>
              <span className="text-xs text-slate-500">
                Total para {cakeCount} {cakeCount === 1 ? 'pastel' : 'pasteles'} contratados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <select
                  id="portions-select"
                  value={portions > 100 ? 105 : portions}
                  onChange={(e) => handlePortionsChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-pink-50/50 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none font-semibold text-slate-800"
                >
                  {PORTION_OPTIONS.map((qty) => (
                    <option key={qty} value={qty}>
                      {qty > 100 ? 'Más de 100 porciones (Evento / Gran Celebración)' : `${qty} porciones totales`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  id="portions-range"
                  type="range"
                  min="5"
                  max="105"
                  step="5"
                  value={portions > 100 ? 105 : portions}
                  onChange={(e) => handlePortionsChange(Number(e.target.value))}
                  className="w-full h-2.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>

            {/* Quick portions button pills in steps of 5 */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 75, 100, 105].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => handlePortionsChange(qty)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    (qty === 105 && portions > 100) || portions === qty
                      ? 'bg-pink-500 text-white shadow-xs font-bold'
                      : 'bg-pink-50 text-slate-700 hover:bg-pink-100 border border-pink-200/60'
                  }`}
                >
                  {qty > 100 ? '+100' : `${qty}p`}
                </button>
              ))}
            </div>
          </div>

          {/* Shape Selection */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Forma Principal del Pastel:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CAKE_SHAPES.map((shp) => {
                const isSelected = shape === shp.id;
                return (
                  <button
                    key={shp.id}
                    type="button"
                    onClick={() => handleShapeChange(shp.id)}
                    className={`p-3 text-center rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-400 bg-sky-100 text-slate-900 font-bold ring-2 ring-sky-200'
                        : 'border-slate-200 bg-white hover:bg-sky-50/50 text-slate-700'
                    }`}
                  >
                    {shp.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mold Preset Selection - Selección Múltiple Habilitada */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                # Moldes Sugeridos para Taller (Selección Múltiple):
              </label>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                {selectedMolds.length} {selectedMolds.length === 1 ? 'molde seleccionado' : 'moldes seleccionados'}
              </span>
            </div>

            {selectedMolds.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-sky-50/60 rounded-xl border border-sky-100">
                <span className="text-[11px] text-slate-500 font-medium mr-1">Seleccionados:</span>
                {selectedMolds.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-white text-sky-800 rounded-lg border border-sky-300 shadow-xs"
                  >
                    <Check className="w-3 h-3 text-sky-600 stroke-[3]" />
                    <span>{m}</span>
                    <button
                      type="button"
                      onClick={() => toggleMold(m)}
                      className="ml-1 text-slate-400 hover:text-rose-500 font-bold cursor-pointer"
                      title="Quitar molde"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {SUGGESTED_MOLDS.map((mold) => {
                const isChecked = selectedMolds.includes(mold);
                return (
                  <button
                    key={mold}
                    type="button"
                    onClick={() => toggleMold(mold)}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'border-sky-400 bg-sky-100 text-slate-900 font-bold ring-1 ring-sky-300 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate pr-1">{mold}</span>
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedMolds.includes('Otro especifique') && (
              <div className="pt-2 animate-in fade-in duration-150 space-y-1">
                <label htmlFor={customMoldInputId} className="block text-xs font-bold text-slate-700">
                  Especifique el Molde Personalizado *:
                </label>
                <input
                  id={customMoldInputId}
                  type="text"
                  required
                  value={customMoldText}
                  onChange={(e) => setCustomMoldText(e.target.value)}
                  placeholder="Ej: Molde 35 redondo / Estructura especial de 3 pisos / Molde corazón 24cm..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-pink-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: RELLENOS (MANJAR, GELATINA, DURAZNO, CREMA MOCCA, OTROS ESPECIFIQUE) */}
        <div className="bg-white rounded-2xl border border-sky-100 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-sky-100 pb-4">
            <div>
              <h3 className="font-serif-title text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold">2</span>
                <span>Selección de Rellenos</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Opciones oficiales: Manjar, Gelatina, Durazno, CREMA MOCCA y Otros</p>
            </div>
            <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              {selectedFillings.length} seleccionados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AVAILABLE_FILLINGS.map((filling) => {
              const isChecked = selectedFillings.includes(filling.name);
              return (
                <button
                  key={filling.id}
                  type="button"
                  onClick={() => toggleFilling(filling.name)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isChecked
                      ? 'border-sky-400 bg-sky-50/80 text-slate-900 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-white hover:bg-sky-50/30 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-sm font-bold block text-slate-900">{filling.name}</span>
                    <span className="text-[11px] text-sky-700 font-medium">{filling.tag}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isChecked ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Conditional Input for "Otros (Especifique)" */}
          {selectedFillings.includes('Otros (Especifique)') && (
            <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200 space-y-2 animate-in fade-in duration-200">
              <label htmlFor={customFillingInputId} className="block text-xs font-bold text-sky-900 uppercase tracking-wide">
                Especifique el Relleno Deseado *:
              </label>
              <input
                id={customFillingInputId}
                type="text"
                required
                value={customFillingText}
                onChange={(e) => setCustomFillingText(e.target.value)}
                placeholder="Ej: Nutella con trozos de fresa / Fruta de la pasión / Crema de avellana..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-sky-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 block">
                El maestro pastelero preparará esta combinación personalizada para tu pedido.
              </span>
            </div>
          )}
        </div>

        {/* SECTION 3: TOPPER & ACABADOS (PAPEL COMESTIBLE, TOPPER PERSONALIZADOS, OTROS ESPECIFIQUE) */}
        <div className="bg-white rounded-2xl border border-pink-100 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-pink-100 pb-4">
            <div>
              <h3 className="font-serif-title text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">3</span>
                <span>Opciones de Topper & Acabados</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Opciones oficiales: Papel comestible, Topper personalizados y Otros</p>
            </div>
            <Sparkles className="w-4 h-4 text-pink-500" />
          </div>

          {/* 3 Topper options: Papel comestible, Topper personalizados, Otros especifique */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Opción 1: Papel comestible */}
            <div className={`p-4 rounded-xl border transition-all cursor-pointer ${hasEdiblePaper ? 'border-sky-400 bg-sky-50 ring-2 ring-sky-200' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasEdiblePaper}
                  onChange={(e) => setHasEdiblePaper(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
                <div>
                  <span className="font-bold text-sm block text-slate-900">Papel Comestible</span>
                  <span className="text-xs text-sky-700 font-semibold block mt-0.5">+$4.00</span>
                  <span className="text-[11px] text-slate-500 leading-tight block mt-1">
                    Lámina de arroz impresa con foto o diseño para el pastel
                  </span>
                </div>
              </label>
            </div>

            {/* Opción 2: Topper personalizados (Sin opción de texto y sin cargo en desglose financiero) */}
            <div className={`p-4 rounded-xl border transition-all cursor-pointer ${hasTopper ? 'border-pink-400 bg-pink-50 ring-2 ring-pink-200' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTopper}
                  onChange={(e) => setHasTopper(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-pink-500 rounded cursor-pointer"
                />
                <div>
                  <span className="font-bold text-sm block text-slate-900">Topper Personalizados</span>
                  <span className="text-xs text-pink-700 font-semibold block mt-0.5">Incluido en el pedido</span>
                  <span className="text-[11px] text-slate-500 leading-tight block mt-1">
                    Cake topper temático con motivo de la fiesta (sin recargo en el desglose financiero)
                  </span>
                </div>
              </label>
            </div>

            {/* Opción 3: Otros especifique */}
            <div className={`p-4 rounded-xl border transition-all cursor-pointer ${hasCustomTopper ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-200' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCustomTopper}
                  onChange={(e) => setHasCustomTopper(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-purple-500 rounded cursor-pointer"
                />
                <div>
                  <span className="font-bold text-sm block text-slate-900">Otros (Especifique)</span>
                  <span className="text-xs text-purple-700 font-semibold block mt-0.5">Accesorio especial</span>
                  <span className="text-[11px] text-slate-500 leading-tight block mt-1">
                    Topper en acrílico, flores, corona o accesorio personalizado
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Topper text input removed as requested */}
          {hasCustomTopper && (
            <div className="space-y-1.5 p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 animate-in fade-in duration-200">
              <label htmlFor={customTopperTextInputId} className="block text-xs font-bold text-purple-900">
                Especifique el Topper Deseado *:
              </label>
              <input
                id={customTopperTextInputId}
                type="text"
                required
                value={customTopperText}
                onChange={(e) => setCustomTopperText(e.target.value)}
                placeholder="Ej: Topper acrílico dorado espejo / Corona de princesa / Figuras temáticas..."
                className="w-full px-3 py-2 text-sm bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
          )}

          {/* Mensaje en el pastel */}
          <div className="space-y-2">
            <label htmlFor={cakeMessageInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Mensaje Escrito sobre el Pastel:
            </label>
            <input
              id={cakeMessageInputId}
              type="text"
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
              placeholder="Ej: ¡Feliz Cumpleaños Mamá!"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>

          {/* Líneas de Decoración */}
          <div className="space-y-2">
            <label htmlFor={decorationNotesInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Detalles de Decoración (Campo "Decoración" de la Nota):
            </label>
            <textarea
              id={decorationNotesInputId}
              rows={3}
              value={decorationNotes}
              onChange={(e) => setDecorationNotes(e.target.value)}
              placeholder="Describa el diseño: colores predominantes (rosa pastel, celeste pastel), cobertura (Chantilly, Buttercream, Fondant), detalles de acabado..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 4: DATOS DEL CLIENTE Y FECHA DE ENTREGA (SOLO RETIRO EN TIENDA) */}
        <div className="bg-white rounded-2xl border border-sky-100 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-sky-100 pb-4">
            <div>
              <h3 className="font-serif-title text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold">4</span>
                <span>Datos del Cliente & Retiro</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Impresión en el encabezado de la Nota de Pedido</p>
            </div>
            <User className="w-4 h-4 text-sky-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor={customerNameInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Sr. (es) - Nombre Completo *
              </label>
              <div className="relative">
                <input
                  id={customerNameInputId}
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej: Ing. Patricia Quezada"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor={customerIdNumberInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                RUC / C.I. (Identificación)
              </label>
              <input
                id={customerIdNumberInputId}
                type="text"
                value={customerIdNumber}
                onChange={(e) => setCustomerIdNumber(e.target.value)}
                placeholder="Ej: 1104829102"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={customerPhoneInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Teléfono / WhatsApp de Contacto *
              </label>
              <div className="relative">
                <input
                  id={customerPhoneInputId}
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ej: 0995639050"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none font-mono"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Modalidad de Entrega: Solo retiro en tienda */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Modalidad de Entrega
              </label>
              <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Retiro en Tienda (Local Central Loja)</span>
                  <span className="text-slate-600 block text-[11px] leading-tight">
                    18 de Noviembre 211-11 y Mercadillo · Sin costo de envío
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label htmlFor="delivery-date-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Fecha de Entrega:
              </label>
              <div className="relative">
                <input
                  id="delivery-date-input"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor={deliveryTimeInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Hora de Entrega:
              </label>
              <div className="relative">
                <input
                  id={deliveryTimeInputId}
                  type="time"
                  required
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:outline-none"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: VALOR, ABONO PERSONALIZADO Y FORMAS DE PAGO CON Nº TRANSACCIÓN */}
        <div className="bg-white rounded-2xl border border-pink-100 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-pink-100 pb-4">
            <div>
              <h3 className="font-serif-title text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">5</span>
                <span>Desglose Financiero & Pago</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Abono personalizado y comprobante de transacción oficial</p>
            </div>
            <div className="flex items-center gap-1.5 text-sky-700 text-xs font-semibold bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              <span>Transacción Protegida</span>
            </div>
          </div>

          {/* Pricing Ledger matching receipt (Sin topper en desglose financiero, Valor total con MÁXIMO REALCE PERSONALIZADO) */}
          <div className="bg-gradient-to-br from-pink-50/40 to-sky-50/40 rounded-2xl border-2 border-pink-200/90 p-5 space-y-5">
            {/* Detalle del Pedido */}
            <div className="flex justify-between items-center text-sm text-slate-700 bg-white/90 p-3.5 rounded-xl border border-pink-100 shadow-2xs">
              <div>
                <span className="font-bold text-slate-900">Pastel artesanal (Masa {dough === 'Otra' ? (customDoughText || 'Otra') : dough})</span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  {portions > 100 ? '+ de 100 porciones contratadas' : `${portions} porciones contratadas`} · {cakeCount} {cakeCount === 1 ? 'pastel' : 'pasteles'}
                </span>
              </div>
              <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-200">
                Masa Seleccionada
              </span>
            </div>

            {hasEdiblePaper && (
              <div className="flex justify-between items-center text-sm text-slate-700 bg-white/90 p-3 rounded-xl border border-pink-100 shadow-2xs">
                <span className="font-medium text-slate-800">Lámina de arroz comestible (Papel):</span>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">Incluido en Pedido</span>
              </div>
            )}

            {/* VALOR TOTAL DEL PEDIDO - MÁXIMO REALCE PERSONALIZADO (MANUAL) */}
            <div className="p-5 sm:p-6 bg-white rounded-2xl border-2 border-pink-500 shadow-lg ring-4 ring-pink-100/90 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-100 pb-3">
                <label htmlFor={totalValueInputId} className="block text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-pink-500 animate-pulse"></span>
                  <span>VALOR TOTAL DEL PEDIDO ($ USD) *:</span>
                </label>
                <span className="text-xs font-black text-pink-700 bg-pink-100 px-3.5 py-1 rounded-full uppercase border border-pink-300 shadow-2xs tracking-wider">
                  ★ VALOR PERSONALIZADO (MANUAL)
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-3 text-3xl font-black text-pink-600 select-none">$</span>
                <input
                  id={totalValueInputId}
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  value={totalValue}
                  onChange={(e) => {
                    setHasManuallyEditedTotal(true);
                    setTotalValue(Math.max(0, Number(e.target.value)));
                  }}
                  className="w-full pl-12 pr-5 py-3.5 text-2xl sm:text-4xl font-black font-mono text-slate-900 bg-pink-50/20 border-2 border-pink-400 rounded-xl focus:ring-4 focus:ring-pink-300 focus:border-pink-600 focus:outline-none transition-all shadow-inner"
                  placeholder="0.00"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 bg-gradient-to-r from-pink-50 to-pink-100/60 p-3 rounded-xl border border-pink-200">
                <span className="font-bold text-pink-950">
                  Monto total acordado con el cliente para este pedido (ingresado manualmente)
                </span>
                <span className="font-mono font-black text-slate-900 text-lg">
                  ${totalValue.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Deposit choice (Únicamente opción personalizada de valor, sin 50%) */}
            <div className="pt-2 border-t border-dashed border-pink-200 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor={customDepositInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Abono / Anticipo Personalizado ($ USD) *:
                </label>
                <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                  Monto Libre
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-base font-bold text-pink-600">$</span>
                <input
                  id={customDepositInputId}
                  type="number"
                  min="0"
                  max={totalValue}
                  step="0.5"
                  value={customDeposit}
                  onChange={(e) => setCustomDeposit(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-4 py-2.5 text-base font-bold font-mono text-slate-900 bg-white border border-pink-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 mr-1">Montos rápidos de abono:</span>
                {[10, 15, 20, 25, 30, 40, 50].filter(v => v < totalValue).map((quickVal) => (
                  <button
                    key={quickVal}
                    type="button"
                    onClick={() => setCustomDeposit(quickVal)}
                    className={`px-2.5 py-1 text-xs rounded-md font-mono font-semibold transition-all cursor-pointer ${
                      customDeposit === quickVal
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'bg-white hover:bg-pink-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    ${quickVal}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCustomDeposit(totalValue)}
                  className={`px-2.5 py-1 text-xs rounded-md font-mono font-semibold transition-all cursor-pointer ${
                    customDeposit === totalValue
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white hover:bg-sky-50 text-sky-800 border border-sky-200'
                  }`}
                >
                  Total (${totalValue.toFixed(2)})
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                El valor restante de <strong className="text-slate-800">${balanceDue.toFixed(2)}</strong> queda registrado como saldo a liquidar al retirar el pastel en tienda.
              </p>
            </div>

            {/* Summary strip of Abono and Saldo */}
            <div className="p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Abono a Pagar Ahora:</span>
                <span className="text-base font-bold text-pink-300">${depositPaid.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase">Saldo Pendiente al Retirar:</span>
                <span className="text-base font-bold text-sky-300">${balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Formas de Pago Oficiales con Número de Transacción */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Forma de Pago Oficial:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PAYMENT_METHODS_LIST.map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method.id);
                      if (!paymentReference || paymentReference.startsWith('TX-') || paymentReference.startsWith('DEU-') || paymentReference.startsWith('AHO-') || paymentReference.startsWith('MEGO-') || paymentReference.startsWith('JEP-') || paymentReference.startsWith('CAJA-')) {
                        setPaymentReference(method.placeholderTx);
                      }
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-pink-500 bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md shadow-pink-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-pink-50/50 text-slate-800'
                    }`}
                  >
                    <span className="font-bold text-xs uppercase block tracking-wider">{method.name}</span>
                    <span className={`text-[11px] block mt-1 ${isSelected ? 'text-pink-100' : 'text-slate-500'}`}>
                      {method.desc}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 bg-white text-pink-600 rounded-full p-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Campo obligatorio de Número de Transacción de cada banco o caja */}
            <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200 space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <label htmlFor={paymentReferenceInputId} className="block text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-sky-600" />
                  <span>Número de Transacción / Comprobante de Pago *:</span>
                </label>
                <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded uppercase">
                  {PAYMENT_METHODS_LIST.find(p => p.id === paymentMethod)?.bankLabel || 'Bancario'}
                </span>
              </div>
              <input
                id={paymentReferenceInputId}
                type="text"
                required
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder={`Ej: ${PAYMENT_METHODS_LIST.find(p => p.id === paymentMethod)?.placeholderTx || '123456789'}`}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-sky-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none font-mono font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-600">
                Ingrese el número de transacción o comprobante emitido por el sistema de <strong>{PAYMENT_METHODS_LIST.find(p => p.id === paymentMethod)?.name}</strong> para asentar en el registro oficial.
              </p>
            </div>
          </div>

          {/* Bakery Policy Box */}
          <div className="p-3.5 bg-pink-50/70 rounded-xl border border-pink-200 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <AlertTriangle className="w-4 h-4 text-pink-600 shrink-0" />
              <span>Condiciones Oficiales de la Nota de Pedido:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {BAKERY_INFO.legalWarning}
            </p>
            <label className="flex items-center gap-2 pt-1 font-semibold text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
              />
              <span className="text-xs">He leído y acepto los términos de anticipo y entrega.</span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessingPayment}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#f45b96] via-[#ec4899] to-[#00b4d8] hover:opacity-95 active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2 shadow-md shadow-[#f45b96]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando Anticipo de ${depositPaid.toFixed(2)}...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Generar Nota de Pedido Oficial (${depositPaid.toFixed(2)})</span>
                  <ChevronRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Se emitirá el talón oficial de <strong>La Viña Dulce</strong> con número de serie único y copia para taller.
            </p>
          </div>
        </div>
      </form>

      {/* Modal: Opción de enviar el recibo al WhatsApp del cliente al generar la nota oficial */}
      {completedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 no-print">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-pink-200 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Decorative top accent with pastel pink and sky blue */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-pink-400 via-pink-300 to-sky-400" />
            
            <button
              type="button"
              onClick={() => {
                onViewReceipt(completedOrderModal);
                setCompletedOrderModal(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Cerrar y ver nota de pedido"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Bakery Logo Emblem in celebration modal */}
            <div className="w-16 h-16 mx-auto mt-2 mb-3 rounded-2xl bg-white p-2 shadow-sm border border-pink-200 flex items-center justify-center">
              <BakeryLogo variant="icon" size="sm" />
            </div>

            <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
              ¡Nota de Pedido Oficial Generada!
            </div>

            <h3 className="font-serif-title text-2xl font-bold text-slate-900 mt-2">
              Nº {completedOrderModal.orderNumber}
            </h3>
            
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              El pedido para <strong>{completedOrderModal.customer.name}</strong> ha sido registrado en el sistema oficial con anticipo de <strong>${completedOrderModal.financials.depositPaid.toFixed(2)}</strong>.
            </p>

            {/* WhatsApp Option Card */}
            <div className="my-5 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-left space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">
                    ¿Enviar recibo al WhatsApp del cliente?
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    Envío instantáneo del comprobante digital y resumen oficial
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="block text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                  Número de WhatsApp del Cliente:
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    placeholder="Ej: 0995639050"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-mono font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                  <Phone className="w-3.5 h-3.5 text-emerald-600 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  const finalOrder = {
                    ...completedOrderModal,
                    customer: {
                      ...completedOrderModal.customer,
                      phone: modalPhone || completedOrderModal.customer.phone
                    }
                  };
                  openCustomerWhatsAppReceipt(finalOrder);
                  onViewReceipt(finalOrder);
                  setCompletedOrderModal(null);
                }}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Recibo al WhatsApp del Cliente</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onViewReceipt(completedOrderModal);
                  setCompletedOrderModal(null);
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Ver Nota de Pedido Oficial (Imprimir / Talón)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
