import React, { useState } from 'react';
import { X, Clock, Users, CheckCircle2, AlertCircle, Sparkles, ChefHat } from 'lucide-react';
import { RecipeMatchResult } from '../types';

interface RecipeModalProps {
  matchResult: RecipeMatchResult | null;
  onClose: () => void;
  onConfirmUseIngredients: (matchResult: RecipeMatchResult) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  matchResult,
  onClose,
  onConfirmUseIngredients
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!matchResult) return null;
  const { recipe, matchedIngredients, missingIngredients, reason, isReadyToCook } = matchResult;

  const handleConfirm = () => {
    onConfirmUseIngredients(matchResult);
    setShowConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-[#FFFFFF] border border-[#E7E9E2] rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl"
        role="dialog"
        aria-labelledby="recipe-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E7E9E2]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#737B74] mb-1">
              <span className="font-semibold text-[#52765C]">{recipe.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{recipe.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}</span>
              <span aria-hidden="true">·</span>
              <span>{recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}</span>
            </div>
            <h2 id="recipe-modal-title" className="text-xl sm:text-2xl font-bold text-[#252B27]">
              {recipe.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[#737B74] hover:text-[#252B27] hover:bg-[#FAFAF6] transition-colors cursor-pointer shrink-0"
            aria-label="Close recipe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        {/* Quick Info bar */}
        <div className="flex flex-wrap items-center gap-4 py-3 my-4 px-4 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2] text-xs text-[#252B27]">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-[#52765C]" />
            <span>Prep: {recipe.prepTimeMinutes}m</span>
          </div>
          <span className="text-[#E7E9E2]">|</span>
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-[#52765C]" />
            <span>Cook: {recipe.cookTimeMinutes}m</span>
          </div>
          <span className="text-[#E7E9E2]">|</span>
          <div className="flex items-center gap-1.5 font-medium">
            <Users className="w-4 h-4 text-[#52765C]" />
            <span>Serves {recipe.servings}</span>
          </div>
        </div>

        {/* Readiness Banner */}
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 mb-5 border ${
            isReadyToCook
              ? 'bg-[#E8F0E6] text-[#252B27] border-[#52765C]/30'
              : 'bg-[#F4EBDD]/60 text-[#252B27] border-[#B87932]/30'
          }`}
        >
          {isReadyToCook ? (
            <CheckCircle2 className="w-4 h-4 text-[#52765C] shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#B87932] shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-sm">
              {isReadyToCook ? 'Ready to cook now!' : 'Almost ready'}
            </p>
            <p className="mt-0.5 text-xs text-[#737B74] leading-relaxed">{reason}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#737B74] leading-relaxed mb-6">
          {recipe.description}
        </p>

        {/* Ingredients Checklist */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base text-[#252B27]">
              Ingredients Needed
            </h3>
            <span className="text-xs text-[#737B74]">
              You have {matchedIngredients.length} of {recipe.ingredients.filter(i => !i.isPantryStaple).length} ingredients
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {recipe.ingredients.map((ing, idx) => {
              const isMatched = matchedIngredients.includes(ing.name);

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                    isMatched
                      ? 'bg-[#E8F0E6]/50 border-[#52765C]/30 text-[#252B27]'
                      : ing.isPantryStaple
                      ? 'bg-[#FAFAF6] border-[#E7E9E2] text-[#737B74]'
                      : 'bg-[#FFFFFF] border-[#E7E9E2] text-[#252B27]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isMatched ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#52765C] shrink-0" />
                    ) : ing.isPantryStaple ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#737B74] shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-[#B87932] shrink-0" />
                    )}
                    <span className="font-medium truncate">{ing.name}</span>
                  </div>
                  <span className="text-[#737B74] shrink-0 font-mono text-[11px]">
                    {ing.quantity}
                  </span>
                </div>
              );
            })}
          </div>

          {missingIngredients.length > 0 && (
            <p className="text-xs text-[#737B74] mt-2">
              <span className="font-semibold text-[#B87932]">Still needed: </span>
              {missingIngredients.map(i => i.name).join(', ')}
            </p>
          )}
        </div>

        {/* Step-by-Step Instructions */}
        <div className="mb-6">
          <h3 className="font-bold text-base text-[#252B27] mb-3">
            Simple Cooking Steps
          </h3>
          <ol className="space-y-3">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27] leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-[#FAFAF6] border border-[#E7E9E2] font-semibold text-[#52765C] flex items-center justify-center shrink-0 text-xs mt-0.5 font-mono">
                  {idx + 1}
                </span>
                <p className="flex-1 pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Chef Tip */}
        {recipe.tips && (
          <div className="p-3.5 rounded-2xl bg-[#F4EBDD]/50 border border-[#E7E9E2] text-xs text-[#252B27] flex items-start gap-2.5 mb-6">
            <ChefHat className="w-4 h-4 text-[#B87932] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-[#252B27]">Helpful Kitchen Tip</span>
              <span className="text-[#737B74] mt-0.5 leading-relaxed">{recipe.tips}</span>
            </div>
          </div>
        )}

        {/* Footer actions */}
        {showConfirm ? (
          <div className="p-4 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2] space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-[#252B27]">
              Confirm: Mark these ingredients as used in your pantry?
            </p>
            <p className="text-xs text-[#737B74]">
              This will record {matchedIngredients.join(', ')} as used, keeping your household inventory accurate.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="min-h-[44px] px-4 py-2 text-xs font-medium text-[#737B74] hover:text-[#252B27] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors cursor-pointer"
              >
                Yes, Update My Inventory
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-[#E7E9E2] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="min-h-[44px] px-5 py-2 text-sm font-medium text-[#737B74] hover:text-[#252B27] hover:bg-[#FAFAF6] rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>

            {matchedIngredients.length > 0 && (
              <button
                onClick={() => setShowConfirm(true)}
                className="min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Mark Ingredients as Used
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
