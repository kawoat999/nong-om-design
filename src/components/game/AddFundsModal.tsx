import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
    goalName: string;
    availableBalance: number;
}

export function AddFundsModal({ isOpen, onClose, onConfirm, goalName, availableBalance }: AddFundsModalProps) {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseFloat(amount);

        if (isNaN(value) || value <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (value > availableBalance) {
            setError(`Insufficient funds. You only have ฿${availableBalance.toLocaleString()}`);
            return;
        }

        onConfirm(value);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Wallet className="w-6 h-6 text-yellow-400" />
                            Add Funds
                        </h3>
                        <button onClick={onClose} className="text-white/60 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="text-white/80 text-sm mb-1">Goal: <span className="font-semibold text-white">{goalName}</span></p>
                        <p className="text-white/60 text-xs">Available Savings: <span className="text-emerald-400 font-medium">฿{availableBalance.toLocaleString()}</span></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-white/70 text-sm block mb-2">Amount to Add (฿)</label>
                            <input
                                type="number"
                                autoFocus
                                className={cn(
                                    "w-full bg-white/10 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary text-lg font-medium placeholder:text-white/30",
                                    error ? "border-red-400 focus:ring-red-400" : "border-white/20"
                                )}
                                value={amount}
                                onChange={e => {
                                    setAmount(e.target.value);
                                    setError('');
                                }}
                                placeholder="0.00"
                            />
                            {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="button" onClick={onClose} variant="outline" className="flex-1 h-12 rounded-xl border-white/20 text-white hover:bg-white/10 bg-transparent">
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold shadow-lg">
                                Confirm
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
