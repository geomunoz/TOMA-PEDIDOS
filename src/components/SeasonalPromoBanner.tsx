import React, { useState } from 'react';
import { Sparkles, Flame, Gift, ArrowRight } from 'lucide-react';

interface SeasonalSpecial {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  promo: string;
  dough: string;
  fillings: string[];
}

interface SeasonalPromoBannerProps {
  onApplySpecial?: (special: SeasonalSpecial) => void;
}

export const SeasonalPromoBanner: React.FC<SeasonalPromoBannerProps> = ({ onApplySpecial }) => {
  const [activeSpecialIndex, setActiveSpecialIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const specials: SeasonalSpecial[] = [
    {
      id: 'special-1',
      name: 'Masa Vainilla con Durazno & Crema mosca',
      subtitle: 'Edición Pastel Especial',
      description: 'Bizcocho esponjoso de vainilla artesanal con trozos de durazno fresco y crema mosca con chispitas.',
      badge: 'Favorito del Taller',
      promo: 'Topper personalizado gratis en pedidos de 25 porciones',
      dough: 'Vainilla',
      fillings: ['Durazno', 'Crema mosca']
    },
    {
      id: 'special-2',
      name: 'Masa Mixta con Manjar & Gelatina',
      subtitle: 'Clásico Lojano',
      description: 'Capas alternadas de bizcochuelo de vainilla y chocolate, manjar de leche lojano y refrescante gelatina frutal.',
      badge: 'Más Solicitado',
      promo: '10% de descuento en pedidos agendados con 48h de anticipación',
      dough: 'Mixta',
      fillings: ['Manjar', 'Gelatina']
    },
    {
      id: 'special-3',
      name: 'Masa Chocolate con Crema mosca & Manjar',
      subtitle: 'Tentación Artesanal',
      description: 'Cacao fino de aroma con suave crema mosca y doble capa de manjar artesanal.',
      badge: 'Especial Infantil',
      promo: 'Lámina de arroz decorativa de cortesía',
      dough: 'Chocolate',
      fillings: ['Crema mosca', 'Manjar']
    }
  ];

  const currentSpecial = specials[activeSpecialIndex];

  return (
    <div className="mt-4 pt-4 border-t border-pink-200/60 w-full space-y-3">
      {/* Top Banner Header with Month Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-100/90 px-2.5 py-0.5 rounded-full border border-pink-200 flex items-center gap-1">
            <Flame className="w-3 h-3 text-pink-500" />
            Especiales en Rosa & Celeste Pastel
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">·</span>
          <span className="text-xs text-slate-600 font-medium hidden sm:inline">
            Promociones exclusivas de taller en Loja
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
        >
          {isExpanded ? 'Ocultar sugerencias' : 'Ver sabores sugeridos'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Flavor Tabs Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {specials.map((sp, idx) => {
              const isSelected = activeSpecialIndex === idx;
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setActiveSpecialIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-400 to-sky-400 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-pink-50 border border-pink-200/70'
                  }`}
                >
                  <span>{sp.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Special Showcase Card */}
          <div className="bg-white/90 rounded-xl p-3.5 border border-pink-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {currentSpecial.name}
                </span>
                <span className="text-[10px] text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full font-medium">
                  {currentSpecial.badge}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {currentSpecial.description}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-sky-700 font-semibold pt-0.5">
                <Gift className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span>{currentSpecial.promo}</span>
              </div>
            </div>

            {onApplySpecial && (
              <div className="shrink-0 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onApplySpecial(currentSpecial)}
                  className="px-3.5 py-2 bg-gradient-to-r from-pink-500 to-sky-400 hover:from-pink-600 hover:to-sky-500 active:scale-95 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Pedir esta combinación</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
