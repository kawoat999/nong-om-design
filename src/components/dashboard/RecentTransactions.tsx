import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction, CATEGORY_CONFIG } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number, type: 'income' | 'expense') => {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}${new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="bento-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground">Your latest activity</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/transactions" className="gap-2">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {recentTransactions.length > 0 ? (
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => {
            const config = CATEGORY_CONFIG[transaction.category];
            
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <CategoryIcon 
                  category={transaction.category} 
                  className="w-10 h-10"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{config.label}</span>
                    <span>•</span>
                    <span>{format(new Date(transaction.date), 'MMM d')}</span>
                  </div>
                </div>
                <span className={cn(
                  'text-sm font-semibold',
                  transaction.type === 'income' ? 'text-income' : 'text-expense'
                )}>
                  {formatCurrency(Number(transaction.amount), transaction.type)}
                </span>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          <p>No transactions yet</p>
          <p className="text-sm">Add your first transaction to get started</p>
        </div>
      )}
    </motion.div>
  );
}
