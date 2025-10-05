export interface Tool {
  id: string;
  name: string;
  description: string;
  category_id: string;
  website_url: string;
  pricing: 'Free' | 'Freemium' | 'Paid';
  features: string[];
  logo_url?: string;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  getting_started_guide?: Array<{
    title: string;
    description: string;
    details: string[];
    image?: string;
    tips?: string;
    video?: string;
  }>;
  use_cases?: string[];
  best_for?: string[];
  pros?: string[];
  cons?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Review {
  id: string;
  tool_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  tool_id: string;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}