'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Place } from '@/types/database'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { PlaceCard } from '@/components/PlaceCard'
import { Search, X } from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [places, setPlaces] = useState<Place[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null)
      if (user) {
        supabase
          .from('favorites')
          .select('place_id')
          .eq('user_id', user.id)
          .then(({ data }) => {
            setFavorites(new Set(data?.map(f => f.place_id) ?? []))
          })
      }
    })
  }, [])

  const searchPlaces = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setPlaces([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    const supabase = createClient()
    const { data } = await supabase
      .from('places')
      .select('*')
      .or(`name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .order('average_rating', { ascending: false })
      .limit(20)

    setPlaces(data ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPlaces(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchPlaces])

  const toggleFavorite = async (placeId: string) => {
    if (!userId) {
      window.location.href = '/login'
      return
    }

    const supabase = createClient()
    const isFavorite = favorites.has(placeId)

    if (isFavorite) {
      await supabase.from('favorites').delete().eq('user_id', userId).eq('place_id', placeId)
      setFavorites(prev => {
        const next = new Set(prev)
        next.delete(placeId)
        return next
      })
    } else {
      await supabase.from('favorites').insert({ user_id: userId, place_id: placeId })
      setFavorites(prev => new Set(prev).add(placeId))
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="장소명, 주소, 키워드로 검색"
              className="input input-icon input-icon-right"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-muted" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : hasSearched && places.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-muted">'{query}'에 대한 검색 결과가 없어요</p>
          </div>
        ) : !hasSearched ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-muted">검색어를 입력해주세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {places.map(place => (
              <PlaceCard
                key={place.id}
                place={place}
                isFavorite={favorites.has(place.id)}
                onToggleFavorite={() => toggleFavorite(place.id)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
