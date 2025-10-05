export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  website_url: string;
  pricing: 'Free' | 'Freemium' | 'Paid';
  features: string[];
  logo_url?: string;
  rating: number;
  review_count: number;
  created_at: string;
  getting_started_guide?: Array<{
    title: string;
    description: string;
    details?: string[];
    image?: string;
    tips?: string;
    video?: string;
  }>;
  use_cases?: string[];
  pros?: string[];
  cons?: string[];
  best_for?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Review {
  id: string;
  tool_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: User;
}

export interface Favorite {
  id: string;
  user_id: string;
  tool_id: string;
  created_at: string;
}