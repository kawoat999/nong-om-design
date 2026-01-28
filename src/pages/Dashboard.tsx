import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, Wallet, Loader2, Cloud, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CityView } from '@/components/game/CityView';
import { AddExpenseModal } from '@/components/game/AddExpenseModal';
import { budgetService } from '@/services/budgetService';
import { transactionService } from '@/services/transactionService';

interface CategorySpending { [key: string]: number; }

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spending, setSpending] = useState<CategorySpending>({});
  const [budgetAllocations, setBudgetAllocations] = useState<Record<string, number>>({});
  const [totalBudget, setTotalBudget] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Budget
      const budgetData = await budgetService.fetchBudget();
      if (budgetData) {
        setTotalBudget(budgetData.total);
        setBudgetAllocations(budgetData.allocations);
      }

      // 2. Fetch Transactions & Calculate Spending
      const transactions = await transactionService.fetchTransactions();
      const newSpending: CategorySpending = {};

      transactions.forEach(t => {
        const cat = t.category.toLowerCase();
        newSpending[cat] = (newSpending[cat] || 0) + t.amount;
      });
      setSpending(newSpending);

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransactionSuccess = async (transaction: { category: string; amount: number }) => {
    // Optimistic Update
    setSpending(prev => ({
      ...prev,
      [transaction.category]: (prev[transaction.category] || 0) + transaction.amount,
    }));
    // Re-fetch to be sure
    await fetchData();
  };

  const totalSpending = Object.values(spending).reduce((a, b) => a + b, 0);
  const remaining = totalBudget - totalSpending;
  const percentage = totalBudget > 0 ? (totalSpending / totalBudget) * 100 : 0;

  return (
    <div
      className="h-full flex flex-col overflow-hidden transition-all duration-500 relative bg-gradient-to-b from-sky-400 via-sky-200 to-white dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460]"
    >
      {/* Light Mode Sky Elements */}
      {/* Light Mode Sky Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none dark:hidden z-0">
        {/* Sun */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-[28%] left-[-20px] w-32 h-32 bg-yellow-300 rounded-full blur-2xl opacity-60"
        />
        <Sun className="absolute top-[32%] left-6 w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse-slow" />

        {/* Clouds */}
        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-[35%] right-10 text-white/80"
        >
          <Cloud className="w-16 h-16 fill-white" />
        </motion.div>

        <motion.div
          animate={{ x: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] left-1/3 text-white/60"
        >
          <Cloud className="w-12 h-12 fill-white" />
        </motion.div>

        {/* Birds */}
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: "100vw" }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-[30%] flex gap-2 opacity-60"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600 w-4 h-4 transform -scale-x-100">
            <path d="M2 12s4-2 9-2 9 2 9 2" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600 w-3 h-3 mt-2 transform -scale-x-100">
            <path d="M2 12s4-2 9-2 9 2 9 2" />
          </svg>
        </motion.div>
      </div>

      {/* Dark Mode Sky Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block z-0">
        {/* Stars */}
        {[...Array(120)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, scale: 0.5 }}
            animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.5, 1, 0.5] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-white shadow-[0_0_1px_#fff]"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 0.5 + 'px',
              height: Math.random() * 2 + 0.5 + 'px',
            }}
          />
        ))}
        {/* Realistic Moon */}
        <div className="absolute top-[38%] left-4">
          {/* Outer Glow */}
          <div className="absolute -inset-8 bg-gradient-radial from-white/10 via-white/5 to-transparent rounded-full blur-2xl" />

          {/* Main Moon Body */}
          <div
            className="relative w-20 h-20 rounded-full overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #f5f5f0 0%, #d4d4cc 30%, #b8b8b0 60%, #9a9a92 100%)',
              boxShadow: '0 0 40px rgba(255,255,255,0.2), 0 0 80px rgba(255,255,255,0.1), inset -8px -8px 20px rgba(0,0,0,0.3), inset 3px 3px 10px rgba(255,255,255,0.4)'
            }}
          >
            {/* Terminator Shadow (dark edge) */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(120deg, transparent 40%, rgba(30,30,40,0.6) 80%, rgba(20,20,30,0.8) 100%)'
              }}
            />

            {/* Large Craters (Mare) */}
            <div className="absolute top-[15%] left-[20%] w-6 h-6 rounded-full bg-gradient-radial from-[#9a9a8a] to-transparent opacity-60" />
            <div className="absolute top-[35%] left-[45%] w-8 h-7 rounded-full bg-gradient-radial from-[#8a8a7a] to-transparent opacity-50" />
            <div className="absolute top-[55%] left-[25%] w-5 h-5 rounded-full bg-gradient-radial from-[#8a8a78] to-transparent opacity-55" />

            {/* Small Craters */}
            <div className="absolute top-[20%] right-[25%] w-3 h-3 rounded-full bg-[#b0b0a0] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4),inset_-0.5px_-0.5px_1px_rgba(255,255,255,0.3)]" />
            <div className="absolute top-[45%] left-[15%] w-2 h-2 rounded-full bg-[#a8a8a0] shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.4)]" />
            <div className="absolute bottom-[25%] right-[35%] w-2.5 h-2.5 rounded-full bg-[#a5a598] shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.35)]" />
            <div className="absolute top-[60%] right-[20%] w-1.5 h-1.5 rounded-full bg-[#b5b5a8] shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.3)]" />
            <div className="absolute bottom-[35%] left-[40%] w-2 h-2 rounded-full bg-[#a0a090] shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.35)]" />
            <div className="absolute top-[30%] left-[60%] w-1 h-1 rounded-full bg-[#aaaaaa] shadow-[inset_0.3px_0.3px_0.5px_rgba(0,0,0,0.4)]" />

            {/* Highlight Rim */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%)'
              }}
            />
          </div>

          {/* Atmospheric Halo */}
          <div className="absolute -inset-4 rounded-full border border-white/5" />
          <div className="absolute -inset-2 rounded-full bg-gradient-radial from-white/5 to-transparent" />
        </div>
      </div>
      {/* Header - Responsive padding */}
      <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        {/* Title - Responsive size */}
        <div className="text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-white drop-shadow-sm">
            Your Financial City
          </h1>
        </div>

        {/* Stats Cards - Responsive grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-2">
          {/* Budget */}
          <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center shadow-lg border border-white/20 dark:border-white/5 transition-colors">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-300 mx-auto mb-1 sm:mb-2" />
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-purple-200/80 uppercase tracking-wider font-medium">Monthly Budget</p>
            <p className="text-sm sm:text-lg md:text-xl font-bold text-slate-800 dark:text-white mt-0.5">
              {loading ? '...' : `฿${totalBudget.toLocaleString()}`}
            </p>
          </div>
          {/* Spent */}
          <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center shadow-lg border border-white/20 dark:border-white/5 transition-colors">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 dark:text-red-300 mx-auto mb-1 sm:mb-2" />
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-red-200/80 uppercase tracking-wider font-medium">Spent</p>
            <p className="text-sm sm:text-lg md:text-xl font-bold text-red-600 dark:text-red-100 mt-0.5">
              {loading ? '...' : `฿${totalSpending.toLocaleString()}`}
            </p>
          </div>
          {/* Remaining */}
          <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center shadow-lg border border-white/20 dark:border-white/5 transition-colors">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-300 mx-auto mb-1 sm:mb-2" />
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-emerald-200/80 uppercase tracking-wider font-medium">Remaining</p>
            <p className="text-sm sm:text-lg md:text-xl font-bold text-emerald-600 dark:text-emerald-100 mt-0.5">
              {loading ? '...' : `฿${remaining.toLocaleString()}`}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full",
                percentage > 100 ? "bg-red-500" : percentage > 80 ? "bg-yellow-500" : "bg-green-500"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="text-[10px] sm:text-xs text-slate-600 dark:text-white/50 text-center mt-0.5 sm:mt-1 font-medium">
            Spent {percentage.toFixed(0)}% of total budget
          </p>
        </div>
      </div>

      {/* City View */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        )}
        <CityView spending={spending} budgets={budgetAllocations} />
      </div>

      {/* FAB - Responsive size and position */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.3 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40"
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-full",
            "bg-gradient-to-r from-yellow-400 to-orange-500",
            "hover:from-yellow-500 hover:to-orange-600",
            "shadow-xl hover:shadow-2xl",
            "transition-all duration-300 hover:scale-110"
          )}
        >
          <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </Button>
      </motion.div>

      {/* Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
}
