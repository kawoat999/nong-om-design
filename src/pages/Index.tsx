import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse w-12 h-12 rounded-xl bg-primary/20" /></div>;
  }
  
  return <Navigate to={user ? '/dashboard' : '/auth'} replace />;
};

export default Index;
