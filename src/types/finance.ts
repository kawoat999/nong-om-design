// Category Types
export type CategoryType =
    | 'food'
    | 'transport'
    | 'entertainment'
    | 'healthcare'
    | 'utilities'
    | 'shopping'
    | 'investment'
    | 'other';

// Transaction Types
export type TransactionType = 'income' | 'expense';

// Category Display Configuration
export const CATEGORY_CONFIG: Record<CategoryType, {
    icon: string;
    color: string;
    label: string;
    bgColor: string;
}> = {
    food: {
        icon: 'Utensils',
        color: '#F97316',
        label: 'Food',
        bgColor: 'bg-orange-100'
    },
    transport: {
        icon: 'Car',
        color: '#3B82F6',
        label: 'Transport',
        bgColor: 'bg-blue-100'
    },
    entertainment: {
        icon: 'Film',
        color: '#EC4899',
        label: 'Entertainment',
        bgColor: 'bg-pink-100'
    },
    healthcare: {
        icon: 'Pill',
        color: '#10B981',
        label: 'Healthcare',
        bgColor: 'bg-emerald-100'
    },
    utilities: {
        icon: 'Receipt',
        color: '#6366F1',
        label: 'Bills',
        bgColor: 'bg-indigo-100'
    },
    shopping: {
        icon: 'ShoppingCart',
        color: '#8B5CF6',
        label: 'Shopping',
        bgColor: 'bg-violet-100'
    },
    investment: {
        icon: 'TrendingUp',
        color: '#14B8A6',
        label: 'Investment',
        bgColor: 'bg-teal-100'
    },
    other: {
        icon: 'Package',
        color: '#6B7280',
        label: 'Other',
        bgColor: 'bg-gray-100'
    },
};

// Transaction Interface
export interface Transaction {
    id: string;
    date: string;
    type: TransactionType;
    category: CategoryType;
    amount: number;
    description: string;
    notes?: string;
}

// Budget Allocation
export interface BudgetAllocation {
    category: CategoryType;
    amount: number;
    spent: number;
}
