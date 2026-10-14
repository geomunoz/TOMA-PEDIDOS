import { Order } from '../types/order';
import { BAKERY_INFO } from '../data/constants';

export type PosPaperWidth = '80mm' | '58mm';
export type PosTicketType = 'all' | 'customer' | 'kitchen';

export interface PosConnectionStatus {
  connected: boolean;
  type: 'bluetooth' | 'serial' | 'system' | 'none';
  deviceName?: string;
  error?: string;
}

// Lightweight interfaces for Web Bluetooth & Web Serial without extra globals
export interface GenericBluetoothDevice {
  name?: string;
  gatt?: {
    connect: () => Promise<GenericGattServer>;
  };
}

export interface GenericGattServer {
  getPrimaryServices: () => Promise<GenericGattService[]>;
}

export interface GenericGattService {
  getCharacteristics: () => Promise<GenericGattCharacteristic[]>;
}

export interface GenericGattCharacteristic {
  properties: {
    write?: boolean;
    writeWithoutResponse?: boolean;
  };
  writeValue: (value: BufferSource) => Promise<void>;
  writeValueWithoutResponse?: (value: BufferSource) => Promise<void>;
}

export interface GenericSerialPort {
  open: (options: { baudRate: number; dataBits?: number; stopBits?: number; parity?: string }) => Promise<void>;
  writable: {
    getWriter: () => {
      write: (data: Uint8Array) => Promise<void>;
      releaseLock: () => void;
    };
  };
}

/**
 * Generate plain text receipt for thermal POS printers (32 columns for 58mm, 42-48 columns for 80mm)
 */
