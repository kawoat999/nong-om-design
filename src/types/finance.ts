export type TransactionType = 'income' | 'expense';

export type CategoryType = 
  | 'housing' 
  | 'food' 
  | 'transport' 
  | 'utilities' 
  | 'entertainment' 
  | 'shopping' 
  | 'healthcare' 
  | 'salary' 
  | 'freelance' 
  | 'investment' 
  | 'other';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: CategoryType;
  type: TransactionType;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  icon: string;
  color: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: CategoryType;
  amount: number;
  month: number;
  year: number;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_CONFIG: Record<CategoryType, { label: string; icon: string; color: string }> = {
  housing: { label: 'Housing', icon: 'Home', color: '#6366f1' },
  food: { label: 'Food & Dining', icon: 'UtensilsCrossed', color: '#f97316' },
  transport: { label: 'Transport', icon: 'Car', color: '#3b82f6' },
  utilities: { label: 'Utilities', icon: 'Zap', color: '#eab308' },
  entertainment: { label: 'Entertainment', icon: 'Gamepad2', color: '#a855f7' },
  shopping: { label: 'Shopping', icon: 'ShoppingBag', color: '#ec4899' },
  healthcare: { label: 'Healthcare', icon: 'Heart', color: '#ef4444' },
  salary: { label: 'Salary', icon: 'Briefcase', color: '#10b981' },
  freelance: { label: 'Freelance', icon: 'Laptop', color: '#14b8a6' },
  investment: { label: 'Investment', icon: 'TrendingUp', color: '#22c55e' },
  other: { label: 'Other', icon: 'MoreHorizontal', color: '#6b7280' },
};
