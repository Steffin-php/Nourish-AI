import React from 'react';
import { X, ShieldAlert, Sparkles, Refrigerator, UtensilsCrossed, ScanText } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-[#FFFFFF] border border-[#E7E9E2] rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-xl"
        role="dialog"
        aria-labelledby="help-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E7E9E2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F0E6] text-[#52765C] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 id="help-title" className="text-xl font-bold text-[#252B27]">
              How Nourish AI Works
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[#737B74] hover:text-[#252B27] hover:bg-[#FAFAF6] transition-colors cursor-pointer"
            aria-label="Close help modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 pt-5 text-sm text-[#252B27]">
          {/* Section 1: Overview */}
          <div>
            <h3 className="font-semibold text-base mb-1">Our Core Mission</h3>
            <p className="text-[#737B74] leading-relaxed">
              Nourish AI helps everyday households use the groceries they already have, prevent avoidable food waste, and understand complex food label terms without confusing jargon.
            </p>
          </div>

          {/* Section 2: Features */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base">Key Features</h3>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2]">
              <div className="p-2 bg-[#E8F0E6] text-[#52765C] rounded-xl shrink-0 mt-0.5">
                <Refrigerator className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-[#252B27]">My Food Inventory</p>
                <p className="text-xs text-[#737B74] mt-0.5">
                  Keep track of pantry, fridge, and freezer items. Enter expiry or best-before dates to receive timely reminders before groceries spoil.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2]">
              <div className="p-2 bg-[#E8F0E6] text-[#52765C] rounded-xl shrink-0 mt-0.5">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-[#252B27]">Recipe Finder</p>
                <p className="text-xs text-[#737B74] mt-0.5">
                  See dishes you can cook with what is in your kitchen right now. Highlights meals where you already have all ingredients and prioritizes items that need to be used soon.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2]">
              <div className="p-2 bg-[#E8F0E6] text-[#52765C] rounded-xl shrink-0 mt-0.5">
                <ScanText className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-[#252B27]">Food Label Explainer</p>
                <p className="text-xs text-[#737B74] mt-0.5">
                  Upload a photo or paste nutrition information from packaged food. Get a clear breakdown of calories, sugars, additives, and declared allergens in plain English.
                </p>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-4 rounded-2xl bg-[#F4EBDD]/50 border border-[#E7E9E2] text-xs leading-relaxed space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-[#B87932]">
              <ShieldAlert className="w-4 h-4" />
              <span>Important Food Safety Reminder</span>
            </div>
            <p className="text-[#252B27]">
              Date statuses are reminders calculated solely from user-entered dates. They are not a laboratory guarantee of food freshness or safety.
            </p>
            <p className="text-[#737B74]">
              Always inspect appearance, smell, and texture before cooking. If food appears spoiled, do not consume it.
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="p-4 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2] text-xs text-[#737B74] leading-relaxed">
            <span className="font-semibold text-[#252B27] block mb-1">Privacy & Storage</span>
            Your food inventory is saved privately in your local browser storage. It is never uploaded to external databases. Label photos sent to the explainer are processed solely for text extraction and analysis.
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E7E9E2] flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 bg-[#52765C] hover:bg-[#43624c] text-white font-medium rounded-xl transition-colors cursor-pointer text-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
