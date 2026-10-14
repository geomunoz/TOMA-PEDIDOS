import React from 'react';
import { Cake, FileText, LayoutDashboard } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'builder' | 'receipt' | 'admin';
  onSelectTab: (tab: 'builder' | 'receipt' | 'admin') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'builder' as const, label: 'Personalizar', icon: Cake, activeColor: 'text-[#f45b96]', dotColor: 'bg-[#f45b96]' },
    { id: 'receipt' as const, label: 'Nota Pedido', icon: FileText, activeColor: 'text-[#00b4d8]', dotColor: 'bg-[#00b4d8]' },
    { id: 'admin' as const, label: 'Panel Taller', icon: LayoutDashboard, activeColor: 'text-[#f45b96]', dotColor: 'bg-[#f45b96]' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 md:hidden no-print shadow-lg">
      <div className="grid grid-cols-3 items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
                isActive ? `${tab.activeColor} font-bold` : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] tracking-tight mt-1 truncate">
                {tab.label}
              </span>
              {isActive && (
                <span className={`w-1.5 h-1.5 ${tab.dotColor} rounded-full mt-0.5`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
