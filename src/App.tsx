import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { MyFoodView } from './components/MyFoodView';
import { RecipeFinderView } from './components/RecipeFinderView';
import { LabelExplainerView } from './components/LabelExplainerView';
import { AddFoodModal } from './components/AddFoodModal';
import { RecipeModal } from './components/RecipeModal';
import { HelpModal } from './components/HelpModal';
import { FoodItem, RecipeMatchResult } from './types';
import {
  loadFoodItems,
  saveFoodItems,
  loadStats,
  saveStats,
  resetAllStorage,
  INITIAL_SAMPLE_ITEMS,
  AppStats
} from './utils/storage';
import { doesIngredientMatch } from './utils/recipeMatcher';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => loadFoodItems());
  const [stats, setStats] = useState<AppStats>(() => loadStats());

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [selectedRecipeMatch, setSelectedRecipeMatch] = useState<RecipeMatchResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    saveFoodItems(foodItems);
  }, [foodItems]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(prev => (prev === message ? null : prev));
    }, 3500);
  };

  // Save new or edited food item
  const handleSaveFoodItem = (
    itemData: Omit<FoodItem, 'id' | 'status' | 'createdAt'> & { id?: string }
  ) => {
    if (itemData.id) {
      // Edit existing
      setFoodItems(prev =>
        prev.map(item =>
          item.id === itemData.id
            ? {
                ...item,
                name: itemData.name,
                category: itemData.category,
                quantity: itemData.quantity,
                unit: itemData.unit,
                storageLocation: itemData.storageLocation,
                dateAdded: itemData.dateAdded,
                expiryDate: itemData.expiryDate,
                notes: itemData.notes
              }
            : item
        )
      );
      showToast(`Updated "${itemData.name}" in your inventory.`);
    } else {
      // Add new
      const newItem: FoodItem = {
        id: `food-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: itemData.name,
        category: itemData.category,
        quantity: itemData.quantity,
        unit: itemData.unit,
        storageLocation: itemData.storageLocation,
        dateAdded: itemData.dateAdded,
        expiryDate: itemData.expiryDate,
        notes: itemData.notes,
        status: 'active',
        createdAt: Date.now()
      };
      setFoodItems(prev => [newItem, ...prev]);
      showToast(`Added "${newItem.name}" to your inventory.`);
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = foodItems.find(i => i.id === id);
    setFoodItems(prev => prev.filter(i => i.id !== id));
    if (item) {
      showToast(`Removed "${item.name}" from inventory.`);
    }
  };

  const handleMarkAsUsed = (id: string, usedQty?: number) => {
    setFoodItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (usedQty && usedQty < item.quantity) {
            // Partial quantity used
            return {
              ...item,
              quantity: parseFloat((item.quantity - usedQty).toFixed(2))
            };
          }
          // Full quantity used
          return {
            ...item,
            status: 'used',
            usedDate: new Date().toISOString()
          };
        }
        return item;
      })
    );

    setStats(prev => ({
      ...prev,
      usedCount: prev.usedCount + 1
    }));

    showToast('Food marked as used! Inventory updated.');
  };

  const handleMarkAsDiscarded = (id: string) => {
    setFoodItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: 'discarded',
              discardedDate: new Date().toISOString()
            }
          : item
      )
    );

    setStats(prev => ({
      ...prev,
      discardedCount: prev.discardedCount + 1
    }));

    showToast('Item recorded as discarded.');
  };

  // Recipe usage: when user cooks a recipe and confirms ingredient deduction
  const handleConfirmUseRecipeIngredients = (matchResult: RecipeMatchResult) => {
    const matchedNames = matchResult.matchedIngredients;
    let countUsed = 0;

    setFoodItems(prev =>
      prev.map(item => {
        if (item.status === 'active') {
          const isMatched = matchedNames.some(mName => doesIngredientMatch(item.name, mName));
          if (isMatched) {
            countUsed++;
            return {
              ...item,
              status: 'used',
              usedDate: new Date().toISOString()
            };
          }
        }
        return item;
      })
    );

    setStats(prev => ({
      ...prev,
      usedCount: prev.usedCount + (countUsed || 1)
    }));

    showToast(`Marked ingredients as used for ${matchResult.recipe.name}!`);
  };

  const handleOpenRecipeDetail = (matchResult: RecipeMatchResult) => {
    setSelectedRecipeMatch(matchResult);
  };

  const handleResetSampleData = () => {
    setFoodItems(INITIAL_SAMPLE_ITEMS);
    showToast('Restored sample pantry items.');
  };

  const handleClearAll = () => {
    resetAllStorage();
    setFoodItems([]);
    setStats({ usedCount: 0, discardedCount: 0 });
    showToast('Cleared all local data.');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF6] text-[#252B27] flex flex-col selection:bg-[#E8F0E6] selection:text-[#52765C]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onNavigate={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAddModal={() => {
          setEditingItem(null);
          setIsAddModalOpen(true);
        }}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
      />

      {/* Main Content Area: centered with max-w-6xl */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-28 md:pb-16">
        {currentTab === 'home' && (
          <HomeView
            foodItems={foodItems}
            stats={stats}
            onNavigate={tab => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAddModal={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            onLoadSampleData={handleResetSampleData}
            onOpenRecipeDetail={handleOpenRecipeDetail}
          />
        )}

        {currentTab === 'my-food' && (
          <MyFoodView
            foodItems={foodItems}
            onOpenAddModal={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            onEditItem={item => {
              setEditingItem(item);
              setIsAddModalOpen(true);
            }}
            onDeleteItem={handleDeleteItem}
            onMarkAsUsed={handleMarkAsUsed}
            onMarkAsDiscarded={handleMarkAsDiscarded}
            onResetSampleData={handleResetSampleData}
            onClearAll={handleClearAll}
          />
        )}

        {currentTab === 'recipes' && (
          <RecipeFinderView
            foodItems={foodItems}
            onOpenRecipeDetail={handleOpenRecipeDetail}
            onNavigateToMyFood={() => setCurrentTab('my-food')}
          />
        )}

        {currentTab === 'label-explainer' && <LabelExplainerView />}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Modals */}
      <AddFoodModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveFoodItem}
        initialItem={editingItem}
      />

      <RecipeModal
        matchResult={selectedRecipeMatch}
        onClose={() => setSelectedRecipeMatch(null)}
        onConfirmUseIngredients={handleConfirmUseRecipeIngredients}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#252B27] text-white text-xs font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150 max-w-sm text-center">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
