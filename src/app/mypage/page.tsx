'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile, Place } from '@/types/database'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { PlaceCard } from '@/components/PlaceCard'
import { User, GraduationCap, Heart, LogOut, Edit2, Check, X } from 'lucide-react'
import Link from 'next/link'

export default function MyPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [favoritePlaces, setFavoritePlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ nickname: '', university: '' })

  useEffect(() => {
    const supabase = createClient()

    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData as Profile)
        setEditData({
          nickname: profileData.nickname,
          university: profileData.university ?? '',
        })
      }

      const { data: favData } = await supabase
        .from('favorites')
        .select('place_id, places(*)')
        .eq('user_id', user.id)

      if (favData) {
        const places = favData
          .map((f) => (f as unknown as { places: Place }).places)
          .filter(Boolean) as Place[]
        setFavoritePlaces(places)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        nickname: editData.nickname,
        university: editData.university || null,
      })
      .eq('id', profile.id)

    if (!error) {
      setProfile(prev => prev ? { ...prev, nickname: editData.nickname, university: editData.university || null } : null)
      setIsEditing(false)
    }
  }

  const removeFavorite = async (placeId: string) => {
    if (!profile) return

    const supabase = createClient()
    await supabase.from('favorites').delete().eq('user_id', profile.id).eq('place_id', placeId)
    setFavoritePlaces(prev => prev.filter(p => p.id !== placeId))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-muted mb-4">로그인이 필요합니다</p>
        <Link href="/login" className="btn-primary">
          로그인하기
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <section className="card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Edit2 className="w-5 h-5 text-muted" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditData({
                      nickname: profile.nickname,
                      university: profile.university ?? '',
                    })
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editData.nickname}
                onChange={e => setEditData(prev => ({ ...prev, nickname: e.target.value }))}
                className="input"
                placeholder="닉네임"
              />
              <input
                type="text"
                value={editData.university}
                onChange={e => setEditData(prev => ({ ...prev, university: e.target.value }))}
                className="input"
                placeholder="학교 (선택)"
              />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-1">{profile.nickname}</h2>
              <p className="text-muted text-sm mb-2">{profile.email}</p>
              {profile.university && (
                <div className="flex items-center gap-1 text-muted">
                  <GraduationCap className="w-4 h-4" />
                  <span>{profile.university}</span>
                </div>
              )}
            </>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">찜한 장소</h2>
            <span className="text-muted">({favoritePlaces.length})</span>
          </div>

          {favoritePlaces.length === 0 ? (
            <div className="card p-8 text-center">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-muted mb-4">아직 찜한 장소가 없어요</p>
              <Link href="/" className="text-primary font-medium hover:underline">
                장소 둘러보기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoritePlaces.map(place => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isFavorite={true}
                  onToggleFavorite={() => removeFavorite(place.id)}
                />
              ))}
            </div>
          )}
        </section>

        <button
          onClick={handleLogout}
          className="w-full mt-8 p-4 rounded-xl border border-border text-muted hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          로그아웃
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
