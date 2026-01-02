'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Place, Review, Profile } from '@/types/database'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { ArrowLeft, Heart, MapPin, Star, Send } from 'lucide-react'
import Link from 'next/link'

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

type ReviewWithProfile = Review & { profiles: Pick<Profile, 'nickname'> }

export default function PlaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const placeId = params.id as string

  const [place, setPlace] = useState<Place | null>(null)
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [newReview, setNewReview] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      const { data: placeData } = await supabase
        .from('places')
        .select('*')
        .eq('id', placeId)
        .single()

      if (!placeData) {
        router.push('/')
        return
      }
      setPlace(placeData as Place)

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*, profiles(nickname)')
        .eq('place_id', placeId)
        .order('created_at', { ascending: false })

      setReviews((reviewsData as ReviewWithProfile[]) ?? [])

      if (user) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('place_id', placeId)
          .single()

        setIsFavorite(!!favData)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [placeId, router])

  const toggleFavorite = async () => {
    if (!userId) {
      router.push('/login')
      return
    }

    const supabase = createClient()

    if (isFavorite) {
      await supabase.from('favorites').delete().eq('user_id', userId).eq('place_id', placeId)
      setIsFavorite(false)
    } else {
      await supabase.from('favorites').insert({ user_id: userId, place_id: placeId })
      setIsFavorite(true)
    }
  }

  const submitReview = async () => {
    if (!userId) {
      router.push('/login')
      return
    }

    if (!newReview.trim()) return

    setIsSubmitting(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        place_id: placeId,
        rating: newRating,
        content: newReview.trim(),
      })
      .select('*, profiles(nickname)')
      .single()

    if (!error && data) {
      setReviews(prev => [data as ReviewWithProfile, ...prev])
      setNewReview('')
      setNewRating(5)
      
      if (place) {
        const newCount = place.review_count + 1
        const newAvg = ((place.average_rating * place.review_count) + newRating) / newCount
        setPlace({ ...place, review_count: newCount, average_rating: newAvg })
      }
    }

    setIsSubmitting(false)
  }

  if (isLoading || !place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFavorite}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-lg"
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="relative aspect-[16/9] bg-gray-100">
          {place.image_url && (
            <Image
              src={place.image_url}
              alt={place.name}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        <div className="px-4 py-6">
          <div className="flex items-start justify-between mb-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {categoryLabels[place.category]}
            </span>
            <span className="text-secondary font-medium">
              {priceLabels[place.price_range]}
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2">{place.name}</h1>

          <div className="flex items-center gap-4 text-muted mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-accent text-accent" />
              <span className="font-semibold text-foreground">{place.average_rating.toFixed(1)}</span>
              <span>({place.review_count}개 리뷰)</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-muted mb-4">
            <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{place.address}</span>
          </div>

          {place.description && (
            <p className="text-muted leading-relaxed mb-4">{place.description}</p>
          )}

          {place.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {place.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-sm text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <hr className="my-6 border-border" />

          <section>
            <h2 className="text-lg font-bold mb-4">리뷰 {place.review_count}개</h2>

            {userId && (
              <div className="card p-4 mb-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? 'fill-accent text-accent' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="리뷰를 작성해주세요"
                    value={newReview}
                    onChange={e => setNewReview(e.target.value)}
                    className="input flex-1"
                    onKeyDown={e => e.key === 'Enter' && submitReview()}
                  />
                  <button
                    onClick={submitReview}
                    disabled={isSubmitting || !newReview.trim()}
                    className="btn-primary px-4"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {!userId && (
              <Link href="/login" className="block card p-4 mb-6 text-center text-muted hover:bg-gray-50">
                로그인하고 리뷰 작성하기
              </Link>
            )}

            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.profiles.nickname}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted">{review.content}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(review.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}

              {reviews.length === 0 && (
                <p className="text-center text-muted py-8">아직 리뷰가 없어요</p>
              )}
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
