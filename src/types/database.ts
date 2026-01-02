export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SurveyResult = {
  food_preference: string
  atmosphere: string
  budget: string
  date_type: string
  time_preference: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          nickname: string
          university: string | null
          survey_result: SurveyResult | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nickname: string
          university?: string | null
          survey_result?: SurveyResult | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nickname?: string
          university?: string | null
          survey_result?: SurveyResult | null
          created_at?: string
          updated_at?: string
        }
      }
      places: {
        Row: {
          id: string
          name: string
          address: string
          category: 'cafe' | 'restaurant' | 'dessert' | 'activity'
          price_range: 'low' | 'medium' | 'high'
          image_url: string | null
          description: string | null
          tags: string[]
          average_rating: number
          review_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          category: 'cafe' | 'restaurant' | 'dessert' | 'activity'
          price_range: 'low' | 'medium' | 'high'
          image_url?: string | null
          description?: string | null
          tags?: string[]
          average_rating?: number
          review_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          category?: 'cafe' | 'restaurant' | 'dessert' | 'activity'
          price_range?: 'low' | 'medium' | 'high'
          image_url?: string | null
          description?: string | null
          tags?: string[]
          average_rating?: number
          review_count?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          place_id: string
          rating: number
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          place_id: string
          rating: number
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          place_id?: string
          rating?: number
          content?: string
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          place_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          place_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          place_id?: string
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Place = Database['public']['Tables']['places']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
