import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function AppLayout() {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="fixed top-0 left-0 h-screen w-64">
          <AppSidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <AppSidebar onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <AppHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
