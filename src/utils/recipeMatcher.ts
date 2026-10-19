import { FoodItem, Recipe, RecipeMatchResult } from '../types';
import { isItemApproachingDate } from './dateUtils';

// Normalized synonyms
const SYNONYM_MAP: Record<string, string[]> = {
  tomato: ['tomatoes', 'tamatar', 'ripe tomato', 'canned tomatoes', 'cherry tomato'],
  onion: ['onions', 'pyaz', 'red onion', 'white onion', 'shallots'],
  potato: ['potatoes', 'aloo', 'baby potatoes'],
  'bell pepper': ['capsicum', 'peppers', 'green pepper', 'green bell pepper'],
  egg: ['eggs', 'anda', 'boiled eggs'],
  lentils: ['dal', 'daal', 'yellow lentils', 'toor dal', 'moong dal'],
  chickpeas: ['chana', 'kabuli chana', 'garbanzo beans', 'canned chickpeas'],
  spinach: ['palak', 'baby spinach'],
  yogurt: ['curd', 'dahi', 'plain yogurt', 'greek yogurt'],
  paneer: ['cottage cheese', 'tofu'],
  rice: ['basmati rice', 'cooked rice', 'white rice', 'brown rice'],
  carrot: ['carrots', 'gajar'],
  peas: ['green peas', 'frozen peas', 'matar'],
  bread: ['bread slices', 'sliced bread', 'toast'],
  milk: ['whole milk', 'dairy milk'],
  garlic: ['garlic cloves', 'minced garlic'],
  oats: ['rolled oats', 'quick oats', 'oatmeal'],
  banana: ['bananas', 'ripe banana'],
  cucumber: ['cucumbers', 'kheera'],
  lemon: ['lemons', 'lemon juice'],
  cauliflower: ['gobi', 'cauliflower florets'],
  pasta: ['spaghetti', 'penne', 'spaghetti or pasta', 'noodles'],
  'flattened rice': ['poha', 'flattened rice flakes']
};

function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
}

export function doesIngredientMatch(invName: string, recipeName: string): boolean {
  const a = normalize(invName);
  const b = normalize(recipeName);
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  if (a + 's' === b || b + 's' === a) return true;
  if (a + 'es' === b || b + 'es' === a) return true;

  for (const [canonical, variants] of Object.entries(SYNONYM_MAP)) {
    const aMatch = a === canonical || variants.some(v => a.includes(v) || v.includes(a));
    const bMatch = b === canonical || variants.some(v => b.includes(v) || v.includes(b));
    if (aMatch && bMatch) return true;
  }
  return false;
}

export interface MatchFilterOptions {
  preference: 'all' | 'vegetarian' | 'non_vegetarian';
  maxTimeMinutes?: number;
  searchQuery?: string;
  readyOnly?: boolean;
}

export function matchRecipes(
  recipes: Recipe[],
  activeInventory: FoodItem[],
  manualIngredients: string[] = [],
  options: MatchFilterOptions = { preference: 'all' }
): RecipeMatchResult[] {
  const availableItems: Array<{ name: string; isUseSoon: boolean }> = [
    ...activeInventory.map(item => ({
      name: item.name,
      isUseSoon: isItemApproachingDate(item.expiryDate)
    })),
    ...manualIngredients.map(name => ({ name, isUseSoon: false }))
  ];

  const results: RecipeMatchResult[] = [];

  for (const recipe of recipes) {
    if (options.preference === 'vegetarian' && !recipe.isVegetarian) continue;
    if (options.preference === 'non_vegetarian' && recipe.isVegetarian) continue;

    const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
    if (options.maxTimeMinutes && totalTime > options.maxTimeMinutes) continue;

    if (options.searchQuery && options.searchQuery.trim()) {
      const q = normalize(options.searchQuery);
      const inName = normalize(recipe.name).includes(q);
      const inDesc = normalize(recipe.description).includes(q);
      const inIng = recipe.ingredients.some(i => normalize(i.name).includes(q));
      if (!inName && !inDesc && !inIng) continue;
    }

    const matchedIngredients: string[] = [];
    const missingIngredients = [];
    const useSoonIngredientsUsed: string[] = [];

    const mainIngredients = recipe.ingredients.filter(i => !i.isPantryStaple);
    const totalRequired = mainIngredients.length;

    for (const req of mainIngredients) {
      const found = availableItems.find(av => doesIngredientMatch(av.name, req.name));
      if (found) {
        matchedIngredients.push(req.name);
        if (found.isUseSoon && !useSoonIngredientsUsed.includes(found.name)) {
          useSoonIngredientsUsed.push(found.name);
        }
      } else {
        missingIngredients.push(req);
      }
    }

    const matchedCount = matchedIngredients.length;
    const isReadyToCook = matchedCount === totalRequired;

    if (options.readyOnly && !isReadyToCook) continue;

    const matchPercentage = totalRequired > 0 ? Math.round((matchedCount / totalRequired) * 100) : 0;

    let reason = '';
    if (isReadyToCook) {
      reason = 'Ready to cook! You have all the main ingredients.';
      if (useSoonIngredientsUsed.length > 0) {
        reason += ` Helps you use ${useSoonIngredientsUsed.join(', ')} on time.`;
      }
    } else if (matchedCount > 0) {
      reason = `Uses your ${matchedIngredients.slice(0, 2).join(' & ')}`;
      if (useSoonIngredientsUsed.length > 0) {
        reason += ` (${useSoonIngredientsUsed[0]} needs to be used soon)`;
      }
      reason += `. Only missing ${missingIngredients.length} item.`;
    } else {
      reason = 'Add ingredients to see match percentage.';
    }

    results.push({
      recipe,
      matchedIngredients,
      missingIngredients,
      useSoonIngredientsUsed,
      matchPercentage,
      totalRequiredIngredients: totalRequired,
      matchedCount,
      isReadyToCook,
      reason
    });
  }

  // Sort: Ready to cook first, then use-soon priority, then percentage match
  return results.sort((a, b) => {
    if (a.isReadyToCook !== b.isReadyToCook) {
      return a.isReadyToCook ? -1 : 1;
    }
    const aUseSoon = a.useSoonIngredientsUsed.length * 25;
    const bUseSoon = b.useSoonIngredientsUsed.length * 25;

    const aScore = a.matchPercentage + aUseSoon;
    const bScore = b.matchPercentage + bUseSoon;

    return bScore - aScore;
  });
}