export function generatePosPlainText(order: Order, width: PosPaperWidth = '80mm', type: PosTicketType = 'all'): string {
  const cols = width === '80mm' ? 42 : 32;
  const line = '='.repeat(cols);
  const dashed = '-'.repeat(cols);

  const center = (text: string): string => {
    if (text.length >= cols) return text.slice(0, cols);
    const leftPad = Math.floor((cols - text.length) / 2);
    return ' '.repeat(leftPad) + text;
  };

  const row = (left: string, right: string): string => {
    const space = cols - left.length - right.length;
    if (space <= 0) return `${left} ${right}`.slice(0, cols);
    return left + ' '.repeat(space) + right;
  };

  let out = '';

  const renderSlip = (isCustomer: boolean) => {
    let slip = '';
    slip += center('LA VIÑA DULCE') + '\n';
    slip += center('PASTELERIA & PANADERIA') + '\n';
    slip += center('TOMA PEDIDOS OFICIAL') + '\n';
    slip += center('Loja - Ecuador') + '\n';
    slip += center(`Dir: ${BAKERY_INFO.address}`) + '\n';
    slip += center(`Tel: ${BAKERY_INFO.phone}`) + '\n';
    slip += line + '\n';

    slip += center(isCustomer ? '*** COPIA CLIENTE ***' : '*** CONTROL DE TALLER / COCINA ***') + '\n';
    slip += row('NOTA DE PEDIDO Nº:', order.orderNumber) + '\n';
    slip += row('FECHA PEDIDO:', order.createdAt || new Date().toISOString().slice(0, 10)) + '\n';
    slip += row('ESTADO:', order.status.toUpperCase().replace('_', ' ')) + '\n';
    slip += dashed + '\n';

    slip += 'DATOS DEL CLIENTE:\n';
    slip += ` Sr.(a): ${order.customer.name}\n`;
    slip += ` CI/RUC: ${order.customer.idNumber || 'Consumidor Final'}\n`;
    slip += ` Tel: ${order.customer.phone}\n`;
    slip += ` Entrega: Retiro en Tienda\n`;
    slip += dashed + '\n';

    slip += 'ENTREGA CONVENIDA:\n';
    slip += row('FECHA:', order.deliveryDate) + '\n';
    slip += row('HORA:', `${order.deliveryTime} hrs`) + '\n';
    slip += dashed + '\n';

    slip += 'DETALLES DEL PASTEL:\n';
    slip += row('Cantidad Pasteles:', `${order.cake.cakeCount} un.`) + '\n';
    slip += row('Porciones Totales:', `${order.cake.portions} personas`) + '\n';
    slip += row('Motivo:', order.cake.occasion) + '\n';
    slip += row('Masa:', order.cake.dough === 'Otra' ? (order.cake.customDoughText || 'Otra') : order.cake.dough) + '\n';
    slip += row('Forma:', order.cake.shape) + '\n';
    slip += ` Moldes: ${order.cake.moldType || 'Estándar'}\n`;
    slip += ` Rellenos: ${order.cake.fillings.join(', ')}\n`;
    if (order.cake.hasEdiblePaper) {
      slip += ' - Con Lámina Comestible (Papel arroz)\n';
    }
    if (order.cake.hasTopper) {
      slip += ' - Con Topper Personalizado incluido\n';
    }
    if (order.cake.cakeMessage) {
      slip += ` Letrero: "${order.cake.cakeMessage}"\n`;
    }
    if (order.cake.decorationNotes) {
      slip += ` Obs. Deco: ${order.cake.decorationNotes}\n`;
    }
    slip += dashed + '\n';

    slip += 'LIQUIDACION FINANCIERA (USD):\n';
    slip += row('VALOR TOTAL:', `$${order.financials.totalValue.toFixed(2)}`) + '\n';
    slip += row('ANTICIPO / ABONO:', `-$${order.financials.depositPaid.toFixed(2)}`) + '\n';
    slip += line + '\n';
    slip += row('>>> SALDO PENDIENTE:', `$${order.financials.balanceDue.toFixed(2)}`) + '\n';
    slip += line + '\n';

    const payLabelMap: Record<string, string> = {
      efectivo: 'EFECTIVO',
      ahorita: 'AHORITA BANCO DE LOJA',
      deuna: 'DE UNA BANCO PICHINCHA',
      pago_mego: 'PAGO MEGO',
      jep_fast: 'JEP FAST'
    };
    slip += row('Forma de Pago:', payLabelMap[order.financials.paymentMethod] || 'TRANSFERENCIA') + '\n';
    slip += row('Nº Transacción:', order.financials.paymentReference || 'N/A') + '\n';
    slip += dashed + '\n';

    slip += center('RETIRO OBLIGATORIO EN TIENDA:') + '\n';
    slip += center('18 de Noviembre 211-11 y Mercadillo') + '\n';
    slip += center('Presentar este ticket o comprobante digital') + '\n';
    slip += dashed + '\n';
    slip += center('¡Gracias por su preferencia!') + '\n';
    slip += center('La Viña Dulce · Pasión por el Sabor') + '\n';
    slip += '\n\n';
    return slip;
  };

  if (type === 'all' || type === 'customer') {
    out += renderSlip(true);
  }
  if (type === 'all') {
    out += center('--- CORTE DE TICKET ---') + '\n\n\n';
  }
  if (type === 'all' || type === 'kitchen') {
    out += renderSlip(false);
  }

  return out;
}

/**
 * Generate binary ESC/POS byte array with formatting commands
 */
export function generateEscPosBytes(order: Order, width: PosPaperWidth = '80mm', type: PosTicketType = 'all'): Uint8Array {
  const encoder = new TextEncoder();
  const text = generatePosPlainText(order, width, type);

  // ESC/POS Commands
  const ESC = 0x1b;
  const GS = 0x1d;

  const init = [ESC, 0x40]; // ESC @ - Initialize printer
  const cut = [GS, 0x56, 0x41, 0x10]; // GS V A 16 - Feed and cut paper

  const textBytes = encoder.encode(text);
  const totalLength = init.length + textBytes.length + cut.length;
  const buffer = new Uint8Array(totalLength);

  buffer.set(init, 0);
  buffer.set(textBytes, init.length);
  buffer.set(cut, init.length + textBytes.length);

  return buffer;
}

