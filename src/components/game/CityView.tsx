import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Utensils, Car, Film, Pill, Receipt, ShoppingCart, TrendingUp, Package,
    LucideIcon
} from 'lucide-react';

// Category configuration
const categories: Array<{
    key: string;
    label: string;
    icon: LucideIcon;
    color: string;
}> = [
        { key: 'food', label: 'Food', icon: Utensils, color: '#F97316' },
        { key: 'transport', label: 'Transport', icon: Car, color: '#3B82F6' },
        { key: 'entertainment', label: 'Fun', icon: Film, color: '#EC4899' },
        { key: 'healthcare', label: 'Health', icon: Pill, color: '#10B981' },
        { key: 'utilities', label: 'Bills', icon: Receipt, color: '#6366F1' },
        { key: 'shopping', label: 'Shop', icon: ShoppingCart, color: '#8B5CF6' },
        { key: 'investment', label: 'Invest', icon: TrendingUp, color: '#14B8A6' },
        { key: 'other', label: 'Other', icon: Package, color: '#6B7280' },
    ];

const defaultBudgets: Record<string, number> = {
    food: 0, transport: 0, entertainment: 0, healthcare: 0,
    utilities: 0, shopping: 0, investment: 0, other: 0,
};

interface CategorySpending { [key: string]: number; }
interface CityViewProps {
    spending?: CategorySpending;
    budgets?: Record<string, number>;
}

export function CityView({ spending: externalSpending, budgets = defaultBudgets }: CityViewProps) {
    const [spending, setSpending] = useState<CategorySpending>(externalSpending || {
        food: 0, transport: 0, entertainment: 0, healthcare: 0,
        utilities: 0, shopping: 0, investment: 0, other: 0,
    });

    useEffect(() => {
        if (externalSpending) setSpending(externalSpending);
    }, [externalSpending]);

    const formatAmount = (num: number) => num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();

    return (
        <div className="w-full h-full flex flex-col justify-end">
            {/* Chart Area */}
            <div className="w-full max-w-4xl mx-auto flex flex-col">
                {/* Bars Row */}
                <div className="flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-8 h-[240px] sm:h-[300px] mt-4">
                    {categories.map((cat, index) => {
                        const amount = spending[cat.key] || 0;
                        const budget = budgets[cat.key] || 1000;
                        const percentage = budget > 0 ? Math.min((amount / budget) * 100, 150) : 0;
                        const minHeight = 60; // Increased min height
                        const maxHeight = typeof window !== 'undefined' && window.innerWidth < 640 ? 180 : 260; // Increased max height
                        const height = minHeight + (percentage / 150) * (maxHeight - minHeight);
                        const isOverBudget = percentage > 100;
                        const isWarning = percentage > 80 && percentage <= 100;
                        const Icon = cat.icon;

                        return (
                            <div key={cat.key} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                {/* Amount Popup on Hover */}
                                <motion.div
                                    className="absolute left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-bold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none"
                                    style={{ bottom: height + 10 }}
                                >
                                    ฿{amount.toLocaleString()}
                                </motion.div>

                                {/* Bar */}
                                <motion.div
                                    className="relative w-full max-w-[40px] sm:max-w-[50px] rounded-t-lg overflow-hidden flex items-end justify-center shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:brightness-110"
                                    style={{
                                        backgroundColor: cat.color,
                                        boxShadow: `0 0 15px ${cat.color}30`,
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ height }}
                                    transition={{ type: "spring", stiffness: 80, damping: 15, delay: index * 0.05 }}
                                >
                                    {/* Glossy Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent" />

                                    {/* Icon Container */}
                                    <div className="relative z-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/10 flex items-center justify-center mb-2">
                                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white drop-shadow-md" />
                                    </div>

                                    {/* Warning Indicator */}
                                    {isOverBudget && (
                                        <motion.div
                                            className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        />
                                    )}
                                </motion.div>
                            </div>
                        );
                    })}
                </div>

                {/* The Line */}
                <div className="h-0.5 w-full bg-slate-800/20 dark:bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] relative z-0">
                    <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-transparent via-slate-800/40 dark:via-white/40 to-transparent" />
                </div>

                {/* Labels Row */}
                <div className="flex items-start justify-between gap-2 sm:gap-3 px-2 sm:px-6 pt-3">
                    {categories.map((cat) => {
                        const amount = spending[cat.key] || 0;
                        const budget = budgets[cat.key] || 1000;
                        const percentage = budget > 0 ? (amount / budget) * 100 : 0;
                        const isOverBudget = percentage > 100;

                        return (
                            <div key={cat.key} className="flex-1 flex flex-col items-center">
                                <span className="text-[10px] sm:text-xs text-slate-700 dark:text-white/80 font-medium truncate w-full text-center">
                                    {cat.label}
                                </span>
                                <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${isOverBudget ? 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-500/10' : 'text-slate-500 dark:text-white/50'
                                    }`}>
                                    {percentage.toFixed(0)}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Ground Line REMOVED */}

            {/* Legend - Responsive */}
            <div className="flex justify-center gap-3 sm:gap-6 py-2 sm:py-3 bg-white/40 dark:bg-black/20 rounded-t-xl backdrop-blur-sm">
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-700 dark:text-white/70">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-400 dark:bg-white/30" />
                    <span>Normal</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-700 dark:text-white/70">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                    <span>Near Budget</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-700 dark:text-white/70">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                    <span>Over Budget</span>
                </div>
            </div>
        </div>
    );
}
