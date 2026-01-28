import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CalendarDays,
  Search,
  X,
  Utensils,
  Car,
  Film,
  Pill,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Package,
  Loader2,
  Pencil,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatThaiTime, formatThaiDateShort, formatThaiDateISO, isThaiToday } from '@/lib/thaiTime';
import { transactionService, Transaction } from '@/services/transactionService';
import { AddExpenseModal } from '@/components/game/AddExpenseModal';
import { useToast } from '@/hooks/use-toast';

const CATEGORY_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  food: { icon: Utensils, color: 'text-orange-500 bg-orange-100', label: 'Food' },
  transport: { icon: Car, color: 'text-blue-500 bg-blue-100', label: 'Transport' },
  entertainment: { icon: Film, color: 'text-pink-500 bg-pink-100', label: 'Fun' },
  healthcare: { icon: Pill, color: 'text-emerald-500 bg-emerald-100', label: 'Health' },
  utilities: { icon: Receipt, color: 'text-indigo-500 bg-indigo-100', label: 'Bills' },
  shopping: { icon: ShoppingCart, color: 'text-violet-500 bg-violet-100', label: 'Shopping' },
  investment: { icon: TrendingUp, color: 'text-teal-500 bg-teal-100', label: 'Invest' },
  other: { icon: Package, color: 'text-gray-500 bg-gray-100', label: 'Other' },
};

// Get current month name dynamically
const getCurrentMonth = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export default function Transactions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentMonth] = useState(getCurrentMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    const data = await transactionService.fetchTransactions();
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEditSuccess = () => {
    fetchTransactions();
    setEditingTransaction(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    const success = await transactionService.deleteTransaction(id);
    if (success) {
      toast({ title: 'Deleted', description: 'Transaction deleted successfully' });
      fetchTransactions();
    } else {
      toast({ title: 'Error', description: 'Failed to delete transaction', variant: 'destructive' });
    }
  };

  // Filter transactions based on search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const query = searchQuery.toLowerCase();
    return transactions.filter(t =>
      t.note.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.amount.toString().includes(query)
    );
  }, [transactions, searchQuery]);

  const totalExpense = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-card sticky top-0 z-10 border-b shadow-sm pt-safe-top transition-colors duration-300">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-muted-foreground" />
          </Button>

          {isSearchOpen ? (
            <div className="flex-1 mx-2 relative">
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h1 className="text-lg font-bold">Transaction History</h1>
          )}

          {!isSearchOpen && (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="w-6 h-6 text-muted-foreground" />
            </Button>
          )}
        </div>

        {/* Month Display & Summary */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-full px-4 py-1.5 text-sm font-medium border border-border bg-muted/30 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              {currentMonth}
            </div>
            {searchQuery && (
              <span className="text-xs text-muted-foreground ml-auto">
                {filteredTransactions.length} results
              </span>
            )}
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/10">
            <p className="text-sm text-muted-foreground mb-1">
              {searchQuery ? 'Filtered total' : 'Total this month'}
            </p>
            <p className="text-3xl font-bold text-primary">
              {loading ? '...' : `฿${totalExpense.toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-4 space-y-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        ) : (
          <>
            {/* Today */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 ml-1">Today</h3>
              <div className="space-y-3">
                {filteredTransactions.filter(t => isThaiToday(t.date)).map((transaction, index) => (
                  <TransactionItem key={transaction.id} transaction={transaction} index={index} onEdit={() => setEditingTransaction(transaction)} onDelete={() => handleDelete(transaction.id)} />
                ))}
                {filteredTransactions.filter(t => isThaiToday(t.date)).length === 0 && (
                  <p className="text-sm text-muted-foreground italic ml-2">No transactions today</p>
                )}
              </div>
            </div>

            {/* All transactions (Simplified for demo) */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 ml-1 mt-6">History</h3>
              <div className="space-y-3">
                {filteredTransactions.filter(t => !isThaiToday(t.date)).map((transaction, index) => (
                  <TransactionItem key={transaction.id} transaction={transaction} index={index} onEdit={() => setEditingTransaction(transaction)} onDelete={() => handleDelete(transaction.id)} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <AddExpenseModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        initialData={editingTransaction ? {
          date: new Date(editingTransaction.date),
          itemName: editingTransaction.note,
          category: editingTransaction.category,
          type: 'expense',
          amount: editingTransaction.amount,
          notes: '',
          id: editingTransaction.id
        } : undefined}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

function TransactionItem({ transaction, index, onEdit, onDelete }: { transaction: any, index: number, onEdit: () => void, onDelete: () => void }) {
  const config = CATEGORY_CONFIG[transaction.category] || CATEGORY_CONFIG.other;
  const Icon = config.icon;
  const transactionDate = transaction.date;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="p-3 flex items-center gap-4 hover:bg-accent/50 transition-colors border-none shadow-sm bg-card relative group cursor-pointer" onClick={onEdit}>
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", config.color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-0.5">
            <div className="flex items-center gap-1 min-w-0 pr-2">
              <h4 className="font-semibold text-foreground truncate">{transaction.note}</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded-full shrink-0"
              >
                <Pencil className="w-3 h-3 text-muted-foreground" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded-full shrink-0"
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </button>
            </div>
            <span className="font-bold text-foreground shrink-0">-฿{transaction.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="bg-muted px-2 py-0.5 rounded-full text-foreground/80">{config.label}</span>
            <span>{formatThaiTime(transactionDate)} • {formatThaiDateShort(transactionDate)}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
