import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: ReactNode;
  variant?: 'default' | 'income' | 'expense';
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  variant = 'default',
  delay = 0 
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'stat-card',
        variant === 'income' && 'stat-card-income',
        variant === 'expense' && 'stat-card-expense'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          variant === 'default' && 'bg-primary/10 text-primary',
          variant === 'income' && 'bg-income-muted text-income',
          variant === 'expense' && 'bg-expense-muted text-expense'
        )}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full',
            isPositive 
              ? 'bg-income-muted text-income' 
              : 'bg-expense-muted text-expense'
          )}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className={cn(
        'text-2xl font-bold tracking-tight',
        variant === 'income' && 'text-income',
        variant === 'expense' && 'text-expense'
      )}>
        {value}
      </p>
    </motion.div>
  );
}
