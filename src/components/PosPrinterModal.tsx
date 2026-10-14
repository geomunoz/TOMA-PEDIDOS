import React, { useState } from 'react';
import { Order } from '../types/order';
import {
  PosPaperWidth,
  PosTicketType,
  GenericGattCharacteristic,
  generatePosPlainText,
  generateEscPosBytes,
  connectBluetoothPrinter,
  sendBluetoothEscPos,
  connectSerialPrinter,
  printThermalViaBrowser
} from '../utils/posPrinter';
import {
  Printer,
  Bluetooth,
  Usb,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Settings2,
  HelpCircle,
  Scissors
} from 'lucide-react';

interface PosPrinterModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const PosPrinterModal: React.FC<PosPrinterModalProps> = ({ order, isOpen, onClose }) => {
  const [paperWidth, setPaperWidth] = useState<PosPaperWidth>('80mm');
  const [ticketType, setTicketType] = useState<PosTicketType>('all');
  const [activeTab, setActiveTab] = useState<'direct' | 'bluetooth' | 'usb' | 'raw'>('direct');
  
  // Connection states
  const [isBluetoothConnecting, setIsBluetoothConnecting] = useState<boolean>(false);
  const [bluetoothDeviceName, setBluetoothDeviceName] = useState<string | null>(null);
  const [bluetoothCharacteristic, setBluetoothCharacteristic] = useState<GenericGattCharacteristic | null>(null);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);
  
  const [isSerialConnecting, setIsSerialConnecting] = useState<boolean>(false);
  const [isSerialConnected, setIsSerialConnected] = useState<boolean>(false);
  const [serialError, setSerialError] = useState<string | null>(null);

  const [printSuccessMessage, setPrintSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const previewText = generatePosPlainText(order, paperWidth, ticketType);

  // 1. Direct Browser Thermal Spooler Print
  const handleDirectPrint = () => {
    printThermalViaBrowser(order, paperWidth, ticketType);
    setPrintSuccessMessage('Comando de impresión térmica enviado al sistema.');
    setTimeout(() => setPrintSuccessMessage(null), 4000);
  };

  // 2. Web Bluetooth Printer Connect & Print
  const handleBluetoothConnectAndPrint = async () => {
    setIsBluetoothConnecting(true);
    setBluetoothError(null);
    try {
      let char = bluetoothCharacteristic;
      let name = bluetoothDeviceName;

      if (!char) {
        const conn = await connectBluetoothPrinter();
        name = conn.device.name || 'Impresora Térmica Bluetooth';
        setBluetoothDeviceName(name);
        char = conn.characteristic || null;
        setBluetoothCharacteristic(char);
      }

      if (char) {
        const bytes = generateEscPosBytes(order, paperWidth, ticketType);
        await sendBluetoothEscPos(char, bytes);
        setPrintSuccessMessage(`Ticket impreso con éxito en ${name}!`);
        setTimeout(() => setPrintSuccessMessage(null), 4000);
      } else {
        throw new Error('La impresora no expone una característica de escritura compatible.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con la impresora Bluetooth';
      setBluetoothError(msg);
    } finally {
      setIsBluetoothConnecting(false);
    }
  };

  // 3. Web Serial / USB Connect & Print
  const handleSerialConnectAndPrint = async () => {
    setIsSerialConnecting(true);
    setSerialError(null);
    try {
      const conn = await connectSerialPrinter();
      setIsSerialConnected(true);
      const bytes = generateEscPosBytes(order, paperWidth, ticketType);
      await conn.writer.write(bytes);
      conn.writer.releaseLock();
      setPrintSuccessMessage('Ticket enviado directamente por puerto USB / Serial!');
      setTimeout(() => setPrintSuccessMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con la impresora USB / Serial';
      setSerialError(msg);
    } finally {
      setIsSerialConnecting(false);
    }
  };

  // 4. Download Raw ESC/POS File
  const handleDownloadEscPos = () => {
    const bytes = generateEscPosBytes(order, paperWidth, ticketType);
    // Use ArrayBuffer copy to avoid SharedArrayBuffer type incompatibility
    const arrayCopy = new Uint8Array(bytes.length);
    arrayCopy.set(bytes);
    const blob = new Blob([arrayCopy], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_pos_nota_${order.orderNumber}.prn`;
    a.click();
    URL.revokeObjectURL(url);
    setPrintSuccessMessage('Archivo ESC/POS descargado para software de caja.');
    setTimeout(() => setPrintSuccessMessage(null), 4000);
  };

  // 5. Test Ticket Print
  const handlePrintTestTicket = () => {
    const testOrder: Order = {
      ...order,
      orderNumber: 'TEST-001',
      customer: {
        name: 'PRUEBA PUNTO DE VENTA',
        idNumber: '1199999999',
        phone: '0990000000',
        address: 'Mostrador Pastelería'
      },
      cake: {
        ...order.cake,
        occasion: 'Prueba de Impresión Térmica POS',
        cakeMessage: 'Ticket de Prueba',
        decorationNotes: 'Verificación de corte y alineación'
      }
    };
    printThermalViaBrowser(testOrder, paperWidth, 'customer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-pink-50 via-white to-sky-50 border-b border-pink-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-[#00b4d8] text-white flex items-center justify-center shadow-md shadow-pink-500/20 shrink-0">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full uppercase border border-pink-200">
                  Punto de Venta · POS
                </span>
                <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full uppercase border border-sky-200">
                  Ticket Térmico
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-1">
                Conectar & Imprimir Recibo POS
              </h2>
              <p className="text-xs text-slate-500">
                Impresión optimizada en rollos de 80mm y 58mm (Epson, Xprinter, Star, USB, Bluetooth)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Settings and Connection Options (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Success notification banner */}
            {printSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{printSuccessMessage}</span>
              </div>
            )}

            {/* Paper width and ticket type controls */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700">
                  <Settings2 className="w-4 h-4 text-pink-600" />
                  <span>Configuración del Rollo de Papel</span>
                </div>
                <button
                  type="button"
                  onClick={handlePrintTestTicket}
                  className="text-[11px] font-bold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Ticket de Prueba</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Paper width */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Ancho de Impresora:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaperWidth('80mm')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        paperWidth === '80mm'
                          ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      80 mm (Estándar)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperWidth('58mm')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        paperWidth === '58mm'
                          ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      58 mm (Mini POS)
                    </button>
                  </div>
                </div>

                {/* Ticket scope */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Contenido a Imprimir:
                  </label>
                  <select
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value as PosTicketType)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  >
                    <option value="all">Ticket Completo (Cliente + Taller)</option>
                    <option value="customer">Solo Copia Cliente</option>
                    <option value="kitchen">Solo Comanda Taller / Cocina</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Connection Method Tabs */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Seleccione el Método de Conexión:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('direct')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activeTab === 'direct'
                      ? 'bg-pink-50 border-pink-400 text-pink-900 ring-2 ring-pink-200'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Printer className="w-4 h-4 text-pink-600 mb-1" />
                  <span className="font-bold text-xs block">Directo (Spooler)</span>
                  <span className="text-[10px] text-slate-500">Universal · Rápido</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('bluetooth')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activeTab === 'bluetooth'
                      ? 'bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-200'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bluetooth className="w-4 h-4 text-sky-600 mb-1" />
                  <span className="font-bold text-xs block">Bluetooth POS</span>
                  <span className="text-[10px] text-slate-500">Inalámbrico</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('usb')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activeTab === 'usb'
                      ? 'bg-purple-50 border-purple-400 text-purple-900 ring-2 ring-purple-200'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Usb className="w-4 h-4 text-purple-600 mb-1" />
                  <span className="font-bold text-xs block">Cable USB / COM</span>
                  <span className="text-[10px] text-slate-500">Web Serial</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('raw')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activeTab === 'raw'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-200'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Download className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="font-bold text-xs block">ESC/POS Raw</span>
                  <span className="text-[10px] text-slate-500">Archivo / RawBT</span>
                </button>
              </div>

              {/* TAB 1: DIRECT THERMAL PRINT (SYSTEM DIALOG) */}
              {activeTab === 'direct' && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/70 to-white border border-pink-200 space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Printer className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-slate-900 block font-bold text-sm">
                        Impresión Térmica Directa Universal (Recomendada)
                      </strong>
                      Envía el ticket formateado en monocromo puro para rollos de 80mm o 58mm directamente a la impresora de recibos seleccionada en su sistema operativo (Windows, Mac, Linux o Android POS).
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-pink-100 text-[11px] text-slate-600 space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                      <span>Instrucciones en el Diálogo de Impresión:</span>
                    </div>
                    <p>1. Seleccione su impresora punto de venta (ej: <em>Epson TM-T20</em>, <em>Xprinter</em>, <em>POS-80</em>).</p>
                    <p>2. En tamaño de papel seleccione <strong>Roll Paper 80mm</strong> o <strong>58mm</strong>.</p>
                    <p>3. En márgenes elija <strong>Ninguno</strong> para evitar saltos de línea.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDirectPrint}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-600 to-[#f45b96] hover:from-pink-700 hover:to-pink-600 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-pink-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Imprimir Ticket Térmico POS ({paperWidth})</span>
                  </button>
                </div>
              )}

              {/* TAB 2: BLUETOOTH POS */}
              {activeTab === 'bluetooth' && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/70 to-white border border-sky-200 space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Bluetooth className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-slate-900 block font-bold text-sm">
                        Conexión Inalámbrica Web Bluetooth
                      </strong>
                      Permite vincular directamente impresoras térmicas Bluetooth portátiles (muy común en tabletas y celulares de mostrador) enviando comandos nativos ESC/POS sin instalar drivers adicionales.
                    </div>
                  </div>

                  {bluetoothDeviceName && (
                    <div className="p-3 bg-sky-100/70 rounded-xl border border-sky-300 text-xs text-sky-950 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sky-600" />
                        <span>Impresora Vinculada: <strong>{bluetoothDeviceName}</strong></span>
                      </div>
                    </div>
                  )}

                  {bluetoothError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{bluetoothError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isBluetoothConnecting}
                    onClick={handleBluetoothConnectAndPrint}
                    className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                  >
                    <Bluetooth className="w-5 h-5" />
                    <span>
                      {isBluetoothConnecting
                        ? 'Buscando Impresora Bluetooth...'
                        : bluetoothDeviceName
                        ? `Imprimir en ${bluetoothDeviceName}`
                        : 'Buscar & Imprimir por Bluetooth'}
                    </span>
                  </button>
                </div>
              )}

              {/* TAB 3: USB / SERIAL */}
              {activeTab === 'usb' && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 to-white border border-purple-200 space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Usb className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-slate-900 block font-bold text-sm">
                        Conexión Cable USB / Serial (Web Serial API)
                      </strong>
                      Se comunica de forma directa con impresoras térmicas conectadas por cable USB emulando puerto COM serie (BaudRate 9600 / 115200).
                    </div>
                  </div>

                  {isSerialConnected && (
                    <div className="p-3 bg-purple-100/70 rounded-xl border border-purple-300 text-xs text-purple-950 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      <span>Puerto Serial / USB abierto y listo para enviar comandos.</span>
                    </div>
                  )}

                  {serialError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{serialError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isSerialConnecting}
                    onClick={handleSerialConnectAndPrint}
                    className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                  >
                    <Usb className="w-5 h-5" />
                    <span>{isSerialConnecting ? 'Conectando Puerto USB...' : 'Seleccionar Puerto USB & Imprimir'}</span>
                  </button>
                </div>
              )}

              {/* TAB 4: RAW ESC/POS */}
              {activeTab === 'raw' && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-200 space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-slate-900 block font-bold text-sm">
                        Comandos Crudos ESC/POS Binarios (.prn / .bin)
                      </strong>
                      Descargue el archivo de comandos con secuencias de inicialización, negrita, tamaño doble y corte automático de guillotina para cargarlo en utilidades como RawBT, PrintNode o software de caja.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadEscPos}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    <span>Descargar Archivo ESC/POS ({paperWidth})</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Thermal Ticket Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>Vista Previa del Rollo Térmico</span>
                <span className="text-[10px] font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                  {paperWidth}
                </span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {paperWidth === '80mm' ? '42 columnas' : '32 columnas'}
              </span>
            </div>

            {/* Thermal paper replica */}
            <div className="flex-1 bg-stone-100 p-3 rounded-2xl border border-stone-300 flex justify-center items-start overflow-hidden">
              <div
                className={`bg-white text-black p-4 shadow-md font-mono text-[11px] leading-tight select-text overflow-x-hidden ${
                  paperWidth === '80mm' ? 'w-[310px]' : 'w-[230px]'
                }`}
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  filter: 'contrast(120%)'
                }}
              >
                {/* Paper roll top tear effect */}
                <div className="border-b border-dashed border-stone-400 pb-2 mb-2 text-center text-[10px] text-stone-500">
                  *** ROLLO TERMICO POS ***
                </div>

                <pre className="whitespace-pre-wrap font-mono text-[10px] sm:text-[11px] text-black">
                  {previewText}
                </pre>

                {/* Simulated barcode */}
                <div className="mt-3 pt-2 border-t border-dashed border-black text-center">
                  <div className="text-base tracking-[3px] font-black font-mono">
                    ||| | |||| || ||| || ||||
                  </div>
                  <div className="text-[9px] mt-0.5 font-bold tracking-wider">
                    *{order.orderNumber}*
                  </div>
                </div>

                {/* Paper roll bottom tear effect */}
                <div className="border-t border-dashed border-stone-400 mt-4 pt-2 text-center text-[9px] text-stone-400">
                  === CORTE DE GUILLOTINA ===
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Compatible con Xprinter, Epson TM, Star, Bixolon, Munbyn y genéricos ESC/POS.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handleDirectPrint}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-[#00b4d8] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ticket POS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
