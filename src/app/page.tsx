'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { PlaceCard } from '@/components/PlaceCard'
import { CategoryTabs } from '@/components/CategoryTabs'
import { createClient } from '@/lib/supabase/client'
import { Place } from '@/types/database'
import { Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'

type Category = 'all' | 'cafe' | 'restaurant' | 'dessert' | 'activity'

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      let query = supabase.from('places').select('*').order('average_rating', { ascending: false })
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      const { data: placesData } = await query
      setPlaces(placesData ?? [])

      if (user) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('place_id')
          .eq('user_id', user.id)
        
        setFavorites(new Set(favData?.map(f => f.place_id) ?? []))
      }

      setIsLoading(false)
    }

    fetchData()
  }, [selectedCategory])

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
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Link
          href="/survey"
          className="block mb-6 p-5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">나만의 데이트 장소 찾기</h2>
              <p className="text-white/80 text-sm">5개 질문으로 맞춤 추천 받기</p>
            </div>
          </div>
        </Link>

        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">인기 데이트 장소</h2>
          </div>
          <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
        </section>

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
        ) : places.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <p>장소가 없습니다</p>
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
