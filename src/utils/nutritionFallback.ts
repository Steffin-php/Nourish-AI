import { ExtractedLabelData, LabelExplanationResult, NutritionItem, IngredientExplanation } from '../types/index.ts';

// Predefined ingredient glossary for packaged food additives and common terms
const INGREDIENT_GLOSSARY: Record<string, { purpose: string; explanation: string }> = {
  maltodextrin: {
    purpose: 'Bulking agent & texture improver',
    explanation: 'A carbohydrate made from corn, rice, or potato starch. Often used to thicken food, improve mouthfeel, or carry flavors.'
  },
  'high fructose corn syrup': {
    purpose: 'Liquid sweetener',
    explanation: 'A sweetener made from corn starch that has been processed to convert some glucose into fructose. Adds intense sweetness and prolongs shelf life.'
  },
  'xanthan gum': {
    purpose: 'Thickener & stabilizer',
    explanation: 'A plant-based soluble fiber produced by fermenting sugar with bacteria. It prevents ingredients from separating in sauces and dressings.'
  },
  'soy lecithin': {
    purpose: 'Emulsifier',
    explanation: 'A natural fatty substance derived from soybeans. It helps oil and water blend smoothly in chocolate, baked goods, and spreads.'
  },
  carrageenan: {
    purpose: 'Gelling agent & thickener',
    explanation: 'Extracted from red seaweed, used to thicken and stabilize dairy and plant-based milks.'
  },
  'monosodium glutamate': {
    purpose: 'Savory flavor enhancer (umami)',
    explanation: 'The sodium salt of glutamic acid, an amino acid naturally found in tomatoes and cheese. Enhances savory taste.'
  },
  msg: {
    purpose: 'Savory flavor enhancer (umami)',
    explanation: 'The sodium salt of glutamic acid, an amino acid naturally found in tomatoes and aged cheese. Enhances savory taste.'
  },
  'sodium benzoate': {
    purpose: 'Preservative',
    explanation: 'A common preservative that prevents mold, yeast, and bacteria growth in acidic foods and beverages.'
  },
  'potassium sorbate': {
    purpose: 'Antimicrobial preservative',
    explanation: 'A salt of sorbic acid used widely in cheese, wine, and baked goods to prevent mold and yeast spoilage.'
  },
  'palm oil': {
    purpose: 'Vegetable fat',
    explanation: 'An edible vegetable oil high in saturated fats, giving packaged cookies and pastries a firm structure at room temperature.'
  },
  'citric acid': {
    purpose: 'Acidity regulator & natural antioxidant',
    explanation: 'A natural organic acid found in citrus fruits. Added to control tartness and protect freshness.'
  },
  'ascorbic acid': {
    purpose: 'Antioxidant (Vitamin C)',
    explanation: 'Pure Vitamin C, used as an antioxidant to preserve color and freshness in processed fruits and bread dough.'
  },
  'guar gum': {
    purpose: 'Natural plant thickener',
    explanation: 'Milled from guar beans, this soluble fiber binds moisture and thickens gravies, ice creams, and gluten-free foods.'
  },
  sucralose: {
    purpose: 'Zero-calorie artificial sweetener',
    explanation: 'An intensely sweet compound (600x sweeter than sugar) that provides sweetness without calories.'
  },
  aspartame: {
    purpose: 'Low-calorie artificial sweetener',
    explanation: 'A non-sugar sweetener made from two amino acids (aspartic acid and phenylalanine). Common in diet sodas.'
  },
  stevia: {
    purpose: 'Plant-derived sweetener',
    explanation: 'Extracted from the leaves of the Stevia rebaudiana plant, providing sweetness without added table sugar.'
  },
  'caramel color': {
    purpose: 'Coloring agent',
    explanation: 'Created by heat treatment of carbohydrates, giving a rich brown hue to colas, gravies, and baked items.'
  },
  'whey protein': {
    purpose: 'Dairy protein source',
    explanation: 'A high-quality complete protein separated during cheese-making, commonly added to enrich protein content.'
  },
  'dextrose': {
    purpose: 'Simple sugar',
    explanation: 'A simple sugar chemically identical to glucose. Rapidly absorbed by the body.'
  },
  'modified food starch': {
    purpose: 'Texture stabilizer',
    explanation: 'Plant starch chemically or physically altered to withstand cooking heat, acid, and freezing without breaking down.'
  }
};

