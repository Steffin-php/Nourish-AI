import React from 'react';
import { Home, Refrigerator, UtensilsCrossed, ScanText } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'my-food', label: 'My Food', icon: Refrigerator },
    { id: 'recipes', label: 'Recipes', icon: UtensilsCrossed },
    { id: 'label-explainer', label: 'Food Labels', icon: ScanText }
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E7E9E2] md:hidden safe-area-inset-bottom"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 cursor-pointer transition-colors ${
                isActive ? 'text-[#52765C]' : 'text-[#737B74] hover:text-[#252B27]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
              <span className={`text-[11px] font-medium tracking-tight mt-1 ${isActive ? 'font-semibold text-[#52765C]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
