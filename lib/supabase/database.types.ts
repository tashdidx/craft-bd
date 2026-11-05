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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          created_at: string
          district: string
          division: Database["public"]["Enums"]["bd_division"]
          id: string
          is_default: boolean
          label: string
          phone: string
          postal_code: string | null
          profile_id: string
          recipient_name: string
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          created_at?: string
          district: string
          division: Database["public"]["Enums"]["bd_division"]
          id?: string
          is_default?: boolean
          label?: string
          phone: string
          postal_code?: string | null
          profile_id: string
          recipient_name: string
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          created_at?: string
          district?: string
          division?: Database["public"]["Enums"]["bd_division"]
          id?: string
          is_default?: boolean
          label?: string
          phone?: string
          postal_code?: string | null
          profile_id?: string
          recipient_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_actions: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      artisans: {
        Row: {
          avatar_url: string | null
          biography: string
          cover_image_url: string | null
          craft_specialization: string
          created_at: string
          display_name: string
          district: string
          id: string
          is_featured: boolean
          languages: string[]
          primary_category_id: string | null
          profile_id: string | null
          region: Database["public"]["Enums"]["bd_division"]
          slug: string
          status: Database["public"]["Enums"]["artisan_status"]
          story_video_url: string | null
          updated_at: string
          workshop_name: string | null
          years_of_experience: number
        }
        Insert: {
          avatar_url?: string | null
          biography?: string
          cover_image_url?: string | null
          craft_specialization: string
          created_at?: string
          display_name: string
          district: string
          id?: string
          is_featured?: boolean
          languages?: string[]
          primary_category_id?: string | null
          profile_id?: string | null
          region: Database["public"]["Enums"]["bd_division"]
          slug: string
          status?: Database["public"]["Enums"]["artisan_status"]
          story_video_url?: string | null
          updated_at?: string
          workshop_name?: string | null
          years_of_experience?: number
        }
        Update: {
          avatar_url?: string | null
          biography?: string
          cover_image_url?: string | null
          craft_specialization?: string
          created_at?: string
          display_name?: string
          district?: string
          id?: string
          is_featured?: boolean
          languages?: string[]
          primary_category_id?: string | null
          profile_id?: string | null
          region?: Database["public"]["Enums"]["bd_division"]
          slug?: string
          status?: Database["public"]["Enums"]["artisan_status"]
          story_video_url?: string | null
          updated_at?: string
          workshop_name?: string | null
          years_of_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "artisans_primary_category_id_fkey"
            columns: ["primary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artisans_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          gift_wrap: boolean
          id: string
          product_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          cart_id: string
          created_at?: string
          gift_wrap?: boolean
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          gift_wrap?: boolean
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          artisan_id: string
          certificate_code: string
          certificate_hash: string
          certificate_payload: Json
          created_at: string
          id: string
          issued_at: string
          product_id: string
          revocation_reason: string | null
          revoked_at: string | null
          status: Database["public"]["Enums"]["certificate_status"]
        }
        Insert: {
          artisan_id: string
          certificate_code: string
          certificate_hash: string
          certificate_payload: Json
          created_at?: string
          id?: string
          issued_at?: string
          product_id: string
          revocation_reason?: string | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["certificate_status"]
        }
        Update: {
          artisan_id?: string
          certificate_code?: string
          certificate_hash?: string
          certificate_payload?: Json
          created_at?: string
          id?: string
          issued_at?: string
          product_id?: string
          revocation_reason?: string | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["certificate_status"]
        }
        Relationships: [
          {
            foreignKeyName: "certificates_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      craft_journeys: {
        Row: {
          created_at: string
          description: string
          duration_label: string | null
          id: string
          image_url: string | null
          product_id: string
          sort_order: number
          stage: Database["public"]["Enums"]["journey_stage"]
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          duration_label?: string | null
          id?: string
          image_url?: string | null
          product_id: string
          sort_order: number
          stage: Database["public"]["Enums"]["journey_stage"]
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          duration_label?: string | null
          id?: string
          image_url?: string | null
          product_id?: string
          sort_order?: number
          stage?: Database["public"]["Enums"]["journey_stage"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "craft_journeys_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      craft_stories: {
        Row: {
          created_at: string
          cultural_meaning: string
          did_you_know: string | null
          history: string
          id: string
          materials_description: string
          origin: string
          product_id: string
          title: string
          traditional_uses: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cultural_meaning: string
          did_you_know?: string | null
          history: string
          id?: string
          materials_description: string
          origin: string
          product_id: string
          title: string
          traditional_uses: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cultural_meaning?: string
          did_you_know?: string | null
          history?: string
          id?: string
          materials_description?: string
          origin?: string
          product_id?: string
          title?: string
          traditional_uses?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "craft_stories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_order_events: {
        Row: {
          actor_id: string | null
          created_at: string
          custom_order_id: string
          id: string
          note: string | null
          status: Database["public"]["Enums"]["custom_order_status"]
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          custom_order_id: string
          id?: string
          note?: string | null
          status: Database["public"]["Enums"]["custom_order_status"]
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          custom_order_id?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["custom_order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "custom_order_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_order_events_custom_order_id_fkey"
            columns: ["custom_order_id"]
            isOneToOne: false
            referencedRelation: "custom_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_orders: {
        Row: {
          artisan_id: string
          artisan_note: string | null
          budget_max_bdt: number | null
          budget_min_bdt: number | null
          category_id: string | null
          color: string | null
          created_at: string
          custom_notes: string | null
          customer_id: string
          customer_response_note: string | null
          design_description: string
          estimated_days: number | null
          id: string
          material: string | null
          price_estimate_bdt: number | null
          product_type: string
          quantity: number
          reference_image_url: string | null
          request_code: string
          responded_at: string | null
          size: string | null
          status: Database["public"]["Enums"]["custom_order_status"]
          updated_at: string
        }
        Insert: {
          artisan_id: string
          artisan_note?: string | null
          budget_max_bdt?: number | null
          budget_min_bdt?: number | null
          category_id?: string | null
          color?: string | null
          created_at?: string
          custom_notes?: string | null
          customer_id: string
          customer_response_note?: string | null
          design_description: string
          estimated_days?: number | null
          id?: string
          material?: string | null
          price_estimate_bdt?: number | null
          product_type: string
          quantity?: number
          reference_image_url?: string | null
          request_code: string
          responded_at?: string | null
          size?: string | null
          status?: Database["public"]["Enums"]["custom_order_status"]
          updated_at?: string
        }
        Update: {
          artisan_id?: string
          artisan_note?: string | null
          budget_max_bdt?: number | null
          budget_min_bdt?: number | null
          category_id?: string | null
          color?: string | null
          created_at?: string
          custom_notes?: string | null
          customer_id?: string
          customer_response_note?: string | null
          design_description?: string
          estimated_days?: number | null
          id?: string
          material?: string | null
          price_estimate_bdt?: number | null
          product_type?: string
          quantity?: number
          reference_image_url?: string | null
          request_code?: string
          responded_at?: string | null
          size?: string | null
          status?: Database["public"]["Enums"]["custom_order_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_orders_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_orders_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          artisan_id: string | null
          created_at: string
          gift_wrap: boolean
          id: string
          line_total_bdt: number | null
          order_id: string
          product_id: string | null
          product_image_url: string | null
          product_title: string
          quantity: number
          unit_price_bdt: number
        }
        Insert: {
          artisan_id?: string | null
          created_at?: string
          gift_wrap?: boolean
          id?: string
          line_total_bdt?: number | null
          order_id: string
          product_id?: string | null
          product_image_url?: string | null
          product_title: string
          quantity: number
          unit_price_bdt: number
        }
        Update: {
          artisan_id?: string | null
          created_at?: string
          gift_wrap?: boolean
          id?: string
          line_total_bdt?: number | null
          order_id?: string
          product_id?: string | null
          product_image_url?: string | null
          product_title?: string
          quantity?: number
          unit_price_bdt?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          customer_id: string
          gift_message: string | null
          gift_wrap: boolean
          gift_wrap_bdt: number
          id: string
          order_number: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          placed_at: string
          shipping_address: Json
          shipping_bdt: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal_bdt: number
          total_bdt: number | null
          updated_at: string
        }
        Insert: {
          customer_id: string
          gift_message?: string | null
          gift_wrap?: boolean
          gift_wrap_bdt?: number
          id?: string
          order_number: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          placed_at?: string
          shipping_address: Json
          shipping_bdt?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_bdt?: number
          total_bdt?: number | null
          updated_at?: string
        }
        Update: {
          customer_id?: string
          gift_message?: string | null
          gift_wrap?: boolean
          gift_wrap_bdt?: number
          id?: string
          order_number?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          placed_at?: string
          shipping_address?: Json
          shipping_bdt?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_bdt?: number
          total_bdt?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string
          created_at: string
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt_text?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          artisan_id: string
          care_instructions: string | null
          category_id: string
          compare_at_price_bdt: number | null
          created_at: string
          description: string
          dimensions: string | null
          gift_wrap_available: boolean
          id: string
          is_featured: boolean
          materials: string[]
          occasion_tags: string[]
          price_bdt: number
          published_at: string | null
          region: Database["public"]["Enums"]["bd_division"]
          short_description: string
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          stock_quantity: number
          title: string
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          artisan_id: string
          care_instructions?: string | null
          category_id: string
          compare_at_price_bdt?: number | null
          created_at?: string
          description?: string
          dimensions?: string | null
          gift_wrap_available?: boolean
          id?: string
          is_featured?: boolean
          materials?: string[]
          occasion_tags?: string[]
          price_bdt: number
          published_at?: string | null
          region: Database["public"]["Enums"]["bd_division"]
          short_description?: string
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number
          title: string
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          artisan_id?: string
          care_instructions?: string | null
          category_id?: string
          compare_at_price_bdt?: number | null
          created_at?: string
          description?: string
          dimensions?: string | null
          gift_wrap_available?: boolean
          id?: string
          is_featured?: boolean
          materials?: string[]
          occasion_tags?: string[]
          price_bdt?: number
          published_at?: string | null
          region?: Database["public"]["Enums"]["bd_division"]
          short_description?: string
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number
          title?: string
          updated_at?: string
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          admin_note: string | null
          comment: string
          created_at: string
          customer_id: string
          flagged_reason: string | null
          id: string
          is_verified_purchase: boolean
          order_item_id: string | null
          product_id: string
          rating: number
          status: Database["public"]["Enums"]["review_status"]
          title: string | null
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          comment: string
          created_at?: string
          customer_id: string
          flagged_reason?: string | null
          id?: string
          is_verified_purchase?: boolean
          order_item_id?: string | null
          product_id: string
          rating: number
          status?: Database["public"]["Enums"]["review_status"]
          title?: string | null
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          comment?: string
          created_at?: string
          customer_id?: string
          flagged_reason?: string | null
          id?: string
          is_verified_purchase?: boolean
          order_item_id?: string | null
          product_id?: string
          rating?: number
          status?: Database["public"]["Enums"]["review_status"]
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: true
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          product_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_product: {
        Args: { target_product_id: string }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      owns_artisan: { Args: { target_artisan_id: string }; Returns: boolean }
    }
    Enums: {
      artisan_status: "pending" | "approved" | "suspended"
      bd_division:
        | "barishal"
        | "chattogram"
        | "dhaka"
        | "khulna"
        | "mymensingh"
        | "rajshahi"
        | "rangpur"
        | "sylhet"
      certificate_status: "active" | "revoked"
      custom_order_status:
        | "submitted"
        | "quoted"
        | "approved"
        | "declined"
        | "in_production"
        | "quality_check"
        | "dispatched"
        | "completed"
        | "cancelled"
      journey_stage:
        | "raw_materials"
        | "design"
        | "making"
        | "finishing"
        | "quality_check"
        | "final_product"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_status: "unpaid" | "paid" | "refunded"
      product_status: "draft" | "published" | "archived"
      review_status: "pending" | "published" | "flagged" | "removed"
      user_role: "customer" | "artisan" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      artisan_status: ["pending", "approved", "suspended"],
      bd_division: [
        "barishal",
        "chattogram",
        "dhaka",
        "khulna",
        "mymensingh",
        "rajshahi",
        "rangpur",
        "sylhet",
      ],
      certificate_status: ["active", "revoked"],
      custom_order_status: [
        "submitted",
        "quoted",
        "approved",
        "declined",
        "in_production",
        "quality_check",
        "dispatched",
        "completed",
        "cancelled",
      ],
      journey_stage: [
        "raw_materials",
        "design",
        "making",
        "finishing",
        "quality_check",
        "final_product",
      ],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_status: ["unpaid", "paid", "refunded"],
      product_status: ["draft", "published", "archived"],
      review_status: ["pending", "published", "flagged", "removed"],
      user_role: ["customer", "artisan", "admin"],
    },
  },
} as const
