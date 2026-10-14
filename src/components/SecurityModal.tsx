import React from 'react';
import { ShieldCheck, Lock, KeyRound, AlertTriangle, FileCheck, X } from 'lucide-react';
import { BAKERY_INFO } from '../data/constants';
import { BakeryLogo } from './BakeryLogo';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-pink-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-pink-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-pink-200 shadow-2xs flex items-center justify-center">
              <BakeryLogo variant="icon" size="xs" />
            </div>
            <div>
              <h3 className="font-serif-title text-lg font-bold text-slate-900">
                Seguridad & Confidencialidad
              </h3>
              <p className="text-xs text-slate-500">La Viña Dulce · Protocolos de encriptación y privacidad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-100 flex gap-3">
            <Lock className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">Cifrado de Extremo a Extremo (E2EE)</strong>
              Cada nota de pedido viaja mediante túnel SSL/TLS con cifrado AES-256 bits, garantizando que los datos de contacto y detalles personales permanezcan estrictamente confidenciales entre usted y el maestro pastelero.
            </div>
          </div>

          <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 flex gap-3">
            <KeyRound className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">Pagos Seguros Tokenizados (Deuna, Ahorita, CoopMego)</strong>
              Las transacciones de anticipo se procesan mediante APIs bancarias directas y pasarelas con cumplimiento PCI-DSS. Jamás almacenamos claves, pines ni datos bancarios en servidores intermedios.
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
            <FileCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">Protección de Datos Personales (Ecuador)</strong>
              Cumplimos con la Ley Orgánica de Protección de Datos Personales del Ecuador. Su número de cédula, teléfono y dirección se usan exclusivamente para la emisión de la Nota de Pedido y la entrega de su pastel.
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex gap-3 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">Políticas de Anticipo e Inocuidad Alimentaria</strong>
              {BAKERY_INFO.legalWarning}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-pink-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#f45b96] to-[#00b4d8] hover:opacity-95 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
