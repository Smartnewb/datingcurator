'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Place } from '@/types/database'
import { PlaceCard } from '@/components/PlaceCard'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { Sparkles, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function SurveyResultPage() {
  const router = useRouter()
  const [recommendedPlaces, setRecommendedPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetchRecommendations() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      let surveyResult
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('survey_result')
          .eq('id', user.id)
          .single()
        surveyResult = profile?.survey_result
      } else {
        const stored = localStorage.getItem('survey_result')
        surveyResult = stored ? JSON.parse(stored) : null
      }

      if (!surveyResult) {
        router.push('/survey')
        return
      }

      let query = supabase.from('places').select('*')

      if (surveyResult.budget && surveyResult.budget !== 'any') {
        query = query.eq('price_range', surveyResult.budget)
      }

      if (surveyResult.date_type && surveyResult.date_type !== 'any') {
        const categoryMap: Record<string, string> = {
          food: 'restaurant',
          cafe: 'cafe',
          activity: 'activity',
          chill: 'cafe',
        }
        const category = categoryMap[surveyResult.date_type]
        if (category) {
          query = query.eq('category', category)
        }
      }

      const { data: places } = await query.order('average_rating', { ascending: false }).limit(10)
      setRecommendedPlaces(places ?? [])

      if (user) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('place_id')
          .eq('user_id', user.id)
        setFavorites(new Set(favData?.map(f => f.place_id) ?? []))
      }

      setIsLoading(false)
    }

    fetchRecommendations()
  }, [router])

  const toggleFavorite = async (placeId: string) => {
    if (!userId) {
      router.push('/login')
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">맞춤 추천 장소</h1>
          <p className="text-muted">설문 결과를 바탕으로 추천드려요!</p>
        </div>

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
        ) : recommendedPlaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted mb-4">조건에 맞는 장소가 없어요</p>
            <Link href="/survey" className="btn-primary inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              다시 설문하기
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {recommendedPlaces.map(place => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isFavorite={favorites.has(place.id)}
                  onToggleFavorite={() => toggleFavorite(place.id)}
                />
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/survey"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <RotateCcw className="w-4 h-4" />
                다시 설문하기
              </Link>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
