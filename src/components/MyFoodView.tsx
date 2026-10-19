import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Check,
  Trash2,
  Edit2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { FoodItem, FoodCategory } from '../types';
import { getItemDateStatus } from '../utils/dateUtils';

interface MyFoodViewProps {
  foodItems: FoodItem[];
  onOpenAddModal: () => void;
  onEditItem: (item: FoodItem) => void;
  onDeleteItem: (id: string) => void;
  onMarkAsUsed: (id: string, usedQty?: number) => void;
  onMarkAsDiscarded: (id: string) => void;
  onResetSampleData: () => void;
  onClearAll: () => void;
}

const CATEGORY_TABS: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'All Items' },
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'grains', label: 'Grains & Staples' },
  { id: 'meat_fish', label: 'Meat & Fish' },
  { id: 'packaged', label: 'Packaged Food' },
  { id: 'other', label: 'Other' }
];

export const MyFoodView: React.FC<MyFoodViewProps> = ({
  foodItems,
  onOpenAddModal,
  onEditItem,
  onDeleteItem,
  onMarkAsUsed,
  onMarkAsDiscarded,
  onResetSampleData,
  onClearAll
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'added'>('date');
  const [itemToDelete, setItemToDelete] = useState<FoodItem | null>(null);
  const [itemToDiscard, setItemToDiscard] = useState<FoodItem | null>(null);
  const [itemToUse, setItemToUse] = useState<FoodItem | null>(null);
  const [usedAmount, setUsedAmount] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const activeItems = foodItems.filter(item => item.status === 'active');

  // Filter items
  const filteredItems = activeItems.filter(item => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      if (!matchName && !matchNotes) return false;
    }

    // Category
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'added') {
      return (b.createdAt || 0) - (a.createdAt || 0);
    }
    // Default: Sort by expiry date (approaching first)
    if (!a.expiryDate && !b.expiryDate) return 0;
    if (!a.expiryDate) return 1;
    if (!b.expiryDate) return -1;
    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
  });

  const handleConfirmUse = () => {
    if (!itemToUse) return;
    if (usedAmount === 'all') {
      onMarkAsUsed(itemToUse.id);
    } else {
      const qty = parseFloat(usedAmount);
      onMarkAsUsed(itemToUse.id, isNaN(qty) ? undefined : qty);
    }
    setItemToUse(null);
  };

  const handleConfirmDiscard = () => {
    if (!itemToDiscard) return;
    onMarkAsDiscarded(itemToDiscard.id);
    setItemToDiscard(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    onDeleteItem(itemToDelete.id);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#252B27]">
            My Food Inventory
          </h1>
          <p className="text-sm text-[#737B74] mt-0.5">
            Keep track of what's in your fridge, freezer, and pantry.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Food Item</span>
        </button>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-8 relative">
          <label htmlFor="inventory-search" className="sr-only">
            Search food items
          </label>
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737B74]" />
          <input
            id="inventory-search"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by food name or notes..."
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl border border-[#E7E9E2] bg-[#FFFFFF] text-sm text-[#252B27] placeholder:text-[#737B74] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#737B74] hover:text-[#252B27] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="sm:col-span-4 relative">
          <label htmlFor="inventory-sort" className="sr-only">
            Sort inventory
          </label>
          <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737B74]" />
          <select
            id="inventory-sort"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'date' | 'name' | 'added')}
            className="w-full min-h-[44px] pl-10 pr-8 rounded-xl border border-[#E7E9E2] bg-[#FFFFFF] text-sm text-[#252B27] focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C] transition-colors cursor-pointer"
          >
            <option value="date">Sort: Entered Date (Soonest)</option>
            <option value="name">Sort: Name (A to Z)</option>
            <option value="added">Sort: Date Added (Newest)</option>
          </select>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1.5 min-w-max">
          {CATEGORY_TABS.map(tab => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#52765C] text-white shadow-2xs font-semibold'
                    : 'bg-[#FFFFFF] text-[#737B74] hover:text-[#252B27] border border-[#E7E9E2]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety & Reminder Notice */}
      <div className="p-3.5 rounded-2xl bg-[#FAFAF6] border border-[#E7E9E2] text-xs text-[#737B74] flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-[#52765C] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#252B27] font-semibold">Reminder: </strong>
          Status indicators reflect your entered dates to help you prioritize cooking. They are not a guarantee of food safety. Always inspect sight, smell, and texture before using.
        </p>
      </div>

      {/* Items List */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map(item => {
            const dateStatus = getItemDateStatus(item.expiryDate);

            // Subtle indicator style
            let statusTextColor = 'text-[#737B74]';
            let statusBorderColor = 'border-[#E7E9E2]';
            let statusBg = 'bg-[#FAFAF6]';

            if (dateStatus.status === 'use_soon') {
              statusTextColor = 'text-[#B87932] font-semibold';
              statusBorderColor = 'border-[#B87932]/30';
              statusBg = 'bg-[#F4EBDD]/50';
            } else if (dateStatus.status === 'date_passed') {
              statusTextColor = 'text-[#B94A48] font-semibold';
              statusBorderColor = 'border-[#B94A48]/30';
              statusBg = 'bg-[#B94A48]/5';
            }

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-2xs flex flex-col justify-between hover:border-[#52765C]/30 transition-all space-y-4"
              >
                <div>
                  {/* Status & Category row */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[#737B74] capitalize">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-lg border ${statusBorderColor} ${statusBg} ${statusTextColor}`}>
                      {dateStatus.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[#252B27] truncate">
                    {item.name}
                  </h3>

                  {/* Unboxed Metadata with separators */}
                  <div className="flex items-center gap-2 text-xs text-[#737B74] mt-1.5">
                    <span className="font-semibold text-[#252B27] tabular-nums">
                      {item.quantity} {item.unit}
                    </span>
                    {item.storageLocation && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{item.storageLocation}</span>
                      </>
                    )}
                  </div>

                  {/* Notes if present */}
                  {item.notes && (
                    <p className="text-xs text-[#737B74] mt-2 italic line-clamp-2">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#E7E9E2] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-2 rounded-lg text-[#737B74] hover:text-[#252B27] hover:bg-[#FAFAF6] transition-colors cursor-pointer"
                      title="Edit this item"
                      aria-label={`Edit ${item.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setItemToDiscard(item)}
                      className="p-2 rounded-lg text-[#737B74] hover:text-[#B94A48] hover:bg-[#FAFAF6] transition-colors cursor-pointer"
                      title="Mark as discarded"
                      aria-label={`Discard ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setItemToUse(item);
                      setUsedAmount('all');
                    }}
                    className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold text-[#52765C] hover:text-white bg-[#E8F0E6] hover:bg-[#52765C] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Used</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E7E9E2] text-center space-y-3">
          <p className="text-base font-semibold text-[#252B27]">
            {searchQuery || selectedCategory !== 'all'
              ? 'No matching food items found'
              : 'Your food inventory is empty'}
          </p>
          <p className="text-xs sm:text-sm text-[#737B74] max-w-md mx-auto">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search query or switching to "All Items".'
              : 'Add vegetables, fruits, dairy, or pantry staples to start tracking entered dates.'}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {searchQuery || selectedCategory !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="min-h-[44px] px-5 py-2 text-xs font-semibold text-[#52765C] bg-[#E8F0E6] rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenAddModal}
                  className="min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors cursor-pointer"
                >
                  Add Food Item
                </button>
                <button
                  onClick={onResetSampleData}
                  className="min-h-[44px] px-4 py-2 text-sm font-medium text-[#737B74] hover:text-[#252B27] bg-[#FAFAF6] border border-[#E7E9E2] rounded-xl transition-colors cursor-pointer"
                >
                  Load Sample Pantry
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer controls: storage note, sample pantry restore, clear inventory */}
      <div className="pt-6 border-t border-[#E7E9E2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#737B74]">
        <p>
          Saved locally in your web browser. Clearing browser data will reset stored items.
        </p>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={onResetSampleData}
            className="hover:text-[#252B27] cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload sample pantry</span>
          </button>
          <span className="text-[#E7E9E2]">|</span>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-[#B94A48] hover:underline cursor-pointer"
          >
            Clear all data
          </button>
        </div>
      </div>

      {/* Use Confirmation Dialog */}
      {itemToUse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#E7E9E2] rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-[#252B27]">
              Mark as Used: {itemToUse.name}
            </h3>
            <p className="text-xs text-[#737B74]">
              Did you use the full quantity or a portion of this item?
            </p>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] cursor-pointer">
                <input
                  type="radio"
                  name="use-qty"
                  checked={usedAmount === 'all'}
                  onChange={() => setUsedAmount('all')}
                  className="text-[#52765C] focus:ring-[#52765C]"
                />
                <span className="font-medium text-[#252B27]">
                  All of it ({itemToUse.quantity} {itemToUse.unit})
                </span>
              </label>

              {itemToUse.quantity > 1 && (
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] cursor-pointer">
                  <input
                    type="radio"
                    name="use-qty"
                    checked={usedAmount === 'portion'}
                    onChange={() => setUsedAmount((itemToUse.quantity / 2).toString())}
                    className="text-[#52765C] focus:ring-[#52765C]"
                  />
                  <span className="font-medium text-[#252B27]">
                    Half portion ({(itemToUse.quantity / 2).toFixed(1)} {itemToUse.unit})
                  </span>
                </label>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setItemToUse(null)}
                className="min-h-[44px] px-4 py-2 text-xs font-medium text-[#737B74] hover:text-[#252B27]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUse}
                className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors cursor-pointer"
              >
                Confirm Used
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard Confirmation Dialog */}
      {itemToDiscard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#E7E9E2] rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#B87932]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-[#252B27]">Discard Item</h3>
            </div>
            <p className="text-xs text-[#737B74] leading-relaxed">
              Are you sure you want to record "{itemToDiscard.name}" as discarded? It will be removed from your active pantry and recorded as discarded rather than food saved.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setItemToDiscard(null)}
                className="min-h-[44px] px-4 py-2 text-xs font-medium text-[#737B74] hover:text-[#252B27]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-[#B94A48] hover:bg-[#a13b39] rounded-xl transition-colors cursor-pointer"
              >
                Yes, Mark Discarded
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#E7E9E2] rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-[#252B27]">
              Clear Stored Inventory?
            </h3>
            <p className="text-xs text-[#737B74] leading-relaxed">
              This will remove all items from your browser storage. You can restore the starter sample items at any time.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="min-h-[44px] px-4 py-2 text-xs font-medium text-[#737B74] hover:text-[#252B27]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-[#B94A48] hover:bg-[#a13b39] rounded-xl transition-colors cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
