export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          amount: number
          booking_type: string
          created_at: string
          date: string
          id: string
          payment_method: string | null
          qr_code: string | null
          quantity: number
          reference_id: string
          seats: string[] | null
          status: string
          time: string
          title: string
          updated_at: string
          user_id: string
          venue: string
        }
        Insert: {
          amount: number
          booking_type: string
          created_at?: string
          date: string
          id?: string
          payment_method?: string | null
          qr_code?: string | null
          quantity?: number
          reference_id: string
          seats?: string[] | null
          status?: string
          time: string
          title: string
          updated_at?: string
          user_id: string
          venue: string
        }
        Update: {
          amount?: number
          booking_type?: string
          created_at?: string
          date?: string
          id?: string
          payment_method?: string | null
          qr_code?: string | null
          quantity?: number
          reference_id?: string
          seats?: string[] | null
          status?: string
          time?: string
          title?: string
          updated_at?: string
          user_id?: string
          venue?: string
        }
        Relationships: []
      }
      districts: {
        Row: {
          created_at: string
          id: string
          name: string
          state: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          state?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          state?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          available_tickets: number
          category: string
          created_at: string
          date: string
          description: string | null
          district_id: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_free: boolean
          organizer: string | null
          price: number
          title: string
          total_tickets: number
          venue: string
        }
        Insert: {
          available_tickets?: number
          category: string
          created_at?: string
          date: string
          description?: string | null
          district_id?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean
          organizer?: string | null
          price?: number
          title: string
          total_tickets?: number
          venue: string
        }
        Update: {
          available_tickets?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          district_id?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean
          organizer?: string | null
          price?: number
          title?: string
          total_tickets?: number
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          icon_type: string
          color_from: string
          color_to: string
          priority: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          icon_type: string
          color_from: string
          color_to: string
          priority?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          icon_type?: string
          color_from?: string
          color_to?: string
          priority?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      coming_soon: {
        Row: {
          id: string
          title: string
          category: string
          image_url: string
          release_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          image_url: string
          release_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          image_url?: string
          release_date?: string | null
          created_at?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          price: number
          type: string | null
          image_url: string | null
          is_available: boolean
          preparation_time_mins: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          price: number
          type?: string | null
          image_url?: string | null
          is_available?: boolean
          preparation_time_mins?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          price?: number
          type?: string | null
          image_url?: string | null
          is_available?: boolean
          preparation_time_mins?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_food_items: {
        Row: {
          id: string
          booking_id: string
          food_item_id: string
          quantity: number
          price_at_booking: number
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          food_item_id: string
          quantity?: number
          price_at_booking: number
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          food_item_id?: string
          quantity?: number
          price_at_booking?: number
          status?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_food_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_food_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          }
        ]
      }
      movies: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          genre: string | null
          id: string
          language: string | null
          poster_url: string | null
          rating: string | null
          release_date: string | null
          status: string | null
          title: string
          trailer_url: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          genre?: string | null
          id?: string
          language?: string | null
          poster_url?: string | null
          rating?: string | null
          release_date?: string | null
          status?: string | null
          title: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          genre?: string | null
          id?: string
          language?: string | null
          poster_url?: string | null
          rating?: string | null
          release_date?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_district_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_district_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_district_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_preferred_district_id_fkey"
            columns: ["preferred_district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      seat_layouts: {
        Row: {
          id: string
          name: string
          type: string
          total_seats: number
          rows: number
          columns: number
          layout_config: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          total_seats: number
          rows: number
          columns: number
          layout_config: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          total_seats?: number
          rows?: number
          columns?: number
          layout_config?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          id: string
          code: string
          discount_type: string
          discount_value: number
          min_order_value: number | null
          max_discount: number | null
          start_date: string | null
          end_date: string | null
          usage_limit: number | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_type: string
          discount_value: number
          min_order_value?: number | null
          max_discount?: number | null
          start_date?: string | null
          end_date?: string | null
          usage_limit?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_type?: string
          discount_value?: number
          min_order_value?: number | null
          max_discount?: number | null
          start_date?: string | null
          end_date?: string | null
          usage_limit?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      shows: {
        Row: {
          available_seats: number
          created_at: string
          format: string | null
          id: string
          movie_id: string
          price: number
          show_time: string
          status: string | null
          theatre_id: string
          total_seats: number
          seat_layout_id: string | null
        }
        Insert: {
          available_seats?: number
          created_at?: string
          format?: string | null
          id?: string
          movie_id: string
          price: number
          show_time: string
          status?: string | null
          theatre_id: string
          total_seats?: number
          seat_layout_id?: string | null
        }
        Update: {
          available_seats?: number
          created_at?: string
          format?: string | null
          id?: string
          movie_id?: string
          price?: number
          show_time?: string
          status?: string | null
          theatre_id?: string
          total_seats?: number
          seat_layout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shows_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shows_seat_layout_id_fkey"
            columns: ["seat_layout_id"]
            isOneToOne: false
            referencedRelation: "seat_layouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shows_theatre_id_fkey"
            columns: ["theatre_id"]
            isOneToOne: false
            referencedRelation: "theatres"
            referencedColumns: ["id"]
          },
        ]
      }
      theatres: {
        Row: {
          address: string | null
          created_at: string
          district_id: string | null
          facilities: string[] | null
          id: string
          name: string
          phone: string | null
          seat_layout_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          district_id?: string | null
          facilities?: string[] | null
          id?: string
          name: string
          phone?: string | null
          seat_layout_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          district_id?: string | null
          facilities?: string[] | null
          id?: string
          name?: string
          phone?: string | null
          seat_layout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theatres_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theatres_seat_layout_id_fkey"
            columns: ["seat_layout_id"]
            isOneToOne: false
            referencedRelation: "seat_layouts"
            referencedColumns: ["id"]
          },
        ]
      }

      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "event_organizer" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
