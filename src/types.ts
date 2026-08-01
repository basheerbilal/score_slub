/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
  name?: string;
  contact_number?: string;
  addresses?: string[];
  subscribed_to_updates?: boolean;
}

export interface Team {
  id: number;
  name: string;
  logo_url: string;
  stadium: string;
  founded_year: number;
  coach: string;
}

export interface Player {
  id: number;
  team_id: number;
  name: string;
  jersey_number: number;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  nationality: string;
  goals: number;
  assists: number;
  image_url: string;
}

export interface Match {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_team_score: number;
  away_team_score: number;
  match_date: string;
  status: 'upcoming' | 'live' | 'completed';
  stadium: string;
  competition?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'Jerseys' | 'Shoes' | 'Equipment' | 'Accessories';
  stock: number;
}

export interface CartItem {
  product_id: number;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'shipped' | 'completed' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

export interface Feedback {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number; // 1-5
  created_at: string;
}

export interface FifaMoment {
  id: number;
  name: string;
  country: string;
  img: string;
  video_url?: string;
  type: 'top' | 'celebration';
}
