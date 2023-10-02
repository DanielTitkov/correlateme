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
      metrics: {
        Row: {
          created_at: string
          desc: string | null
          id: string
          is_active: boolean
          is_public: boolean
          is_system: boolean
          meta: Json | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          desc?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          is_system?: boolean
          meta?: Json | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          desc?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          is_system?: boolean
          meta?: Json | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      observations: {
        Row: {
          created_at: string
          id: string
          is_reconstructed: boolean
          meta: Json | null
          metric_id: string
          timestamp: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_reconstructed?: boolean
          meta?: Json | null
          metric_id: string
          timestamp?: string
          user_id: string
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_reconstructed?: boolean
          meta?: Json | null
          metric_id?: string
          timestamp?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "observations_metric_id_fkey"
            columns: ["metric_id"]
            referencedRelation: "metrics"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
