import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import { ExpensesPieChart } from '@/components/dashboard/ExpensesPieChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { AddTransactionDialog } from '@/components/transactions/AddTransactionDialog';
import { Transaction } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    setTransactions((data as Transaction[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalIncome = monthlyTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = monthlyTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const totalBalance = transactions.reduce((s, t) => s + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0);

  const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  if (loading) {
    return <div className="animate-pulse space-y-6"><div className="h-32 bg-muted rounded-xl" /><div className="h-96 bg-muted rounded-xl" /></div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your financial overview</p>
        </div>
        <AddTransactionDialog onSuccess={fetchTransactions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Balance" value={formatCurrency(totalBalance)} icon={<Wallet className="w-6 h-6" />} delay={0} />
        <StatCard title="Monthly Income" value={formatCurrency(totalIncome)} icon={<TrendingUp className="w-6 h-6" />} variant="income" delay={0.1} />
        <StatCard title="Monthly Expenses" value={formatCurrency(totalExpenses)} icon={<TrendingDown className="w-6 h-6" />} variant="expense" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceChart transactions={transactions} />
        <ExpensesPieChart transactions={transactions} />
      </div>

      <RecentTransactions transactions={transactions} />
    </div>
  );
}
