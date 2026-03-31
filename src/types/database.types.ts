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
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          theme: TenantTheme
          feature_flags: FeatureFlags
          subscription_status: 'active' | 'trial' | 'suspended' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tenants']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tenants']['Insert']>
      }
      users: {
        Row: {
          id: string
          clerk_id: string
          name: string
          email: string
          role: UserRole
          tenant_id: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      tutors: {
        Row: {
          id: string
          user_id: string
          tenant_id: string
          bio: string | null
          expertise: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tutors']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tutors']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          tenant_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail_url: string | null
          category_id: string | null
          tutor_id: string
          tenant_id: string
          price: number
          is_published: boolean
          is_live: boolean
          skill: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
      }
      course_content: {
        Row: {
          id: string
          course_id: string
          title: string
          type: 'video' | 'pdf' | 'quiz'
          url: string
          thumbnail_url: string | null
          duration: number | null
          order_index: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['course_content']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['course_content']['Insert']>
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
          progress: number
        }
        Insert: Omit<Database['public']['Tables']['enrollments']['Row'], 'id' | 'enrolled_at'>
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>
      }
      live_sessions: {
        Row: {
          id: string
          course_id: string
          tenant_id: string
          title: string
          room_id: string
          start_time: string
          duration_minutes: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['live_sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['live_sessions']['Insert']>
      }
      payments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          tenant_id: string
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          tenant_id: string
          plan: 'starter' | 'growth' | 'enterprise'
          billing_cycle: 'monthly' | 'yearly'
          status: 'active' | 'cancelled' | 'past_due'
          amount: number
          next_billing_date: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
      ai_logs: {
        Row: {
          id: string
          user_id: string
          tenant_id: string
          query: string
          response: string
          sources: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ai_logs']['Insert']>
      }
    }
  }
}

export type TenantTheme = {
  primary_color: string
  secondary_color: string
  platform_name: string
}

export type FeatureFlags = {
  enable_payments: boolean
  enable_ai_chat: boolean
  enable_voice_ai: boolean
  enable_live_classes: boolean
}

export type UserRole = 'super_admin' | 'admin' | 'tutor' | 'student'

// Convenience row types
export type Tenant = Database['public']['Tables']['tenants']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type CourseContent = Database['public']['Tables']['course_content']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type LiveSession = Database['public']['Tables']['live_sessions']['Row']
export type Tutor = Database['public']['Tables']['tutors']['Row']
export type AiLog = Database['public']['Tables']['ai_logs']['Row']
