import React, { useMemo } from 'react';
import {
  Refrigerator,
  ScanText,
  UtensilsCrossed,
  Plus,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  ChefHat,
  Check
} from 'lucide-react';
import { FoodItem, RecipeMatchResult } from '../types';
import { getItemDateStatus } from '../utils/dateUtils';
import { AppStats } from '../utils/storage';
import { RECIPES_DATA } from '../data/recipes';
import { matchRecipes } from '../utils/recipeMatcher';

interface HomeViewProps {
  foodItems: FoodItem[];
  stats: AppStats;
  onNavigate: (tab: string) => void;
  onOpenAddModal: () => void;
  onLoadSampleData: () => void;
  onOpenRecipeDetail: (matchResult: RecipeMatchResult) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  foodItems,
  stats,
  onNavigate,
  onOpenAddModal,
  onLoadSampleData,
  onOpenRecipeDetail
}) => {
  const activeItems = foodItems.filter(item => item.status === 'active');

  // Approaching items
  const approachingItems = activeItems.filter(item => {
    const { status } = getItemDateStatus(item.expiryDate);
    return status === 'use_soon';
  });

  // Calculate instant matched recipes directly for the homepage showcase
  const topRecipeMatches = useMemo(() => {
    const matches = matchRecipes(RECIPES_DATA, activeItems);
    return matches.slice(0, 3);
  }, [activeItems]);

  const readyRecipesCount = useMemo(() => {
    return matchRecipes(RECIPES_DATA, activeItems).filter(r => r.isReadyToCook).length;
  }, [activeItems]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section with Prominent Front Side Picture */}
      <section className="relative overflow-hidden rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[360px]">
          {/* Left Text Column */}
          <div className="p-6 sm:p-10 lg:col-span-7 flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#52765C]">
              <Sparkles className="w-4 h-4" />
              <span>Use more · Waste less · Understand your food</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#252B27] leading-tight text-balance">
              Make more of the food you have.
            </h1>

            <p className="text-sm sm:text-base text-[#737B74] leading-relaxed max-w-xl">
              Keep track of your groceries, find simple meals you can cook with what is in your kitchen, and understand packaged-food labels in plain English.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAddModal}
                className="min-h-[44px] px-6 py-2.5 text-sm font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Food Item</span>
              </button>
              <button
                onClick={() => onNavigate('recipes')}
                className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-[#252B27] bg-[#E8F0E6] hover:bg-[#d9e7d6] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#52765C]" />
                <span>Find Recipes</span>
              </button>
            </div>
          </div>

          {/* Right Side Picture Column: Prominent, high-res food & kitchen photography */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-[#E7E9E2]">
            <img
              src="/src/assets/images/fresh_ingredients_pantry_1792393797179.jpg"
              alt="Fresh kitchen ingredients and pantry table"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-4 right-4 text-white text-xs lg:hidden drop-shadow-sm font-medium">
              Fresh ingredients from your kitchen
            </div>
          </div>
        </div>
      </section>

      {/* Date reminders banner if approaching items exist */}
      {approachingItems.length > 0 && (
        <section
          aria-label="Expiring Food Reminders"
          className="p-4 sm:p-5 rounded-2xl bg-[#F4EBDD]/70 border border-[#E7E9E2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#B87932]/10 text-[#B87932] shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#252B27]">
                {approachingItems.length === 1
                  ? '1 item approaching its entered date'
                  : `${approachingItems.length} items approaching their entered dates`}
              </h2>
              <p className="text-xs text-[#737B74] mt-0.5">
                {approachingItems.map(i => i.name).slice(0, 3).join(', ')}
                {approachingItems.length > 3 ? ` and ${approachingItems.length - 3} more` : ''}. Use them in recipes before they spoil!
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('recipes')}
            className="min-h-[40px] px-4 py-1.5 text-xs font-semibold text-[#52765C] hover:text-[#43624c] bg-white border border-[#E7E9E2] rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>See recipes using these</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* Compact Real Calculated Dashboard Metrics */}
      <section aria-label="Inventory Metrics Overview">
        <h2 className="text-xs font-semibold text-[#737B74] uppercase tracking-wider mb-3">
          Your Household Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs">
            <div className="flex items-center justify-between text-[#737B74] mb-2">
              <span className="text-xs font-medium">In Inventory</span>
              <Refrigerator className="w-4 h-4 text-[#52765C]" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#252B27] tabular-nums">
              {activeItems.length}
            </p>
            <p className="text-[11px] text-[#737B74] mt-1">
              Active pantry & fridge items
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs">
            <div className="flex items-center justify-between text-[#737B74] mb-2">
              <span className="text-xs font-medium">Use Soon</span>
              <Clock className="w-4 h-4 text-[#B87932]" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#B87932] tabular-nums">
              {approachingItems.length}
            </p>
            <p className="text-[11px] text-[#737B74] mt-1">
              Date approaching in ≤ 3 days
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs">
            <div className="flex items-center justify-between text-[#737B74] mb-2">
              <span className="text-xs font-medium">Ready Recipes</span>
              <ChefHat className="w-4 h-4 text-[#52765C]" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#52765C] tabular-nums">
              {readyRecipesCount}
            </p>
            <p className="text-[11px] text-[#737B74] mt-1">
              Dishes you can cook right now
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs">
            <div className="flex items-center justify-between text-[#737B74] mb-2">
              <span className="text-xs font-medium">Items Used</span>
              <CheckCircle className="w-4 h-4 text-[#52765C]" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#52765C] tabular-nums">
              {stats.usedCount}
            </p>
            <p className="text-[11px] text-[#737B74] mt-1">
              Successfully cooked
            </p>
          </div>
        </div>
      </section>

      {/* Instant Recipe Suggestions Showcase Right on Home Page */}
      {topRecipeMatches.length > 0 && activeItems.length > 0 && (
        <section aria-label="Quick Recipe Ideas" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#252B27]">
                Dishes you can make with your ingredients
              </h2>
              <p className="text-xs text-[#737B74]">
                Matched against the groceries you currently have at home.
              </p>
            </div>
            <button
              onClick={() => onNavigate('recipes')}
              className="text-xs font-semibold text-[#52765C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See All Recipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topRecipeMatches.map(match => (
              <div
                key={match.recipe.id}
                className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs flex flex-col justify-between hover:border-[#52765C]/40 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#52765C]">
                      {match.isReadyToCook ? '✓ Ready to Cook' : `${match.matchPercentage}% match`}
                    </span>
                    <span className="text-[#737B74] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{match.recipe.prepTimeMinutes + match.recipe.cookTimeMinutes}m</span>
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#252B27] line-clamp-1">
                    {match.recipe.name}
                  </h3>
                  <p className="text-xs text-[#737B74] line-clamp-2">
                    {match.reason}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E7E9E2]">
                  <button
                    onClick={() => onOpenRecipeDetail(match)}
                    className="min-h-[38px] w-full px-3 py-1.5 text-xs font-semibold text-[#252B27] bg-[#FAFAF6] hover:bg-[#52765C] hover:text-white border border-[#E7E9E2] rounded-xl transition-colors cursor-pointer text-center"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3 Core Feature Modules */}
      <section aria-label="Core Feature Modules" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Reduce Food Waste */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] flex flex-col justify-between shadow-2xs hover:border-[#52765C]/40 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F0E6] text-[#52765C] flex items-center justify-center mb-4">
              <Refrigerator className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#252B27]">
              1. My Food
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#737B74] leading-relaxed">
              Track groceries in your fridge and pantry. Keep entered dates so you never forget what needs to be cooked first.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#E7E9E2]">
            <button
              onClick={() => onNavigate('my-food')}
              className="min-h-[44px] w-full px-4 py-2 text-xs font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Manage My Food</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Recipe Finder */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] flex flex-col justify-between shadow-2xs hover:border-[#52765C]/40 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F0E6] text-[#52765C] flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#252B27]">
              2. Recipe Finder
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#737B74] leading-relaxed">
              Find easy meals you can cook with what you already have. Prioritizes items marked "Use soon" so nothing is wasted.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#E7E9E2]">
            <button
              onClick={() => onNavigate('recipes')}
              className="min-h-[44px] w-full px-4 py-2 text-xs font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Find Recipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Understand Food Labels */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] flex flex-col justify-between shadow-2xs hover:border-[#52765C]/40 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#F4EBDD] text-[#B87932] flex items-center justify-center mb-4">
              <ScanText className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#252B27]">
              3. Food Labels
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#737B74] leading-relaxed">
              Decode sugars, additives, and declared allergens on packaged foods. Upload a photo or enter details in simple English.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#E7E9E2]">
            <button
              onClick={() => onNavigate('label-explainer')}
              className="min-h-[44px] w-full px-4 py-2 text-xs font-semibold text-[#252B27] bg-[#FAFAF6] hover:bg-[#E8F0E6] border border-[#E7E9E2] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explain a Food Label</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Empty State Banner if 0 active items */}
      {activeItems.length === 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#E8F0E6] text-[#52765C] flex items-center justify-center">
              <Refrigerator className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#252B27]">
              Your inventory is currently empty
            </h2>
            <p className="text-sm text-[#737B74] leading-relaxed">
              Add the fresh produce, dairy, or staples you have at home to see date reminders and discover matching recipes.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOpenAddModal}
                className="min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors cursor-pointer"
              >
                Add Your First Food Item
              </button>
              <button
                onClick={onLoadSampleData}
                className="min-h-[44px] px-4 py-2 text-sm font-medium text-[#737B74] hover:text-[#252B27] bg-[#FAFAF6] border border-[#E7E9E2] rounded-xl transition-colors cursor-pointer"
              >
                Load Sample Pantry
              </button>
            </div>
          </div>
        </section>
      )}

      {/* How to use Nourish AI — 3 Step Guide */}
      <section aria-label="Getting Started Steps" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs">
        <h2 className="text-lg font-bold text-[#252B27] mb-2">
          How to Use Nourish AI
        </h2>
        <p className="text-xs sm:text-sm text-[#737B74] mb-6">
          Three easy steps to reduce waste and eat well.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#E8F0E6] text-[#52765C] font-semibold text-xs flex items-center justify-center font-mono">
              1
            </div>
            <h3 className="font-semibold text-sm text-[#252B27]">
              Add food you have at home
            </h3>
            <p className="text-xs text-[#737B74] leading-relaxed">
              Record vegetables, dairy, or staples in your kitchen. Adding entered dates tells you what to cook first.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#E8F0E6] text-[#52765C] font-semibold text-xs flex items-center justify-center font-mono">
              2
            </div>
            <h3 className="font-semibold text-sm text-[#252B27]">
              Cook matching recipes
            </h3>
            <p className="text-xs text-[#737B74] leading-relaxed">
              The Recipe Finder picks dishes that use up your items, prioritizing anything marked "Use soon".
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#E8F0E6] text-[#52765C] font-semibold text-xs flex items-center justify-center font-mono">
              3
            </div>
            <h3 className="font-semibold text-sm text-[#252B27]">
              Understand food labels
            </h3>
            <p className="text-xs text-[#737B74] leading-relaxed">
              Upload a package photo or paste nutrition numbers to get a plain-English explanation of what's inside.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Notice Footer */}
      <section className="p-4 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2] flex items-start gap-3 text-xs text-[#737B74]">
        <ShieldCheck className="w-4 h-4 text-[#52765C] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#252B27] font-semibold">Food Safety Note: </strong>
          Reminders are based on user-entered dates and do not guarantee safety. Always use your senses — check appearance, smell, and texture before eating or cooking.
        </p>
      </section>
    </div>
  );
};
