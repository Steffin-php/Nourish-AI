import { FoodItem } from '../types';

const STORAGE_KEY_ITEMS = 'nourish_ai_food_items_v1';
const STORAGE_KEY_STATS = 'nourish_ai_stats_v1';

export interface AppStats {
  usedCount: number;
  discardedCount: number;
}

// Starter pantry data that mirrors real household groceries
export const INITIAL_SAMPLE_ITEMS: FoodItem[] = [
  {
    id: 'sample-1',
    name: 'Ripe Tomatoes',
    category: 'vegetables',
    quantity: 4,
    unit: 'pieces',
    storageLocation: 'refrigerator',
    dateAdded: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], // Use soon (tomorrow)
    notes: 'Sweet vine tomatoes, getting soft',
    status: 'active',
    createdAt: Date.now() - 4 * 86400000
  },
  {
    id: 'sample-2',
    name: 'Red Onions',
    category: 'vegetables',
    quantity: 3,
    unit: 'pieces',
    storageLocation: 'pantry',
    dateAdded: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    notes: 'Keep in dry ventilated basket',
    status: 'active',
    createdAt: Date.now() - 7 * 86400000
  },
  {
    id: 'sample-3',
    name: 'Fresh Spinach',
    category: 'vegetables',
    quantity: 250,
    unit: 'grams',
    storageLocation: 'refrigerator',
    dateAdded: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Use soon
    notes: 'Washed and sealed in crisper',
    status: 'active',
    createdAt: Date.now() - 3 * 86400000
  },
  {
    id: 'sample-4',
    name: 'Spaghetti Pasta',
    category: 'grains',
    quantity: 1,
    unit: 'packs',
    storageLocation: 'pantry',
    dateAdded: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
    notes: 'Whole grain durum wheat',
    status: 'active',
    createdAt: Date.now() - 14 * 86400000
  },
  {
    id: 'sample-5',
    name: 'Garlic Bulbs',
    category: 'vegetables',
    quantity: 1,
    unit: 'packs',
    storageLocation: 'pantry',
    dateAdded: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    notes: 'Aromatic staple',
    status: 'active',
    createdAt: Date.now() - 5 * 86400000
  },
  {
    id: 'sample-6',
    name: 'Plain Greek Yogurt',
    category: 'dairy',
    quantity: 500,
    unit: 'grams',
    storageLocation: 'refrigerator',
    dateAdded: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // Date passed
    notes: 'Unopened pot, check smell before use',
    status: 'active',
    createdAt: Date.now() - 6 * 86400000
  }
];

export function loadFoodItems(): FoodItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(INITIAL_SAMPLE_ITEMS));
      return INITIAL_SAMPLE_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load food items from localStorage', e);
    return [];
  }
}

export function saveFoodItems(items: FoodItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save food items to localStorage', e);
  }
}

export function loadStats(): AppStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (!raw) {
      const defaultStats: AppStats = { usedCount: 2, discardedCount: 0 };
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(defaultStats));
      return defaultStats;
    }
    const parsed = JSON.parse(raw);
    return {
      usedCount: parsed.usedCount || 0,
      discardedCount: parsed.discardedCount || 0
    };
  } catch {
    return { usedCount: 0, discardedCount: 0 };
  }
}

export function saveStats(stats: AppStats): void {
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats to localStorage', e);
  }
}

export function resetAllStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_ITEMS);
    localStorage.removeItem(STORAGE_KEY_STATS);
  } catch (e) {
    console.error('Failed to clear storage', e);
  }
}
