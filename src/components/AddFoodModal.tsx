import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { FoodItem, FoodCategory, StorageLocation } from '../types';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<FoodItem, 'id' | 'status' | 'createdAt'> & { id?: string }) => void;
  initialItem?: FoodItem | null;
}

const CATEGORIES: Array<{ id: FoodCategory; label: string }> = [
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'grains', label: 'Grains and staples' },
  { id: 'meat_fish', label: 'Meat and fish' },
  { id: 'packaged', label: 'Packaged food' },
  { id: 'other', label: 'Other' },
];

const STORAGE_LOCATIONS: Array<{ id: StorageLocation; label: string }> = [
  { id: 'refrigerator', label: 'Refrigerator' },
  { id: 'freezer', label: 'Freezer' },
  { id: 'pantry', label: 'Pantry' },
  { id: 'other', label: 'Other' },
];

const UNITS = [
  'pieces',
  'grams',
  'kg',
  'ml',
  'liters',
  'packs',
  'cups',
  'cans',
  'bunch',
  'slices',
  'spoons'
];

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('vegetables');
  const [quantity, setQuantity] = useState<string>('1');
  const [unit, setUnit] = useState<string>('pieces');
  const [storageLocation, setStorageLocation] = useState<StorageLocation>('refrigerator');
  const [dateAdded, setDateAdded] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setCategory(initialItem.category);
      setQuantity(initialItem.quantity.toString());
      setUnit(initialItem.unit);
      setStorageLocation(initialItem.storageLocation || 'refrigerator');
      setDateAdded(initialItem.dateAdded || '');
      setExpiryDate(initialItem.expiryDate || '');
      setNotes(initialItem.notes || '');
    } else {
      setName('');
      setCategory('vegetables');
      setQuantity('1');
      setUnit('pieces');
      setStorageLocation('refrigerator');
      setDateAdded(new Date().toISOString().split('T')[0]);
      setExpiryDate('');
      setNotes('');
    }
    setErrors({});
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter the name of the food item.';
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      newErrors.quantity = 'Please enter a valid quantity greater than zero.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: initialItem?.id,
      name: name.trim(),
      category,
      quantity: numQty,
      unit,
      storageLocation,
      dateAdded: dateAdded || undefined,
      expiryDate: expiryDate || undefined,
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-[#FFFFFF] border border-[#E7E9E2] rounded-3xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-xl"
        role="dialog"
        aria-labelledby="modal-food-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E7E9E2]">
          <h2 id="modal-food-title" className="text-xl font-bold text-[#252B27]">
            {initialItem ? 'Edit Food Item' : 'Add Food Item'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[#737B74] hover:text-[#252B27] hover:bg-[#FAFAF6] transition-colors cursor-pointer"
            aria-label="Cancel and close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#737B74] mt-3">
          Enter the food you want to keep track of. Add a date if you know it.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Food Name */}
          <div>
            <label htmlFor="food-name" className="block text-xs font-semibold text-[#252B27] mb-1">
              Food name <span className="text-[#B94A48]">*</span>
            </label>
            <input
              id="food-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Fresh Tomatoes, Greek Yogurt, Bread"
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-[#252B27] text-sm focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C] transition-colors"
            />
            {errors.name && (
              <p className="text-xs text-[#B94A48] mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="food-category" className="block text-xs font-semibold text-[#252B27] mb-1">
              Category <span className="text-[#B94A48]">*</span>
            </label>
            <select
              id="food-category"
              value={category}
              onChange={e => setCategory(e.target.value as FoodCategory)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-[#252B27] text-sm focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C] transition-colors cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Unit in 2-col */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="food-quantity" className="block text-xs font-semibold text-[#252B27] mb-1">
                Quantity <span className="text-[#B94A48]">*</span>
              </label>
              <input
                id="food-quantity"
                type="number"
                step="any"
                min="0.1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="1"
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-[#252B27] text-sm focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C] transition-colors"
              />
              {errors.quantity && (
                <p className="text-xs text-[#B94A48] mt-1 font-medium">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label htmlFor="food-unit" className="block text-xs font-semibold text-[#252B27] mb-1">
                Unit <span className="text-[#B94A48]">*</span>
              </label>
              <select
                id="food-unit"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-[#252B27] text-sm focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C] transition-colors cursor-pointer"
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Storage Location */}
          <div>
            <label htmlFor="food-storage" className="block text-xs font-semibold text-[#252B27] mb-1">
              Storage location <span className="text-[#737B74] font-normal">(optional)</span>
            </label>
            <select
              id="food-storage"
              value={storageLocation}
              onChange={e => setStorageLocation(e.target.value as StorageLocation)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-[#252B27] text-sm focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C] transition-colors cursor-pointer"
            >
              {STORAGE_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dates in 2-col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="food-date-added" className="block text-xs font-semibold text-[#252B27] mb-1">
                Date added <span className="text-[#737B74] font-normal">(optional)</span>
              </label>
              <input
                id="food-date-added"
                type="date"
                value={dateAdded}
                onChange={e => setDateAdded(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-[#252B27] text-sm focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="food-expiry-date" className="block text-xs font-semibold text-[#252B27] mb-1">
                Expiry / Best-before date <span className="text-[#737B74] font-normal">(optional)</span>
              </label>
              <input
                id="food-expiry-date"
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-[#252B27] text-sm focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C] transition-colors"
              />
              <p className="text-[11px] text-[#737B74] mt-0.5">Used for reminders</p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="food-notes" className="block text-xs font-semibold text-[#252B27] mb-1">
              Notes <span className="text-[#737B74] font-normal">(optional)</span>
            </label>
            <input
              id="food-notes"
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Leftover from dinner, sealed container"
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E9E2] bg-[#FAFAF6] text-[#252B27] text-sm focus:outline-none focus:ring-2 focus:ring-[#52765C]/30 focus:border-[#52765C] transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[#E7E9E2] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2 text-sm font-medium text-[#737B74] hover:text-[#252B27] hover:bg-[#FAFAF6] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2 text-sm font-medium text-white bg-[#52765C] hover:bg-[#43624c] rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Food Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