const COMMON_ALLERGENS = [
  'milk',
  'dairy',
  'egg',
  'eggs',
  'peanut',
  'peanuts',
  'tree nut',
  'almond',
  'cashew',
  'walnut',
  'soy',
  'soya',
  'wheat',
  'gluten',
  'fish',
  'crustacean',
  'shrimp',
  'sesame'
];

export function generatePredefinedExplanation(data: ExtractedLabelData): LabelExplanationResult {
  const nutritionBreakdown: NutritionItem[] = [];
  const missingInformation: string[] = [];

  // Parse numeric values safely
  const parseNum = (val?: string) => {
    if (!val) return null;
    const match = val.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  };

  // Calories
  const cals = parseNum(data.calories);
  if (cals !== null) {
    const serving = data.servingSize ? ` per ${data.servingSize}` : ' per serving';
    let context = `Supplies ${cals} kcal${serving}.`;
    if (cals > 400) context += ' A substantial energy intake for a single portion.';
    else if (cals < 100) context += ' A relatively light energy portion.';
    nutritionBreakdown.push({
      nutrient: 'Calories',
      amount: `${cals} kcal`,
      context,
      indicator: cals > 350 ? 'moderate' : 'neutral'
    });
  } else {
    missingInformation.push('Calories (energy content) was not entered or legible.');
  }

  // Protein
  const protein = parseNum(data.protein);
  if (protein !== null) {
    let context = `Contains ${protein}g of protein per serving.`;
    if (protein >= 10) context += ' Good contribution towards daily dietary protein requirements.';
    nutritionBreakdown.push({
      nutrient: 'Protein',
      amount: `${protein}g`,
      context,
      indicator: 'neutral'
    });
  } else {
    missingInformation.push('Protein content was not provided.');
  }

  // Carbohydrates & Sugar
  const carbs = parseNum(data.carbs);
  const sugar = parseNum(data.totalSugar);
  if (carbs !== null) {
    let context = `Provides ${carbs}g of total carbohydrates.`;
    if (sugar !== null) {
      context += ` Of this, ${sugar}g is total sugar.`;
    }
    nutritionBreakdown.push({
      nutrient: 'Carbohydrates',
      amount: `${carbs}g`,
      context,
      indicator: 'neutral'
    });
  } else {
    missingInformation.push('Total carbohydrate amount was not provided.');
  }

  if (sugar !== null) {
    const isHigh = sugar > 15;
    nutritionBreakdown.push({
      nutrient: 'Total Sugar',
      amount: `${sugar}g`,
      context: isHigh
        ? `${sugar}g is relatively high for a single serving (World Health Organization recommends keeping free sugars under 25–50g per day).`
        : `Contains ${sugar}g of total sugars per serving.`,
      indicator: isHigh ? 'high' : 'neutral'
    });
  } else if (!data.carbs) {
    missingInformation.push('Sugar amount was not specified.');
  }

  // Fat & Saturated Fat
  const fat = parseNum(data.totalFat);
  const satFat = parseNum(data.saturatedFat);
  if (fat !== null) {
    let context = `Contains ${fat}g of total fat per serving.`;
    if (satFat !== null) {
      context += ` Includes ${satFat}g of saturated fat.`;
    }
    nutritionBreakdown.push({
      nutrient: 'Total Fat',
      amount: `${fat}g`,
      context,
      indicator: satFat && satFat > 5 ? 'moderate' : 'neutral'
    });
  } else {
    missingInformation.push('Total fat value was not listed.');
  }

  if (satFat !== null) {
    const isHighSat = satFat > 5;
    nutritionBreakdown.push({
      nutrient: 'Saturated Fat',
      amount: `${satFat}g`,
      context: isHighSat
        ? `${satFat}g is a notable amount of saturated fat per serving.`
        : `${satFat}g saturated fat per portion.`,
      indicator: isHighSat ? 'moderate' : 'neutral'
    });
  }

  // Sodium
  const sodium = parseNum(data.sodium);
  if (sodium !== null) {
    // Check if in mg or g
    const isGrams = data.sodium?.toLowerCase().includes('g') && !data.sodium?.toLowerCase().includes('mg');
    const sodiumMg = isGrams ? sodium * 1000 : sodium;
    const isHighSodium = sodiumMg > 400;
    nutritionBreakdown.push({
      nutrient: 'Sodium',
      amount: `${sodiumMg}mg`,
      context: isHighSodium
        ? `${sodiumMg}mg represents a significant portion of the recommended daily limit of 2,000–2,300mg.`
        : `Supplies ${sodiumMg}mg of sodium per serving.`,
      indicator: isHighSodium ? 'high' : 'neutral'
    });
  } else {
    missingInformation.push('Sodium / salt value was not entered.');
  }

  // Ingredient Guide scanning
  const ingredientGuide: IngredientExplanation[] = [];
  const ingListText = (data.ingredientList || data.rawText || '').toLowerCase();

  for (const [key, details] of Object.entries(INGREDIENT_GLOSSARY)) {
    if (ingListText.includes(key)) {
      // Capitalize first letter
      const title = key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      ingredientGuide.push({
        ingredient: title,
        explanation: details.explanation,
        purpose: details.purpose
      });
    }
  }

  if (ingredientGuide.length === 0 && !ingListText.trim()) {
    missingInformation.push('No ingredient list was provided or visible to explain specific additives.');
  }

  // Allergen detection from declared text
  const declaredAllergens: string[] = [];
  const fullTextToSearch = `${data.allergenStatement || ''} ${data.ingredientList || ''} ${data.rawText || ''}`.toLowerCase();

  for (const allergen of COMMON_ALLERGENS) {
    // Check for word boundary
    const regex = new RegExp(`\\b${allergen}\\b`, 'i');
    if (regex.test(fullTextToSearch)) {
      const formatted = allergen.charAt(0).toUpperCase() + allergen.slice(1);
      if (!declaredAllergens.includes(formatted)) {
        declaredAllergens.push(formatted);
      }
    }
  }

  // What to notice
  const whatToNotice: Array<{ title: string; observation: string; suggestion: string }> = [];

  if (data.servingSize) {
    whatToNotice.push({
      title: 'Check the Serving Size',
      observation: `Values are calculated based on a serving size of "${data.servingSize}".`,
      suggestion: 'If you consume more or less than this stated amount, adjust the nutritional values proportionally.'
    });
  }

  if (sugar !== null && sugar >= 12) {
    whatToNotice.push({
      title: 'Notable Sugar Level',
      observation: `Contains ${sugar}g of sugar in each serving.`,
      suggestion: 'Consider balancing this with meals containing whole vegetables, protein, and complex fiber.'
    });
  }

  if (sodium !== null && parseNum(data.sodium)! > 400) {
    whatToNotice.push({
      title: 'Elevated Sodium',
      observation: 'Provides more than 400mg sodium in a single serving.',
      suggestion: 'Keep track of other sodium sources throughout the day to stay comfortably within the 2,000mg guideline.'
    });
  }

  // Simple Summary
  const productName = data.productName ? `"${data.productName}"` : 'This product';
  let simpleSummary = `${productName} provides nutrition information based on the user-submitted label details.`;
  if (cals !== null) {
    simpleSummary += ` It offers approximately ${cals} calories per portion.`;
  }
  if (declaredAllergens.length > 0) {
    simpleSummary += ` Explicitly declared potential allergens detected in the text: ${declaredAllergens.join(', ')}.`;
  }

  return {
    productName: data.productName,
    simpleSummary,
    nutritionBreakdown,
    ingredientGuide,
    allergenInformation: {
      declared: declaredAllergens,
      crossContaminationRiskNote:
        'Always check the physical product package. Facilities may process peanuts, tree nuts, gluten, or dairy on shared equipment even if not listed in the main ingredients.'
    },
    whatToNotice,
    missingInformation,
    isAiGenerated: false,
    disclaimer:
      'This explanation is for educational reference based on the user-entered values and standard dietary reference tables. It does not replace individualized dietary advice from a qualified healthcare professional.'
  };
}
