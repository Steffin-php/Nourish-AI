import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Clock,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Check
} from 'lucide-react';
import { FoodItem, RecipeMatchResult } from '../types';
import { RECIPES_DATA } from '../data/recipes';
import { matchRecipes } from '../utils/recipeMatcher';

interface RecipeFinderViewProps {
  foodItems: FoodItem[];
  onOpenRecipeDetail: (matchResult: RecipeMatchResult) => void;
  onNavigateToMyFood: () => void;
}

export const RecipeFinderView: React.FC<RecipeFinderViewProps> = ({
  foodItems,
  onOpenRecipeDetail,
  onNavigateToMyFood
}) => {
  const activeItems = useMemo(() => foodItems.filter(i => i.status === 'active'), [foodItems]);

  // Which inventory items are included
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() => activeItems.map(i => i.id));
  const [manualIngredients, setManualIngredients] = useState<string[]>([]);
  const [newIngredientInput, setNewIngredientInput] = useState('');
  const [preference, setPreference] = useState<'all' | 'vegetarian' | 'non_vegetarian'>('all');
  const [viewTab, setViewTab] = useState<'all' | 'ready' | 'quick'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleInventoryItem = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddManualIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientInput.trim()) return;
    const clean = newIngredientInput.trim();
    if (!manualIngredients.includes(clean)) {
      setManualIngredients(prev => [...prev, clean]);
    }
    setNewIngredientInput('');
  };

  const handleRemoveManualIngredient = (name: string) => {
    setManualIngredients(prev => prev.filter(i => i !== name));
  };

  const selectedInventoryItems = useMemo(
    () => activeItems.filter(item => selectedItemIds.includes(item.id)),
    [activeItems, selectedItemIds]
  );

  // Match all
  const allMatched = useMemo(() => {
    return matchRecipes(RECIPES_DATA, selectedInventoryItems, manualIngredients, {
      preference,
      searchQuery,
      maxTimeMinutes: viewTab === 'quick' ? 18 : undefined
    });
  }, [selectedInventoryItems, manualIngredients, preference, searchQuery, viewTab]);

  // Filter based on simple view tabs:
  const displayedRecipes = useMemo(() => {
    if (viewTab === 'ready') {
      return allMatched.filter(r => r.isReadyToCook);
    }
    return allMatched;
  }, [allMatched, viewTab]);

  const readyToCookCount = useMemo(() => allMatched.filter(r => r.isReadyToCook).length, [allMatched]);

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Introduction */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#252B27]">
          What can you cook today?
        </h1>
        <p className="text-sm text-[#737B74] mt-0.5">
          We match the ingredients already in your kitchen with simple meals you can cook right now.
        </p>
      </div>

      {/* How it works - 3 Simple Steps Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#E8F0E6] text-[#52765C] font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span className="text-[#252B27]">
              Check items in your kitchen below
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#E8F0E6] text-[#52765C] font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span className="text-[#252B27]">
              See meals you have ingredients for
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#E8F0E6] text-[#52765C] font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <span className="text-[#252B27]">
              Follow simple steps and cook
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Your Kitchen Ingredients */}
      <section
        aria-label="Pantry Ingredients"
        className="p-5 sm:p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7E9E2]">
          <div>
            <h2 className="text-sm font-bold text-[#252B27] flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#52765C]" />
              <span>Ingredients Being Used for Matching ({selectedInventoryItems.length})</span>
            </h2>
            <p className="text-xs text-[#737B74] mt-0.5">
              Tap any item to include or exclude it from today's recipe suggestions.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#737B74]">
            <button
              onClick={() => setSelectedItemIds(activeItems.map(i => i.id))}
              className="hover:text-[#52765C] cursor-pointer"
            >
              Select All
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setSelectedItemIds([])}
              className="hover:text-[#B94A48] cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Selected Inventory Chips */}
        {activeItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeItems.map(item => {
              const isSelected = selectedItemIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleInventoryItem(item.id)}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#E8F0E6] text-[#252B27] border-[#52765C]/40 font-semibold shadow-2xs'
                      : 'bg-[#FAFAF6] text-[#737B74] border-[#E7E9E2] hover:text-[#252B27]'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-md flex items-center justify-center text-[11px] ${
                      isSelected ? 'bg-[#52765C] text-white' : 'border border-[#737B74]'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#737B74]">
            No items in your inventory yet.{' '}
            <button
              onClick={onNavigateToMyFood}
              className="text-[#52765C] underline font-medium cursor-pointer"
            >
              Add groceries in My Food
            </button>{' '}
            or type extra items below!
          </p>
        )}

        {/* Add extra ingredient input */}
        <div className="pt-3 border-t border-[#E7E9E2]">
          <form onSubmit={handleAddManualIngredient} className="flex gap-2">
            <input
              type="text"
              value={newIngredientInput}
              onChange={e => setNewIngredientInput(e.target.value)}
              placeholder="Have something else? (e.g. Eggs, Bread, Potatoes)"
              className="flex-1 min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C]"
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Search</span>
            </button>
          </form>

          {manualIngredients.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {manualIngredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAFAF6] border border-[#E7E9E2] text-xs text-[#252B27]"
                >
                  <span>{ing}</span>
                  <button
                    onClick={() => handleRemoveManualIngredient(ing)}
                    className="text-[#737B74] hover:text-[#B94A48] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Step 2: Simple View Tabs & Diet Filter */}
      <section aria-label="Simple View Filters" className="flex flex-wrap items-center justify-between gap-3">
        {/* Simple Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#FFFFFF] rounded-2xl border border-[#E7E9E2]">
          <button
            onClick={() => setViewTab('all')}
            className={`min-h-[40px] px-4 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
              viewTab === 'all'
                ? 'bg-[#52765C] text-white font-semibold shadow-2xs'
                : 'text-[#737B74] hover:text-[#252B27]'
            }`}
          >
            All Suggestions ({allMatched.length})
          </button>
          <button
            onClick={() => setViewTab('ready')}
            className={`min-h-[40px] px-4 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewTab === 'ready'
                ? 'bg-[#52765C] text-white font-semibold shadow-2xs'
                : 'text-[#737B74] hover:text-[#252B27]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready to Cook Now ({readyToCookCount})</span>
          </button>
          <button
            onClick={() => setViewTab('quick')}
            className={`min-h-[40px] px-4 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
              viewTab === 'quick'
                ? 'bg-[#52765C] text-white font-semibold shadow-2xs'
                : 'text-[#737B74] hover:text-[#252B27]'
            }`}
          >
            Quick (&le; 18 mins)
          </button>
        </div>

        {/* Dietary preference */}
        <div className="flex items-center gap-1 p-1 bg-[#FFFFFF] rounded-2xl border border-[#E7E9E2]">
          <button
            onClick={() => setPreference('all')}
            className={`min-h-[38px] px-3 py-1 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
              preference === 'all' ? 'bg-[#FAFAF6] text-[#252B27] font-semibold border border-[#E7E9E2]' : 'text-[#737B74]'
            }`}
          >
            All Diets
          </button>
          <button
            onClick={() => setPreference('vegetarian')}
            className={`min-h-[38px] px-3 py-1 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
              preference === 'vegetarian' ? 'bg-[#FAFAF6] text-[#252B27] font-semibold border border-[#E7E9E2]' : 'text-[#737B74]'
            }`}
          >
            Vegetarian
          </button>
          <button
            onClick={() => setPreference('non_vegetarian')}
            className={`min-h-[38px] px-3 py-1 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
              preference === 'non_vegetarian' ? 'bg-[#FAFAF6] text-[#252B27] font-semibold border border-[#E7E9E2]' : 'text-[#737B74]'
            }`}
          >
            Non-Veg
          </button>
        </div>
      </section>

      {/* Step 3: Clear Recipe Cards Grid */}
      {displayedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedRecipes.map(result => {
            const { recipe, matchedIngredients, missingIngredients, reason, matchPercentage, isReadyToCook } = result;

            return (
              <div
                key={recipe.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs hover:border-[#52765C]/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Status & Meta Row */}
                  <div className="flex items-center justify-between gap-2">
                    {isReadyToCook ? (
                      <span className="bg-[#52765C] text-white px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        <span>Ready to Cook</span>
                      </span>
                    ) : (
                      <span className="bg-[#FAFAF6] text-[#737B74] px-2.5 py-1 rounded-xl border border-[#E7E9E2] text-xs font-semibold tabular-nums">
                        {matchPercentage}% available
                      </span>
                    )}

                    <div className="flex items-center gap-2 text-xs text-[#737B74]">
                      <span className="font-semibold text-[#52765C]">
                        {recipe.difficulty}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-[#737B74] mb-0.5">
                      {recipe.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'} · {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
                    </div>
                    <h3 className="text-base font-bold text-[#252B27] line-clamp-1">
                      {recipe.name}
                    </h3>
                  </div>

                  {/* Plain English Reason */}
                  <p className="text-xs text-[#252B27] bg-[#FAFAF6] p-2.5 rounded-xl border border-[#E7E9E2] leading-relaxed">
                    {reason}
                  </p>

                  {/* Simple ingredients breakdown */}
                  <div className="text-xs space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-[#52765C]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        You have: {matchedIngredients.join(', ')}
                      </span>
                    </div>

                    {missingIngredients.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[#737B74]">
                        <AlertCircle className="w-3.5 h-3.5 text-[#B87932] shrink-0" />
                        <span className="truncate">
                          Need: {missingIngredients.map(i => i.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 border-t border-[#E7E9E2]">
                  <button
                    onClick={() => onOpenRecipeDetail(result)}
                    className={`min-h-[44px] w-full px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center ${
                      isReadyToCook
                        ? 'bg-[#52765C] hover:bg-[#43624c] text-white shadow-sm'
                        : 'bg-[#FAFAF6] hover:bg-[#E8F0E6] text-[#252B27] border border-[#E7E9E2]'
                    }`}
                  >
                    View Recipe & Cooking Steps
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] text-center space-y-3">
          <p className="text-base font-semibold text-[#252B27]">
            No recipes matching your selected view
          </p>
          <p className="text-xs sm:text-sm text-[#737B74] max-w-md mx-auto">
            Try switching to "All Suggestions" or adding more ingredients from your pantry.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setViewTab('all');
                setPreference('all');
                setSelectedItemIds(activeItems.map(i => i.id));
              }}
              className="min-h-[44px] px-5 py-2 text-xs font-semibold text-[#52765C] bg-[#E8F0E6] rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
