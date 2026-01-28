import { API_BASE_URL } from './apiConfig';
import { getUserId } from '@/lib/auth';

export interface BudgetData {
    total: number;
    allocations: Record<string, number>;
}

export const budgetService = {
    // Fetch latest budget from Google Sheets (filtered by userId)
    async fetchBudget(): Promise<BudgetData | null> {
        const userId = getUserId();
        if (!userId) {
            console.warn('No userId found, returning default budget');
            return { total: 0, allocations: {} };
        }

        try {
            const response = await fetch(`${API_BASE_URL}?action=getBudget&userId=${encodeURIComponent(userId)}`);
            if (!response.ok) throw new Error('Failed to fetch budget');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching budget:', error);
            return null;
        }
    },

    // Update budget in Google Sheets (with userId)
    async updateBudget(data: BudgetData): Promise<boolean> {
        const userId = getUserId();
        if (!userId) {
            console.error('No userId found, cannot update budget');
            return false;
        }

        try {
            const payload = {
                ...data,
                userId
            };

            const response = await fetch(`${API_BASE_URL}?action=updateBudget`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            return result.success === true;
        } catch (error) {
            console.error('Error updating budget:', error);
            return false;
        }
    }
};
