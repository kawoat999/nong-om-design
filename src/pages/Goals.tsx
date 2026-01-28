import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Target,
  Plus,
  Car,
  Plane,
  CreditCard,
  Home,
  Gift,
  Loader2,
  Package,
  Smartphone,
  GraduationCap,
  Briefcase,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { goalService, Goal } from '@/services/goalService';
import { AddGoalModal } from '@/components/game/AddGoalModal';
import { AddFundsModal } from '@/components/game/AddFundsModal';
import { budgetService } from '@/services/budgetService';
import { transactionService } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';

const ICON_MAP: Record<string, any> = {
  Car, Plane, CreditCard, Home, Gift, Package, Smartphone, GraduationCap, Briefcase
};

export default function Goals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [financials, setFinancials] = useState({ budget: 0, spent: 0 });
  const [isFundsModalOpen, setIsFundsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [goalsData, budgetData, transactionsData] = await Promise.all([
        goalService.fetchGoals(),
        budgetService.fetchBudget(),
        transactionService.fetchTransactions()
      ]);

      setGoals(goalsData);

      const totalBudget = budgetData?.total || 0;
      const totalSpent = transactionsData.reduce((acc, curr) => acc + curr.amount, 0);
      setFinancials({ budget: totalBudget, spent: totalSpent });

    } catch (error) {
      console.error("Failed to fetch goals data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoalAdded = () => {
    fetchData();
  };

  const handleAddFunds = (goal: Goal) => {
    const remaining = financials.budget - financials.spent;

    if (remaining <= 0) {
      toast({
        title: 'Insufficient Funds',
        description: "You don't have enough savings (Remaining Budget is 0 or less) to add funds.",
        variant: 'destructive',
      });
      return;
    }

    setSelectedGoal(goal);
    setIsFundsModalOpen(true);
  };

  const handleConfirmAddFunds = async (amount: number) => {
    if (!selectedGoal) return;

    const success = await goalService.updateGoal(selectedGoal.id, selectedGoal.current + amount);
    if (success) {
      fetchData();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const { toast } = useToast();

  const handleDeleteGoal = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete goal "${name}"?`)) return;

    const success = await goalService.deleteGoal(id);
    if (success) {
      toast({ title: 'Deleted', description: `Goal "${name}" deleted successfully` });
      fetchData();
    } else {
      toast({ title: 'Error', description: 'Failed to delete goal', variant: 'destructive' });
    }
  };

  const totalSaved = goals.reduce((acc, curr) => acc + curr.current, 0);
  const totalTarget = goals.reduce((acc, curr) => acc + curr.target, 0);
  const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pb-20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-card sticky top-0 z-10 border-b shadow-sm pt-safe-top transition-colors duration-300">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-muted-foreground" />
          </Button>
          <h1 className="text-lg font-bold">Financial Goals</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-6 h-6 text-primary" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          </div>
        ) : (
          <>
            {/* Total Summary */}
            <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
              <div className="flex items-center gap-3 mb-4 opacity-90">
                <Target className="w-6 h-6" />
                <span className="text-lg font-medium">Total Savings</span>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold">฿{totalSaved.toLocaleString()}</span>
                <span className="text-white/70">/ {totalTarget.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/80">
                  <span>Overall Progress</span>
                  <span>{totalProgress.toFixed(1)}%</span>
                </div>
                <Progress value={totalProgress} className="h-2 bg-black/20" indicatorClassName="bg-white/90" />
              </div>
            </Card>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goals.map((goal, index) => {
                const percentage = (goal.current / goal.target) * 100;
                const Icon = ICON_MAP[goal.icon] || Package;

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg ${goal.color || 'bg-gray-500'} bg-opacity-10 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-foreground`} />
                        </div>
                        <div className="bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold text-gray-600">
                          {percentage.toFixed(0)}%
                        </div>
                      </div>

                      <h3 className="font-bold text-foreground mb-1">{goal.name}</h3>
                      <div className="text-xs text-muted-foreground mb-3 flex justify-between">
                        <span className="font-medium text-primary">฿{goal.current.toLocaleString()}</span>
                        <span>of ฿{goal.target.toLocaleString()}</span>
                      </div>

                      <Progress value={percentage} className="h-1.5" indicatorClassName={goal.color} />

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8 bg-amber-500 hover:bg-amber-600 text-white border-none"
                          onClick={() => handleAddFunds(goal)}
                        >
                          Add Funds
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 border-destructive/50 hover:bg-destructive/10 text-destructive"
                          onClick={() => handleDeleteGoal(goal.id, goal.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}

              {/* Add New Goal Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: goals.length * 0.1 }}
              >
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full h-full min-h-[160px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-white">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">Create New Goal</span>
                </button>
              </motion.div>
            </div>
          </>
        )}
      </div>

      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleGoalAdded}
      />

      <AddFundsModal
        isOpen={isFundsModalOpen}
        onClose={() => setIsFundsModalOpen(false)}
        onConfirm={handleConfirmAddFunds}
        goalName={selectedGoal?.name || ''}
        availableBalance={financials.budget - financials.spent}
      />
    </div>
  );
}
