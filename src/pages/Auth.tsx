import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import nongOmLogo from '@/assets/nong-om-logo.jpg';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      const { error } = isLogin
        ? await signIn(data.email, data.password)
        : await signUp(data.email, data.password, data.fullName);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else if (!isLogin) {
        toast({ title: 'Account created!', description: 'You can now sign in.' });
        setIsLogin(true);
      } else {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Back to Landing Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <div className="p-2 rounded-full bg-muted/50 group-hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium hidden sm:inline">Back</span>
      </Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-6">
            <img
              src={nongOmLogo}
              alt="Nong Om Logo"
              className="w-24 h-24 rounded-3xl shadow-xl mx-auto object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold">Nong Om</h1>
          <p className="text-muted-foreground">Personal Finance Tracker</p>
        </div>

        <div className="bento-card">
          <div className="flex gap-2 p-1 bg-muted rounded-lg mb-6">
            <button type="button" className={cn('flex-1 py-2 text-sm font-medium rounded-md transition-all', isLogin ? 'bg-card shadow-sm' : 'text-muted-foreground')} onClick={() => setIsLogin(true)}>Sign In</button>
            <button type="button" className={cn('flex-1 py-2 text-sm font-medium rounded-md transition-all', !isLogin ? 'bg-card shadow-sm' : 'text-muted-foreground')} onClick={() => setIsLogin(false)}>Sign Up</button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="fullName" placeholder="John Doe" className="pl-10" {...register('fullName')} />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" {...register('email')} />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...register('password')} />
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}</Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
