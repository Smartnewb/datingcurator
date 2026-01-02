'use client'

import { Coffee, UtensilsCrossed, IceCream, Gamepad2 } from 'lucide-react'

type Category = 'all' | 'cafe' | 'restaurant' | 'dessert' | 'activity'

interface CategoryTabsProps {
  selected: Category
  onSelect: (category: Category) => void
}

const categories: { key: Category; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: '전체', icon: null },
  { key: 'cafe', label: '카페', icon: <Coffee className="w-4 h-4" /> },
  { key: 'restaurant', label: '식당', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { key: 'dessert', label: '디저트', icon: <IceCream className="w-4 h-4" /> },
  { key: 'activity', label: '액티비티', icon: <Gamepad2 className="w-4 h-4" /> },
]

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
      {categories.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
            selected === key
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-muted hover:bg-gray-50 border border-border'
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  )
}
