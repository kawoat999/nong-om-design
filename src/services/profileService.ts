import { API_BASE_URL } from './apiConfig';

export interface ProfileData {
    userId: string;
    displayName: string;
    avatarUrl: string;
    updatedAt?: string;
}

export const profileService = {
    // Fetch profile from Google Sheets
    async fetchProfile(userId: string): Promise<ProfileData | null> {
        try {
            const response = await fetch(`${API_BASE_URL}?action=getProfile&userId=${encodeURIComponent(userId)}`);
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    },

    // Update profile in Google Sheets
    async updateProfile(profile: ProfileData): Promise<boolean> {
        try {
            // Set timeout of 10 seconds
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${API_BASE_URL}?action=updateProfile`, {
                method: 'POST',
                body: JSON.stringify(profile),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.warn('Profile update response not ok:', response.status);
                return false;
            }

            const result = await response.json();
            return result.success === true;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.warn('Profile update timed out');
            } else {
                console.error('Error updating profile:', error);
            }
            return false;
        }
    }
};