/**
 * Connect to a Web Bluetooth Thermal Printer (Standard SPP / Printer UUIDs)
 */
export async function connectBluetoothPrinter(): Promise<{
  device: GenericBluetoothDevice;
  characteristic?: GenericGattCharacteristic;
}> {
  const navBluetooth = typeof navigator !== 'undefined' ? (navigator as any).bluetooth : undefined;
  if (!navBluetooth) {
    throw new Error('Web Bluetooth no está disponible en este navegador. Utilice Google Chrome o use la impresión térmica directa.');
  }

  const device: GenericBluetoothDevice = await navBluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [
      '000018f0-0000-1000-8000-00805f9b34fb', // Standard Printer Service
      'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Common Xprinter / Goojprt
      '49535343-fe7d-4ae5-8fa9-9fafd205e455', // ISSC Transparent Serial
      '0000e0ff-0000-1000-8000-00805f9b34fb',
    ]
  });

  const server = await device.gatt?.connect();
  if (!server) {
    throw new Error('No se pudo conectar al servidor GATT de la impresora Bluetooth.');
  }

  const services = await server.getPrimaryServices();
  let writeChar: GenericGattCharacteristic | undefined;

  for (const service of services) {
    try {
      const chars = await service.getCharacteristics();
      for (const char of chars) {
        if (char.properties.write || char.properties.writeWithoutResponse) {
          writeChar = char;
          break;
        }
      }
      if (writeChar) break;
    } catch {
      // Continue
    }
  }

  return { device, characteristic: writeChar };
}

/**
 * Send raw data to a connected Bluetooth characteristic
 */
export async function sendBluetoothEscPos(
  characteristic: GenericGattCharacteristic,
  data: Uint8Array
): Promise<void> {
  const CHUNK_SIZE = 64;
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    if (characteristic.properties.writeWithoutResponse && characteristic.writeValueWithoutResponse) {
      await characteristic.writeValueWithoutResponse(chunk);
    } else {
      await characteristic.writeValue(chunk);
    }
    await new Promise(res => setTimeout(res, 25));
  }
}

/**
 * Connect to a Web Serial (USB / COM) POS Printer
 */
export async function connectSerialPrinter(): Promise<{
  port: GenericSerialPort;
  writer: { write: (data: Uint8Array) => Promise<void>; releaseLock: () => void };
}> {
  const navSerial = typeof navigator !== 'undefined' ? (navigator as any).serial : undefined;
  if (!navSerial) {
    throw new Error('Web Serial no está disponible en este navegador. Utilice Google Chrome o Microsoft Edge.');
  }

  const port: GenericSerialPort = await navSerial.requestPort();
  await port.open({ baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none' });
  const writer = port.writable.getWriter();

  return { port, writer };
}

/**
 * Print via direct iframe with specialized thermal CSS (Universal POS print)
 */
export function printThermalViaBrowser(order: Order, width: PosPaperWidth = '80mm', type: PosTicketType = 'all'): void {
  const plainText = generatePosPlainText(order, width, type);
  const widthPx = width === '80mm' ? '300px' : '220px';

  const printWindow = window.open('', '_blank', 'width=450,height=600');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Ticket POS - Nota Nº ${order.orderNumber}</title>
        <style>
          @page {
            size: ${width === '80mm' ? '80mm auto' : '58mm auto'};
            margin: 0;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: ${width === '80mm' ? '12px' : '10px'};
            line-height: 1.25;
            color: #000;
            background: #fff;
            width: ${widthPx};
            margin: 0 auto;
            padding: 8px;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .ticket-wrapper {
            width: 100%;
          }
          .barcode-mock {
            text-align: center;
            font-family: monospace;
            letter-spacing: 4px;
            font-weight: bold;
            margin: 8px 0;
            padding: 4px;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
          }
        </style>
      </head>
      <body>
        <div class="ticket-wrapper">
${escapeHtml(plainText)}
          <div class="barcode-mock">||| | |||| || ||| || ||||</div>
        </div>
        <script>
          window.onload = function() {
            window.focus();
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
