
import { useState, useEffect, useCallback, useRef } from 'react';
import { budgetService, BudgetData } from '@/services/budgetService';
import { useToast } from "@/components/ui/use-toast";

// Polling Interval (ms)
const POLLING_INTERVAL = 30000; // 30 seconds

export function useSheetSync(
    initialBudget: number,
    initialAllocations: Record<string, number>,
    onUpdate?: (data: BudgetData) => void
) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [lastSynced, setLastSynced] = useState<Date>(new Date());

    // Use ref to store the latest callback so it doesn't trigger effect re-runs
    const onUpdateRef = useRef(onUpdate);

    useEffect(() => {
        onUpdateRef.current = onUpdate;
    }, [onUpdate]);

    const fetchData = useCallback(async () => {
        // Prevent concurrent fetches or fetching if component unmounted (basic check)
        setLoading(true);
        const data = await budgetService.fetchBudget();
        setLoading(false);
        setLastSynced(new Date());

        if (data) {
            onUpdateRef.current?.(data);
            console.log('Synced with Sheets:', data);
        }
    }, []); // No dependencies needed for fetchData now

    // Initial Fetch (No Polling to prevent overwriting user changes)
    useEffect(() => {
        fetchData();
        // Removed polling interval to prevent overwriting local state while editing
    }, [fetchData]);

    const saveToSheet = async (total: number, allocations: Record<string, number>) => {
        setLoading(true);
        const success = await budgetService.updateBudget({ total, allocations });
        setLoading(false);

        if (success) {
            toast({
                title: "Saved to Google Sheets",
                description: "Your budget has been updated successfully.",
            });
            setLastSynced(new Date());
        } else {
            toast({
                variant: "destructive",
                title: "Save Failed",
                description: "Could not sync with Google Sheets.",
            });
        }
    };

    return {
        loading,
        lastSynced,
        refresh: fetchData,
        saveToSheet
    };
}
