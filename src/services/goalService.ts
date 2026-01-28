import { API_BASE_URL } from './apiConfig';
import { getUserId } from '@/lib/auth';

export interface Goal {
    id: string;
    name: string;
    target: number;
    current: number;
    icon: string;
    color: string;
}

export const goalService = {
    // Fetch goals from Google Sheets (filtered by userId)
    async fetchGoals(): Promise<Goal[]> {
        const userId = getUserId();
        if (!userId) {
            console.warn('No userId found, returning empty goals');
            return [];
        }

        try {
            const response = await fetch(`${API_BASE_URL}?action=getGoals&userId=${encodeURIComponent(userId)}`);
            if (!response.ok) throw new Error('Failed to fetch goals');
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching goals:', error);
            return [];
        }
    },

    // Add new goal (with userId)
    async addGoal(goal: Omit<Goal, 'id'>): Promise<Goal | null> {
        const userId = getUserId();
        if (!userId) {
            console.error('No userId found, cannot add goal');
            return null;
        }

        try {
            const payload = {
                ...goal,
                userId,
                id: Math.random().toString(36).substr(2, 9)
            };

            const response = await fetch(`${API_BASE_URL}?action=addGoal`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                return { id: payload.id, ...goal } as Goal;
            }
            return null;
        } catch (error) {
            console.error('Error adding goal:', error);
            return null;
        }
    },

    // Update goal's current amount (with userId)
    async updateGoal(id: string, newCurrentAmount: number): Promise<boolean> {
        const userId = getUserId();
        if (!userId) {
            console.error('No userId found, cannot update goal');
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}?action=updateGoal`, {
                method: 'POST',
                body: JSON.stringify({ id, current: newCurrentAmount, userId })
            });
            const result = await response.json();
            return result.success === true;
        } catch (error) {
            console.error('Error updating goal:', error);
            return false;
        }
    },

    // Delete goal (with userId)
    async deleteGoal(id: string): Promise<boolean> {
        const userId = getUserId();
        if (!userId) {
            console.error('No userId found, cannot delete goal');
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}?action=deleteGoal`, {
                method: 'POST',
                body: JSON.stringify({ id, userId })
            });
            const result = await response.json();
            return result.success === true;
        } catch (error) {
            console.error('Error deleting goal:', error);
            return false;
        }
    }
};
