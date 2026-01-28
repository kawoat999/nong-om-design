import { AlertTriangle } from "lucide-react";

export function SystemCheck({ children }: { children: React.ReactNode }) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const isConfigured = supabaseUrl && supabaseKey;

    if (!isConfigured) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-destructive/5 p-6 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Configuration Missing</h1>
                <p className="text-muted-foreground max-w-md mb-6">
                    The application cannot connect to the database. This usually happens when environment variables are missing.
                </p>

                <div className="bg-card p-6 rounded-lg border shadow-sm max-w-md w-full text-left">
                    <h2 className="font-semibold mb-3">How to fix (Vercel):</h2>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Go to your Vercel Project Settings</li>
                        <li>Select <strong>Environment Variables</strong></li>
                        <li>Add the following keys from your local <code>.env</code>:
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 font-mono text-xs">
                                <li>VITE_SUPABASE_URL</li>
                                <li>VITE_SUPABASE_PUBLISHABLE_KEY</li>
                            </ul>
                        </li>
                        <li>Redeploy the application</li>
                    </ol>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
