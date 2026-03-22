export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          handicap: number | null
          avatar_url: string | null
          role: 'subscriber' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          handicap?: number | null
          avatar_url?: string | null
          role?: 'subscriber' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          handicap?: number | null
          avatar_url?: string | null
          role?: 'subscriber' | 'admin'
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'monthly' | 'yearly'
          status: 'active' | 'cancelled' | 'lapsed' | 'trialing' | 'past_due'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'monthly' | 'yearly'
          status: 'active' | 'cancelled' | 'lapsed' | 'trialing' | 'past_due'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          plan?: 'monthly' | 'yearly'
          status?: 'active' | 'cancelled' | 'lapsed' | 'trialing' | 'past_due'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          updated_at?: string
        }
      }
      charities: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          website_url: string | null
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          website_url?: string | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          website_url?: string | null
          is_featured?: boolean
          is_active?: boolean
          updated_at?: string
        }
      }
      charity_events: {
        Row: {
          id: string
          charity_id: string
          title: string
          description: string | null
          event_date: string
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          charity_id: string
          title: string
          description?: string | null
          event_date: string
          location?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          event_date?: string
          location?: string | null
        }
      }
      user_charity_selections: {
        Row: {
          id: string
          user_id: string
          charity_id: string
          contribution_pct: number
          selected_at: string
        }
        Insert: {
          id?: string
          user_id: string
          charity_id: string
          contribution_pct?: number
          selected_at?: string
        }
        Update: {
          charity_id?: string
          contribution_pct?: number
          selected_at?: string
        }
      }
      golf_scores: {
        Row: {
          id: string
          user_id: string
          score: number
          played_on: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          played_on: string
          created_at?: string
        }
        Update: {
          score?: number
          played_on?: string
        }
      }
      draws: {
        Row: {
          id: string
          status: 'pending' | 'simulated' | 'published' | 'cancelled'
          draw_type: 'random' | 'algorithmic'
          winning_numbers: number[]
          draw_date: string
          total_pool_amount: number
          jackpot_carried_over: number
          jackpot_rolled_over: boolean
          published_at: string | null
          simulation_run_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          status?: 'pending' | 'simulated' | 'published' | 'cancelled'
          draw_type?: 'random' | 'algorithmic'
          winning_numbers?: number[]
          draw_date: string
          total_pool_amount?: number
          jackpot_carried_over?: number
          jackpot_rolled_over?: boolean
          published_at?: string | null
          simulation_run_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pending' | 'simulated' | 'published' | 'cancelled'
          draw_type?: 'random' | 'algorithmic'
          winning_numbers?: number[]
          total_pool_amount?: number
          jackpot_carried_over?: number
          jackpot_rolled_over?: boolean
          published_at?: string | null
          simulation_run_at?: string | null
          updated_at?: string
        }
      }
      prize_tiers: {
        Row: {
          id: string
          draw_id: string
          match_count: 3 | 4 | 5
          pool_pct: 25 | 35 | 40
          pool_amount: number
          winner_count: number
          prize_per_winner: number
          rolled_over: boolean
        }
        Insert: {
          id?: string
          draw_id: string
          match_count: 3 | 4 | 5
          pool_pct: 25 | 35 | 40
          pool_amount?: number
          winner_count?: number
          prize_per_winner?: number
          rolled_over?: boolean
        }
        Update: {
          pool_amount?: number
          winner_count?: number
          prize_per_winner?: number
          rolled_over?: boolean
        }
      }
      draw_entries: {
        Row: {
          id: string
          draw_id: string
          user_id: string
          numbers_used: number[]
          match_count: number | null
          entered_at: string
        }
        Insert: {
          id?: string
          draw_id: string
          user_id: string
          numbers_used: number[]
          match_count?: number | null
          entered_at?: string
        }
        Update: {
          match_count?: number | null
        }
      }
      winners: {
        Row: {
          id: string
          draw_id: string
          user_id: string
          draw_entry_id: string
          prize_tier_id: string
          prize_amount: number
          verification_status: 'pending' | 'approved' | 'rejected'
          proof_url: string | null
          payout_status: 'pending' | 'paid'
          admin_notes: string | null
          verified_at: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          draw_id: string
          user_id: string
          draw_entry_id: string
          prize_tier_id: string
          prize_amount: number
          verification_status?: 'pending' | 'approved' | 'rejected'
          proof_url?: string | null
          payout_status?: 'pending' | 'paid'
          admin_notes?: string | null
          verified_at?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          verification_status?: 'pending' | 'approved' | 'rejected'
          proof_url?: string | null
          payout_status?: 'pending' | 'paid'
          admin_notes?: string | null
          verified_at?: string | null
          paid_at?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      active_subscriber_count: {
        Row: { total: number | null }
      }
      user_latest_scores: {
        Row: {
          id: string
          user_id: string
          score: number
          played_on: string
          created_at: string
        }
      }
      draw_results: {
        Row: {
          draw_id: string
          draw_date: string
          winning_numbers: number[]
          total_pool_amount: number
          match_count: number
          pool_amount: number
          winner_count: number
          prize_per_winner: number
          rolled_over: boolean
        }
      }
    }
    Functions: {
      create_prize_tiers: {
        Args: { p_draw_id: string; p_total_pool: number }
        Returns: void
      }
    }
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Charity = Database['public']['Tables']['charities']['Row']
export type CharityEvent = Database['public']['Tables']['charity_events']['Row']
export type UserCharitySelection = Database['public']['Tables']['user_charity_selections']['Row']
export type GolfScore = Database['public']['Tables']['golf_scores']['Row']
export type Draw = Database['public']['Tables']['draws']['Row']
export type PrizeTier = Database['public']['Tables']['prize_tiers']['Row']
export type DrawEntry = Database['public']['Tables']['draw_entries']['Row']
export type Winner = Database['public']['Tables']['winners']['Row']
