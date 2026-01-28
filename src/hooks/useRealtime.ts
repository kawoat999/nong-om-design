
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export function useRealtime(
    tableName: string,
    callback: (payload: any) => void,
    event: RealtimeEvent = '*'
) {
    useEffect(() => {
        const channel: RealtimeChannel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes' as any,
                {
                    event: event,
                    schema: 'public',
                    table: tableName,
                },
                (payload: any) => {
                    console.log('Realtime change received:', payload);
                    callback(payload);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [tableName, event, callback]);
}
