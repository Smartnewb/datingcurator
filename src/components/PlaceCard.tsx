'use client'

import { Heart, MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Place } from '@/types/database'

interface PlaceCardProps {
  place: Place
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

const priceLabels = {
  low: '1만원 이하',
  medium: '1~3만원',
  high: '3만원 이상',
}

const categoryLabels = {
  cafe: '카페',
  restaurant: '식당',
  dessert: '디저트',
  activity: '액티비티',
}

export function PlaceCard({ place, isFavorite = false, onToggleFavorite }: PlaceCardProps) {
  return (
    <Link href={`/places/${place.id}`} className="card block">
      <div className="relative aspect-[4/3] bg-gray-100">
        {place.image_url ? (
          <Image
            src={place.image_url}
            alt={place.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            이미지 없음
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleFavorite?.()
          }}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary' : 'text-gray-400'}`}
          />
        </button>
        <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-sm font-medium">
          {categoryLabels[place.category]}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{place.name}</h3>
        <div className="flex items-center gap-1 text-sm text-muted mb-2">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{place.address}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-semibold">{place.average_rating.toFixed(1)}</span>
            <span className="text-sm text-muted">({place.review_count})</span>
          </div>
          <span className="text-sm font-medium text-secondary">
            {priceLabels[place.price_range]}
          </span>
        </div>
      </div>
    </Link>
  )
}
