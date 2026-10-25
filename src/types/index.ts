export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  image?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type PostCategory = 'NEWS' | 'PROMPT' | 'SKILL' | 'WORKFLOW';

export interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: PostCategory;
  tags?: string;
  thumbnail?: string | null;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  pid: string;
  name: string;
  slug: string;
  description: string;
  content?: string;
  price: number;
  original_price: number;
  thumbnail?: string | null;
  preview_url?: string | null;
  download_url?: string | null;
  category: string;
  is_active: boolean;
  sales_count: number;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Order {
  id: string;
  order_code: string;
  user_id?: string | null;
  affiliate_code?: string | null;
  affiliate_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  product_id: string;
  product_name: string;
  price: number;
  receipt_image_url?: string | null;
  payment_status: PaymentStatus;
  payment_method: string;
  approved_at?: string | null;
  approved_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserLibraryItem {
  id: string;
  user_id: string;
  product_id: string;
  order_id?: string | null;
  unlocked_at: string;
  // joined fields
  product_name?: string;
  product_slug?: string;
  category?: string;
  download_url?: string;
  thumbnail?: string;
}

export interface Lead {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  resource_id?: string | null;
  resource_name?: string | null;
  source: string;
  created_at: string;
}

export type AffiliateStatus = 'ACTIVE' | 'PENDING' | 'BANNED';

export interface AffiliatePartner {
  id: string;
  user_id?: string | null;
  code: string;
  name: string;
  email: string;
  phone?: string | null;
  commission_rate: number;
  balance: number;
  total_earned: number;
  bank_name?: string | null;
  bank_account_no?: string | null;
  bank_account_name?: string | null;
  status: AffiliateStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AffiliateClick {
  id: string;
  affiliate_id: string;
  code: string;
  ip_address?: string | null;
  user_agent?: string | null;
  landing_path?: string | null;
  referrer?: string | null;
  created_at: string;
}

export type CommissionStatus = 'PENDING' | 'APPROVED' | 'CANCELLED' | 'PAID';

export interface AffiliateCommission {
  id: string;
  affiliate_id: string;
  order_id: string;
  order_code: string;
  order_amount: number;
  rate: number;
  commission_amount: number;
  status: CommissionStatus;
  approved_at?: string | null;
  created_at: string;
}

export type PayoutStatus = 'REQUESTED' | 'TRANSFERRED' | 'REJECTED';

export interface AffiliatePayout {
  id: string;
  affiliate_id: string;
  amount: number;
  bank_info?: string | null;
  status: PayoutStatus;
  proof_image?: string | null;
  transferred_at?: string | null;
  transferred_by?: string | null;
  notes?: string | null;
  created_at: string;
}

