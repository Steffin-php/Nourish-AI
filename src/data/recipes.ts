import { Recipe } from '../types';

export const RECIPES_DATA: Recipe[] = [
  {
    id: 'biryani-1',
    name: 'Fragrant Vegetable Biryani',
    description: 'Aromatic layered basmati rice with mixed vegetables, caramelized onions, and fresh mint.',
    category: 'indian',
    isVegetarian: true,
    difficulty: 'Moderate',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servings: 4,
    ingredients: [
      { name: 'Basmati rice', quantity: '1.5 cups' },
      { name: 'Onion', quantity: '2 medium, sliced' },
      { name: 'Carrot', quantity: '1 large, diced' },
      { name: 'Green peas', quantity: '0.5 cup' },
      { name: 'Potato', quantity: '1 medium, cubed' },
      { name: 'Ginger garlic paste', quantity: '1 tbsp' },
      { name: 'Yogurt', quantity: '0.5 cup' },
      { name: 'Mint leaves', quantity: '0.25 cup' },
      { name: 'Cooking oil', quantity: '2 tbsp', isPantryStaple: true },
      { name: 'Salt', quantity: '1 tsp', isPantryStaple: true },
      { name: 'Garam masala', quantity: '1 tsp', isPantryStaple: true }
    ],
    instructions: [
      'Rinse basmati rice, boil in salted water until 70% cooked (about 6 minutes), then drain.',
      'In a wide pan, heat oil and fry sliced onions until golden brown.',
      'Add ginger garlic paste, carrots, potatoes, green peas, and spices. Sauté for 4 minutes.',
      'Stir in yogurt and mint leaves, cooking until vegetables start to soften.',
      'Spread the semi-cooked rice gently on top of the vegetables. Scatter fried onions over the rice.',
      'Cover tightly with a lid and cook on low heat for 12 minutes. Let rest 5 minutes before serving.'
    ],
    tips: 'A fantastic way to use leftover vegetables from your fridge crisper drawer.'
  },
  {
    id: 'pasta-aglio-1',
    name: 'Quick Garlic & Olive Oil Spaghetti',
    description: 'Classic Italian Aglio e Olio with golden toasted garlic slices, red pepper flakes, and parsley.',
    category: 'international',
    isVegetarian: true,
    difficulty: 'Very Easy',
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    servings: 2,
    ingredients: [
      { name: 'Spaghetti', quantity: '200g' },
      { name: 'Garlic', quantity: '5 cloves, sliced thin' },
      { name: 'Olive oil', quantity: '3 tbsp', isPantryStaple: true },
      { name: 'Red chilli flakes', quantity: '1 tsp', isPantryStaple: true },
      { name: 'Fresh parsley', quantity: '2 tbsp, chopped' },
      { name: 'Salt', quantity: '1 tbsp for water', isPantryStaple: true }
    ],
    instructions: [
      'Boil spaghetti in salted water until tender with a slight bite (al dente). Save 1/4 cup of the cooking water.',
      'In a wide skillet, heat olive oil over gentle heat and fry sliced garlic until pale golden and fragrant.',
      'Stir in red chilli flakes and take off heat for 30 seconds so garlic does not darken.',
      'Add the drained spaghetti and reserved pasta water directly to the skillet.',
      'Toss vigorously for 1 minute until the oil and water emulsify into a silky sauce. Top with fresh parsley.'
    ],
    tips: 'The starchy pasta water binds with olive oil to create a silky restaurant-quality sauce.'
  },
  {
    id: 'shakshuka-1',
    name: 'Skillet Shakshuka with Eggs',
    description: 'Poached eggs cooked gently in a savory spiced tomato, bell pepper, and onion sauce.',
    category: 'international',
    isVegetarian: false,
    difficulty: 'Easy',
    prepTimeMinutes: 8,
    cookTimeMinutes: 15,
    servings: 3,
    ingredients: [
      { name: 'Eggs', quantity: '4 large' },
      { name: 'Tomato', quantity: '3 large ripe, chopped' },
      { name: 'Bell pepper', quantity: '1 medium, diced' },
      { name: 'Onion', quantity: '1 medium, chopped' },
      { name: 'Garlic', quantity: '3 cloves, minced' },
      { name: 'Olive oil', quantity: '2 tbsp', isPantryStaple: true },
      { name: 'Cumin powder', quantity: '1 tsp', isPantryStaple: true },
      { name: 'Salt', quantity: 'To taste', isPantryStaple: true }
    ],
    instructions: [
      'Heat oil in a skillet and cook chopped onion and bell pepper for 5 minutes until soft.',
      'Add minced garlic and cumin powder, cooking for 1 minute until fragrant.',
      'Add chopped ripe tomatoes and salt. Simmer for 8 minutes until a thick, chunky sauce forms.',
      'Make 4 small hollows in the sauce with your spoon and crack an egg into each hollow.',
      'Cover with a lid and cook on low heat for 5 minutes until the egg whites are firm and yolks remain soft.',
      'Garnish with fresh herbs and enjoy warm with toast or flatbread.'
    ],
    tips: 'Perfect for using up ripe or soft tomatoes.'
  },
  {
    id: 'dal-tadka-1',
    name: 'Homestyle Yellow Dal Tadka',
    description: 'Creamy yellow lentils tempered with sizzled garlic, cumin seeds, and sliced onions.',
    category: 'indian',
    isVegetarian: true,
    difficulty: 'Easy',
    prepTimeMinutes: 5,
    cookTimeMinutes: 18,
    servings: 4,
    ingredients: [
      { name: 'Yellow lentils', quantity: '1 cup (Toor or Moong dal)' },
      { name: 'Onion', quantity: '1 medium, chopped' },
      { name: 'Tomato', quantity: '1 medium, chopped' },
      { name: 'Garlic', quantity: '4 cloves, sliced' },
      { name: 'Cumin seeds', quantity: '1 tsp', isPantryStaple: true },
      { name: 'Turmeric powder', quantity: '0.5 tsp', isPantryStaple: true },
      { name: 'Cooking oil', quantity: '2 tbsp', isPantryStaple: true },
      { name: 'Salt', quantity: '1 tsp', isPantryStaple: true }
    ],
    instructions: [
      'Boil or pressure-cook lentils with 3 cups water, turmeric, and half the salt until tender.',
      'In a small pan, heat oil. Add cumin seeds and let them sizzle.',
      'Add sliced garlic and fry until golden. Add chopped onion and tomato, cooking for 3 minutes.',
      'Pour this aromatic tempering straight into the boiled dal and simmer for 2 minutes.',
      'Serve hot with steamed rice or roti.'
    ],
    tips: 'A foolproof comfort meal that uses basic pantry staples.'
  },
  {
    id: 'fried-rice-1',
    name: 'Quick Vegetable Fried Rice',
    description: 'Fast skillet meal turning leftover rice and fresh veggies into a delicious dinner.',
    category: 'international',
    isVegetarian: true,
    difficulty: 'Very Easy',
    prepTimeMinutes: 5,
    cookTimeMinutes: 8,
    servings: 2,
    ingredients: [
      { name: 'Cooked rice', quantity: '2 cups, cold' },
      { name: 'Carrot', quantity: '1 small, diced' },
      { name: 'Bell pepper', quantity: '0.5 cup, diced' },
      { name: 'Green peas', quantity: '0.25 cup' },
      { name: 'Garlic', quantity: '3 cloves, minced' },
      { name: 'Soy sauce', quantity: '2 tbsp' },
      { name: 'Cooking oil', quantity: '1.5 tbsp', isPantryStaple: true }
    ],
    instructions: [
      'Heat oil in a wide pan on high heat. Sauté garlic for 20 seconds.',
      'Add diced carrots, bell peppers, and peas. Stir-fry for 2 minutes so they stay crisp.',
      'Add the cold cooked rice, breaking any lumps with your spatula.',
      'Drizzle soy sauce over the rice and toss continuously on high heat for 2 minutes until hot.'
    ],
    tips: 'Cold or day-old rice makes the best fried rice because it will not stick.'
  },
  {
    id: 'masala-omelette-1',
    name: 'Fluffy Masala Omelette',
    description: 'Golden pan-fried eggs filled with finely diced onions, tomatoes, and coriander.',
    category: 'quick',
    isVegetarian: false,
    difficulty: 'Very Easy',
    prepTimeMinutes: 4,
    cookTimeMinutes: 4,
    servings: 1,
    ingredients: [
      { name: 'Eggs', quantity: '2 large' },
      { name: 'Onion', quantity: '2 tbsp, finely chopped' },
      { name: 'Tomato', quantity: '2 tbsp, finely chopped' },
      { name: 'Cooking oil', quantity: '1 tsp', isPantryStaple: true },
      { name: 'Salt', quantity: 'To taste', isPantryStaple: true }
    ],
    instructions: [
      'Whisk eggs in a small bowl with salt until frothy.',
      'Stir in finely chopped onions and tomatoes.',
      'Heat oil in a non-stick pan over medium heat and pour in the egg mixture.',
      'Cook for 2 minutes until the bottom is set, flip, and cook the other side for 1 minute.'
    ],
    tips: 'Whisking the eggs well before adding vegetables gives a much fluffier texture.'
  },
  {
    id: 'poha-1',
    name: 'Batata Poha (Flattened Rice with Potatoes)',
    description: 'Light, wholesome flattened rice sautéed with soft potato cubes and turmeric.',
    category: 'indian',
    isVegetarian: true,
    difficulty: 'Easy',
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    servings: 2,
    ingredients: [
      { name: 'Flattened rice', quantity: '1.5 cups (Poha)' },
      { name: 'Potato', quantity: '1 small, diced small' },
      { name: 'Onion', quantity: '1 medium, chopped' },
      { name: 'Mustard seeds', quantity: '1 tsp', isPantryStaple: true },
      { name: 'Turmeric powder', quantity: '0.5 tsp', isPantryStaple: true },
      { name: 'Cooking oil', quantity: '1.5 tbsp', isPantryStaple: true },
      { name: 'Lemon', quantity: '0.5 lemon, juiced' }
    ],
    instructions: [
      'Rinse flattened rice in a strainer for 20 seconds, drain well, and toss with turmeric and salt.',
      'Heat oil in a pan, add mustard seeds, then add diced potatoes. Cover and cook 4 minutes until tender.',
      'Add chopped onion and cook until soft.',
      'Gently fold in the softened flattened rice. Cover and steam on low for 2 minutes.',
      'Turn off heat and squeeze fresh lemon juice over the top.'
    ],
    tips: 'Do not soak poha in water; simply rinsing in a strainer keeps it fluffy.'
  },
  {
    id: 'french-toast-1',
    name: 'Golden Pan-Fried French Toast',
    description: 'Bread dipped in a rich egg and milk batter, toasted golden brown on a buttery skillet.',
    category: 'quick',
    isVegetarian: false,
    difficulty: 'Very Easy',
    prepTimeMinutes: 4,
    cookTimeMinutes: 6,
    servings: 2,
    ingredients: [
      { name: 'Bread', quantity: '4 slices' },
      { name: 'Eggs', quantity: '2 large' },
      { name: 'Milk', quantity: '0.25 cup' },
      { name: 'Sugar or honey', quantity: '1 tbsp' },
      { name: 'Butter or oil', quantity: '1 tbsp', isPantryStaple: true }
    ],
    instructions: [
      'Whisk eggs, milk, and sugar in a shallow dish.',
      'Heat butter in a skillet over medium heat.',
      'Dip bread slices into the mixture for 10 seconds per side so they absorb the liquid.',
      'Cook on the hot skillet for 2–3 minutes per side until golden brown.'
    ],
    tips: 'Slightly dry or day-old bread absorbs the batter without getting soggy.'
  },
  {
    id: 'tomato-basil-pasta-1',
    name: 'Fresh Tomato & Garlic Pasta',
    description: 'Pasta tossed with sweet pan-cooked ripe tomatoes, garlic, and olive oil.',
    category: 'international',
    isVegetarian: true,
    difficulty: 'Very Easy',
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    servings: 2,
    ingredients: [
      { name: 'Spaghetti or pasta', quantity: '200g' },
      { name: 'Tomato', quantity: '4 ripe, chopped' },
      { name: 'Garlic', quantity: '3 cloves, sliced' },
      { name: 'Olive oil', quantity: '2 tbsp', isPantryStaple: true },
      { name: 'Salt', quantity: 'To taste', isPantryStaple: true }
    ],
    instructions: [
      'Boil pasta in salted water until tender. Keep 2 tablespoons of the pasta water.',
      'In a wide pan, heat olive oil and cook sliced garlic for 1 minute until fragrant.',
      'Add chopped ripe tomatoes and salt. Cook for 8 minutes, crushing tomatoes with your spoon into a sauce.',
      'Toss in the cooked pasta and reserved water for 1 minute until coated.'
    ],
    tips: 'Very ripe tomatoes make the richest and sweetest pasta sauce.'
  },
  {
    id: 'chickpea-salad-1',
    name: 'Quick Chickpea & Cucumber Salad',
    description: 'No-cook protein bowl with chickpeas, crunchy cucumbers, tomatoes, and lemon olive oil dressing.',
    category: 'international',
    isVegetarian: true,
    difficulty: 'Very Easy',
    prepTimeMinutes: 6,
    cookTimeMinutes: 0,
    servings: 2,
    ingredients: [
      { name: 'Chickpeas', quantity: '1 can (400g), rinsed and drained' },
      { name: 'Cucumber', quantity: '1 medium, diced' },
      { name: 'Tomato', quantity: '2 medium, chopped' },
      { name: 'Lemon', quantity: '1 whole, juiced' },
      { name: 'Olive oil', quantity: '1.5 tbsp', isPantryStaple: true },
      { name: 'Salt', quantity: 'To taste', isPantryStaple: true }
    ],
    instructions: [
      'In a salad bowl, toss together rinsed chickpeas, diced cucumber, and chopped tomatoes.',
      'Whisk lemon juice, olive oil, and salt in a small cup.',
      'Pour the dressing over the salad, toss well, and let sit for 3 minutes before eating.'
    ],
    tips: 'High in fiber and plant protein with zero stove cooking needed.'
  },
  {
    id: 'banana-pancakes-1',
    name: '3-Ingredient Ripe Banana Pancakes',
    description: 'Simple sweet pancakes using up ripe bananas, eggs, and oats.',
    category: 'quick',
    isVegetarian: false,
    difficulty: 'Very Easy',
    prepTimeMinutes: 4,
    cookTimeMinutes: 6,
    servings: 2,
    ingredients: [
      { name: 'Banana', quantity: '2 ripe or spotted' },
      { name: 'Eggs', quantity: '2 large' },
      { name: 'Oats or flour', quantity: '0.5 cup' },
      { name: 'Butter or oil', quantity: '1 tbsp', isPantryStaple: true }
    ],
    instructions: [
      'Mash ripe bananas thoroughly with a fork in a bowl until smooth.',
      'Whisk in the eggs, then stir in oats or flour until a thick batter forms.',
      'Heat a lightly greased non-stick pan over medium heat.',
      'Spoon 2 tablespoons of batter per pancake. Cook for 2 minutes per side until golden.'
    ],
    tips: 'The browner the bananas, the sweeter the pancakes without needing added sugar.'
  },
  {
    id: 'aloo-gobi-1',
    name: 'Homestyle Spiced Aloo Gobi',
    description: 'Roasted potato and cauliflower florets with cumin, turmeric, and onions.',
    category: 'indian',
    isVegetarian: true,
    difficulty: 'Easy',
    prepTimeMinutes: 10,
    cookTimeMinutes: 18,
    servings: 3,
    ingredients: [
      { name: 'Potato', quantity: '2 medium, cubed' },
      { name: 'Cauliflower', quantity: '1 small head, cut into florets' },
      { name: 'Onion', quantity: '1 medium, chopped' },
      { name: 'Tomato', quantity: '1 medium, chopped' },
      { name: 'Cumin seeds', quantity: '1 tsp', isPantryStaple: true },
      { name: 'Turmeric powder', quantity: '0.5 tsp', isPantryStaple: true },
      { name: 'Cooking oil', quantity: '2 tbsp', isPantryStaple: true },
      { name: 'Salt', quantity: 'To taste', isPantryStaple: true }
    ],
    instructions: [
      'Heat oil in a pan, add cumin seeds, then sauté onions until soft.',
      'Add cubed potatoes and cauliflower florets with turmeric and salt.',
      'Cover with a lid and cook on low heat for 12 minutes, stirring occasionally.',
      'Add chopped tomatoes, cover again, and cook 5 more minutes until vegetables are fork-tender.'
    ],
    tips: 'Cut potatoes and cauliflower florets into similar sizes so they finish cooking together.'
  }
];
