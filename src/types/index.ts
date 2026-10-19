export interface FoodItem {
  id: string;
  name: string;
  category: 'vegetables' | 'fruits' | 'dairy' | 'grains' | 'meat_fish' | 'packaged' | 'other';
  quantity: number;
  unit: string;
  storageLocation?: 'refrigerator' | 'freezer' | 'pantry' | 'other';
  dateAdded?: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD
  notes?: string;
  status: 'active' | 'used' | 'discarded';
  usedDate?: string;
  discardedDate?: string;
  createdAt: number;
}

export type FoodCategory = FoodItem['category'];
export type StorageLocation = NonNullable<FoodItem['storageLocation']>;

export interface RecipeIngredient {
  name: string;
  quantity: string;
  isPantryStaple?: boolean; // salt, oil, water, etc.
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'indian' | 'international' | 'quick';
  isVegetarian: boolean;
  difficulty: 'Very Easy' | 'Easy' | 'Moderate';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  image?: string;
  tips?: string;
}

export interface RecipeMatchResult {
  recipe: Recipe;
  matchedIngredients: string[];
  missingIngredients: RecipeIngredient[];
  useSoonIngredientsUsed: string[];
  matchPercentage: number;
  totalRequiredIngredients: number;
  matchedCount: number;
  isReadyToCook: boolean;
  reason: string;
}

export interface NutritionItem {
  nutrient: string;
  amount: string;
  context: string;
  indicator?: 'neutral' | 'moderate' | 'high';
}

export interface IngredientExplanation {
  ingredient: string;
  explanation: string;
  purpose: string;
}

export interface LabelExplanationResult {
  productName?: string;
  simpleSummary: string;
  nutritionBreakdown: NutritionItem[];
  ingredientGuide: IngredientExplanation[];
  allergenInformation: {
    declared: string[];
    crossContaminationRiskNote: string;
  };
  whatToNotice: Array<{
    title: string;
    observation: string;
    suggestion: string;
  }>;
  missingInformation: string[];
  isAiGenerated: boolean;
  disclaimer: string;
}

export interface ExtractedLabelData {
  productName?: string;
  servingSize?: string;
  calories?: string;
  protein?: string;
  carbs?: string;
  totalSugar?: string;
  totalFat?: string;
  saturatedFat?: string;
  sodium?: string;
  ingredientList?: string;
  allergenStatement?: string;
  rawText?: string;
  confidenceNote?: string;
}
