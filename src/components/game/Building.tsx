import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuildingProps {
    category: string;
    label: string;
    icon: LucideIcon;
    color: string;
    amount: number;
    budget: number;
    index: number;
}

export function Building({ category, label, icon: Icon, color, amount, budget, index }: BuildingProps) {
    // Calculate percentage (capped at 150% for visual purposes)
    const percentage = budget > 0 ? Math.min((amount / budget) * 100, 150) : 0;

    // Map percentage to height (40px min, 220px max) - ENLARGED
    const minHeight = 40;
    const maxHeight = 220;
    const height = minHeight + (percentage / 150) * (maxHeight - minHeight);

    // Determine building state
    const isOverBudget = percentage > 100;
    const isWarning = percentage > 80 && percentage <= 100;

    const formatAmount = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        }
        return num.toString();
    };

    return (
        <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
        >
            {/* Amount Label */}
            <motion.span
                className="text-sm font-bold text-white drop-shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.08 + 0.3 }}
            >
                ฿{formatAmount(amount)}
            </motion.span>

            {/* Building */}
            <div className="relative flex flex-col items-center">
                {/* Over budget warning */}
                {isOverBudget && (
                    <motion.div
                        className="absolute -top-4 text-xl z-20"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        ⚠️
                    </motion.div>
                )}

                {/* Building Structure - ENLARGED */}
                <motion.div
                    className={cn(
                        "relative rounded-t-xl overflow-hidden",
                        "flex flex-col items-center justify-end",
                        "shadow-2xl"
                    )}
                    style={{
                        width: '56px',
                        backgroundColor: color,
                        boxShadow: `0 8px 32px ${color}50`,
                    }}
                    initial={{ height: minHeight }}
                    animate={{ height }}
                    transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 12,
                        delay: index * 0.08
                    }}
                >
                    {/* Windows Pattern - LARGER */}
                    <div className="absolute inset-0 flex flex-col justify-end p-2 gap-2">
                        {Array.from({ length: Math.floor(height / 28) }).map((_, i) => (
                            <div key={i} className="flex gap-2 justify-center">
                                <motion.div
                                    className="w-3 h-3 rounded-sm bg-white/40"
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                />
                                <motion.div
                                    className="w-3 h-3 rounded-sm bg-white/40"
                                    animate={{ opacity: [0.6, 0.3, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 + 0.5 }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Icon at bottom - LARGER */}
                    <div
                        className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center mb-2 shadow-lg"
                        style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
                    >
                        <Icon className="w-5 h-5 text-white drop-shadow" />
                    </div>
                </motion.div>

                {/* Building Base - LARGER */}
                <div
                    className="w-16 h-3 rounded-b-md"
                    style={{ backgroundColor: color, filter: 'brightness(0.65)' }}
                />
            </div>

            {/* Category Label - LARGER */}
            <span className="text-xs font-medium text-white/80 text-center leading-tight mt-1">
                {label}
            </span>

            {/* Percentage Badge - LARGER */}
            <span
                className={cn(
                    "text-xs font-bold px-2.5 py-1 rounded-full shadow-md",
                    isOverBudget ? "bg-red-500 text-white" :
                        isWarning ? "bg-yellow-500 text-white" :
                            "bg-white/25 text-white"
                )}
            >
                {percentage.toFixed(0)}%
            </span>
        </motion.div>
    );
}
