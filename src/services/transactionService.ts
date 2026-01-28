import { API_BASE_URL } from './apiConfig';
import { formatThaiDateISO } from '@/lib/thaiTime';
import { getUserId } from '@/lib/auth';

export interface Transaction {
    id: string;
    date: string; // ISO Date string (Thailand timezone)
    category: string;
    amount: number;
    note: string;
}

export const transactionService = {
    // Fetch transactions from Google Sheets (filtered by userId)
    async fetchTransactions(): Promise<Transaction[]> {
        const userId = getUserId();
        if (!userId) {
            console.warn('No userId found, returning empty transactions');
            return [];
        }

        try {
            const response = await fetch(`${API_BASE_URL}?action=getTransactions&userId=${encodeURIComponent(userId)}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    },

    // Add new transaction (with userId)
    async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction | null> {
        const userId = getUserId();
        if (!userId) {
            console.error('No userId found, cannot add transaction');
            return null;
        }

        try {
            const payload = {
                ...transaction,
                userId,
                id: Math.random().toString(36).substr(2, 9)
            };

            const response = await fetch(`${API_BASE_URL}?action=addTransaction`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                return { id: payload.id, ...transaction } as Transaction;
            }
            return null;
        } catch (error) {
            console.error('Error adding transaction:', error);
            return null;
        }
    },

    // Update existing transaction (with userId)
    async updateTransaction(transaction: Transaction): Promise<boolean> {
        const userId = getUserId();
        if (!userId) {
            console.error('No userId found, cannot update transaction');
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}?action=updateTransaction`, {
                method: 'POST',
                body: JSON.stringify({ ...transaction, userId })
            });

            const result = await response.json();
            return result.success === true;
        } catch (error) {
            console.error('Error updating transaction:', error);
            return false;
        }
    },

    // Delete transaction (with userId)
    async deleteTransaction(id: string): Promise<boolean> {
        const userId = getUserId();
        if (!userId) {
            console.error('No userId found, cannot delete transaction');
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}?action=deleteTransaction`, {
                method: 'POST',
                body: JSON.stringify({ id, userId })
            });

            const result = await response.json();
            return result.success === true;
        } catch (error) {
            console.error('Error deleting transaction:', error);
            return false;
        }
    },

    // Calculate Gamification Stats (Derived from Transactions)
    async getGamificationStats(): Promise<{ streak: number; level: number; progress: number; nextLevel: number }> {
        const transactions = await this.fetchTransactions();

        // 1. Calculate Streak (using Thailand timezone)
        const uniqueDates = [...new Set(transactions.map(t => {
            return formatThaiDateISO(t.date);
        }))].sort().reverse();

        let streak = 0;
        const now = new Date();
        const today = formatThaiDateISO(now);
        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(now.getDate() - 1);
        const yesterday = formatThaiDateISO(yesterdayDate);

        if (uniqueDates.length > 0) {
            const latest = uniqueDates[0];

            if (latest === today || latest === yesterday) {
                streak = 1;
                let currentDateString: string = latest;

                for (let i = 1; i < uniqueDates.length; i++) {
                    const prevDateString: string = uniqueDates[i] as string;
                    const curr = new Date(currentDateString);
                    const prev = new Date(prevDateString);
                    const diffTime = Math.abs(curr.getTime() - prev.getTime());
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        streak++;
                        currentDateString = prevDateString;
                    } else {
                        break;
                    }
                }
            }
        }

        // 2. Calculate Level
        const totalTx = transactions.length;
        const level = Math.floor(totalTx / 5) + 1;
        const currentLevelTx = totalTx % 5;
        const progress = (currentLevelTx / 5) * 100;

        return { streak, level, progress, nextLevel: level + 1 };
    }
};
