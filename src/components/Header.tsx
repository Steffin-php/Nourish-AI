import React from 'react';
import { Leaf, Plus, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenHelpModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenAddModal,
  onOpenHelpModal
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAFAF6]/95 backdrop-blur-md border-b border-[#E7E9E2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left group transition-opacity hover:opacity-90 cursor-pointer"
          aria-label="Nourish AI home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#52765C] flex items-center justify-center text-white shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#252B27] whitespace-nowrap shrink-0">
            Nourish AI
          </span>
        </button>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#737B74]" aria-label="Main Navigation">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentTab === 'home'
                ? 'text-[#52765C] font-semibold border-b-2 border-[#52765C]'
                : 'hover:text-[#252B27]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('my-food')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentTab === 'my-food'
                ? 'text-[#52765C] font-semibold border-b-2 border-[#52765C]'
                : 'hover:text-[#252B27]'
            }`}
          >
            My Food
          </button>
          <button
            onClick={() => onNavigate('recipes')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentTab === 'recipes'
                ? 'text-[#52765C] font-semibold border-b-2 border-[#52765C]'
                : 'hover:text-[#252B27]'
            }`}
          >
            Recipe Finder
          </button>
          <button
            onClick={() => onNavigate('label-explainer')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentTab === 'label-explainer'
                ? 'text-[#52765C] font-semibold border-b-2 border-[#52765C]'
                : 'hover:text-[#252B27]'
            }`}
          >
            Food Label Explainer
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenHelpModal}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#E7E9E2] text-[#737B74] hover:text-[#252B27] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
            title="How to use Nourish AI"
            aria-label="Help and instructions"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenAddModal}
            className="min-h-[44px] px-4 py-2 text-sm font-medium text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food</span>
          </button>
        </div>
      </div>
    </header>
  );
};
