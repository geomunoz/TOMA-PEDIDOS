import { Order } from '../types/order';
import { BAKERY_INFO } from '../data/constants';

export function formatCustomerPhone(phone: string): string {
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '593' + clean.slice(1);
  } else if (!clean.startsWith('593') && clean.length === 9) {
    clean = '593' + clean;
  }
  return clean;
}

export function generateOrderWhatsAppMessage(order: Order): string {
  const parts: string[] = [
    `🍰 *${BAKERY_INFO.name.toUpperCase()} - ${BAKERY_INFO.subtitle.toUpperCase()}*`,
    `📍 ${BAKERY_INFO.address}`,
    `📞 Tel: ${BAKERY_INFO.phone}`,
    ``,
    `🧾 *NOTA DE PEDIDO Nº ${order.orderNumber}*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Cliente:* ${order.customer.name}`,
    `🪪 *C.I. / RUC:* ${order.customer.idNumber || 'Consumidor Final'}`,
    `📞 *Teléfono:* ${order.customer.phone}`,
    `📍 *Modalidad de Entrega:* Retiro en Tienda (18 de Noviembre 211-11 y Mercadillo)`,
    `📅 *Fecha de Entrega:* ${order.deliveryDate}`,
    `⏰ *Hora:* ${order.deliveryTime}`,
    ``,
    `🎂 *DETALLES DEL PASTEL:*`,
    `• *Motivo:* ${order.cake.occasion}`,
    `• *Cantidad de Pasteles:* ${order.cake.cakeCount} ${order.cake.cakeCount === 1 ? 'pastel' : 'pasteles'}`,
    `• *Porciones Totales Contratadas:* ${order.cake.portions} (${order.cake.shape})`,
    `• *Masa:* ${order.cake.dough === 'Otra' && order.cake.customDoughText ? `Otra (${order.cake.customDoughText})` : order.cake.dough}`,
    `• *Moldes Sugeridos:* ${order.cake.moldType}`,
    `• *Rellenos:* ${order.cake.fillings.join(', ')}`,
  ];

  if (order.cake.hasEdiblePaper) {
    parts.push(`• *Papel Comestible:* Sí (Lámina impresa para pastel)`);
  }
  if (order.cake.hasTopper) {
    parts.push(`• *Topper Personalizado:* Sí (Sin recargo en desglose)`);
  }
  if (order.cake.hasCustomTopper) {
    parts.push(`• *Otro Topper (Especifique):* Sí ("${order.cake.customTopperText || 'Especial'}")`);
  }
  if (order.cake.cakeMessage) {
    parts.push(`• *Mensaje en Pastel:* "${order.cake.cakeMessage}"`);
  }
  if (order.cake.decorationNotes) {
    parts.push(`• *Decoración:* ${order.cake.decorationNotes}`);
  }

  const paymentMap: Record<string, string> = {
    efectivo: 'EFECTIVO',
    ahorita: 'AHORITA BANCO DE LOJA',
    deuna: 'DE UNA BANCO PICHINCHA',
    pago_mego: 'PAGO MEGO',
    jep_fast: 'JEP FAST',
  };
  const paymentMethodLabel = paymentMap[order.financials.paymentMethod] || 'EFECTIVO';

  parts.push(
    ``,
    `💰 *DESGLOSE FINANCIERO:*`,
    `• *Valor Total:* $${order.financials.totalValue.toFixed(2)}`,
    `• *Abono (Anticipo):* $${order.financials.depositPaid.toFixed(2)}`,
    `• *Saldo Pendiente al Retirar:* $${order.financials.balanceDue.toFixed(2)}`,
    `• *Forma de Pago:* ${paymentMethodLabel}`,
    `• *Nº Transacción / Ref:* ${order.financials.paymentReference || 'N/A'}`,
    ``,
    `⚠️ *CONDICIONES:* Cambios máximo con 24h de anticipación. En caso de anular se perderá $5.00 del anticipo. Precaución: Algunos pasteles pueden contener palillos de soporte.`,
    ``,
    `¡Muchas gracias por su preferencia en La Viña Dulce! ✨`
  );

  return parts.join('\n');
}

export function openCustomerWhatsAppReceipt(order: Order) {
  const formattedPhone = formatCustomerPhone(order.customer.phone || '');
  const message = generateOrderWhatsAppMessage(order);
  const url = formattedPhone && formattedPhone.length >= 8
    ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
