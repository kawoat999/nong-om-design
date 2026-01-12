import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Landing from './Landing';

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse w-12 h-12 rounded-xl bg-primary/20" /></div>;
  }
  
  // Show landing page for unauthenticated users, redirect to dashboard for authenticated users
  return user ? <Navigate to="/dashboard" replace /> : <Landing />;
};

export default Index;
