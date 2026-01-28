import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Wallet,
  Save,
  RotateCcw,
  Utensils,
  Car,
  Film,
  Pill,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from "@/components/ui/use-toast";
import { useSheetSync } from '@/hooks/useSheetSync';

// Config (Shared)
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

const DEFAULT_BUDGET = 0;
const DEFAULT_ALLOCATION = {
  food: 0,
  transport: 0,
  entertainment: 0,
  healthcare: 0,
  utilities: 0,
  shopping: 0,
  investment: 0,
  other: 0,
};

export default function Budget() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [totalBudget, setTotalBudget] = useState(DEFAULT_BUDGET);
  const [allocations, setAllocations] = useState(DEFAULT_ALLOCATION);
  const [hasChanges, setHasChanges] = useState(false);

  // Track first load to suppress initial toast
  const isFirstLoad = useRef(true);

  // Google Sheets Sync
  const { loading, lastSynced, refresh, saveToSheet } = useSheetSync(
    DEFAULT_BUDGET,
    DEFAULT_ALLOCATION,
    (newData) => {
      // Callback when data is fetched from Sheets
      setTotalBudget(newData.total);

      // Merge with DEFAULT to ensure all keys exist
      const sanitizedAllocations = { ...DEFAULT_ALLOCATION, ...newData.allocations };
      // Ensure all values are numbers (in case of empty strings or nulls from JSON)
      Object.keys(sanitizedAllocations).forEach(key => {
        const k = key as keyof typeof DEFAULT_ALLOCATION;
        sanitizedAllocations[k] = Number(sanitizedAllocations[k]) || 0;
      });

      setAllocations(sanitizedAllocations);

      // Only show toast if NOT the first load
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return;
      }

      toast({
        title: "Data Synced",
        description: "Budget updated from Google Sheets",
      });
    }
  );

  const currentTotal = Object.values(allocations).reduce((a, b) => a + b, 0);
  const remaining = totalBudget - currentTotal;
  const isOverBudget = remaining < 0;

  useEffect(() => {
    // Determine if unsaved changes exist (simplified)
    // setHasChanges(true); 
  }, [totalBudget, allocations]);

  const handleAllocationChange = (key: string, value: number[]) => {
    setAllocations(prev => ({ ...prev, [key]: value[0] }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveToSheet(totalBudget, allocations);
    setHasChanges(false);
  };

  const handleReset = () => {
    setTotalBudget(DEFAULT_BUDGET);
    setAllocations(DEFAULT_ALLOCATION);
    toast({
      title: "Reset to Default",
      description: "Budget restored to original settings.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="bg-card sticky top-0 z-10 border-b shadow-sm pt-safe-top transition-colors duration-300">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-muted-foreground" />
          </Button>
          <h1 className="text-lg font-bold">Budget Settings</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-full border border-border">
              <RefreshCw className={`w-3 h-3 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
              <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                {loading ? 'Syncing...' : 'Manual Sync'}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => refresh()}>
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Total Budget Card */}
        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none shadow-lg">
          <div className="flex items-center gap-3 mb-2 opacity-80">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium">Monthly Budget</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold mb-1">฿</span>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => {
                setTotalBudget(Number(e.target.value));
                setHasChanges(true);
              }}
              className="bg-transparent border-b-2 border-white/30 text-4xl font-bold w-full focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
            <span className="opacity-80">Unallocated</span>
            <span className={`font-bold ${isOverBudget ? 'text-red-300' : 'text-emerald-300'}`}>
              {remaining >= 0 ? '+' : ''}฿{remaining.toLocaleString()}
            </span>
          </div>
        </Card>

        {/* Warning Banner */}
        {isOverBudget && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>You have exceeded your total budget by ฿{Math.abs(remaining).toLocaleString()}</span>
          </motion.div>
        )}

        {/* Category Allocations */}
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground">Category Allocation</h2>
          {Object.entries(CATEGORY_CONFIG).map(([key, config], index) => {
            const amount = allocations[key as keyof typeof allocations];
            const percentage = totalBudget > 0 ? (amount / totalBudget) * 100 : 0;
            const Icon = config.icon;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 border-none shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color.replace('text-', 'bg-opacity-20 ')}`}>
                        <Icon className={`w-5 h-5 ${config.color.split(' ')[0]}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{config.label}</p>
                        <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm text-muted-foreground">฿</span>
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => handleAllocationChange(key, [Number(e.target.value)])}
                          className="w-20 h-8 text-right font-bold p-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Slider
                    value={[amount]}
                    max={totalBudget}
                    step={100}
                    onValueChange={(val) => handleAllocationChange(key, val)}
                    className="py-2"
                  />
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-card border-t safe-bottom z-10"
      >
        <Button
          onClick={handleSave}
          className="w-full h-12 text-lg shadow-lg gap-2"
          disabled={isOverBudget || loading}
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saving to Sheets...' : 'Save Changes'}
        </Button>
      </motion.div>
    </div>
  );
}
