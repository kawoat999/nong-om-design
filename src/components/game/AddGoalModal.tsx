
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, Target, Car, Plane, CreditCard, Home, Gift, Package, Smartphone, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { goalService, Goal } from '@/services/goalService';
import { cn } from '@/lib/utils';

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ICONS = [
    { name: 'Target', icon: Target },
    { name: 'Car', icon: Car },
    { name: 'Plane', icon: Plane },
    { name: 'CreditCard', icon: CreditCard },
    { name: 'Home', icon: Home },
    { name: 'Gift', icon: Gift },
    { name: 'Package', icon: Package },
    { name: 'Smartphone', icon: Smartphone },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'Briefcase', icon: Briefcase },
];

const COLORS = [
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
];

export function AddGoalModal({ isOpen, onClose, onSuccess }: AddGoalModalProps) {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Target');
    const [selectedColor, setSelectedColor] = useState('bg-blue-500');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const newGoal = {
            name,
            target: parseFloat(target),
            icon: selectedIcon,
            color: selectedColor,
        };

        const result = await goalService.addGoal(newGoal);

        setIsLoading(false);
        if (result) {
            onSuccess();
            onClose();
            // Reset form
            setName('');
            setTarget('');
            setSelectedIcon('Target');
            setSelectedColor('bg-blue-500');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-md bg-card rounded-2xl p-6 shadow-xl border border-border"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-foreground">Create New Goal</h2>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Goal Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., New Car, Japan Trip"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Target Amount (฿)</label>
                            <Input
                                type="number"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                placeholder="0.00"
                                required
                                min="1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Select Icon</label>
                            <div className="grid grid-cols-5 gap-2">
                                {ICONS.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.name}
                                            type="button"
                                            onClick={() => setSelectedIcon(item.name)}
                                            className={cn(
                                                "p-2 rounded-lg flex items-center justify-center transition-colors hover:bg-accent",
                                                selectedIcon === item.name ? "bg-primary/10 text-primary ring-2 ring-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Select Color</label>
                            <div className="flex flex-wrap gap-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        className={cn(
                                            "w-8 h-8 rounded-full transition-transform hover:scale-110",
                                            color,
                                            selectedColor === color ? "ring-2 ring-offset-2 ring-foreground/40" : ""
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg mt-4">
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating...
                                </>
                            ) : (
                                'Create Goal'
                            )}
                        </Button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
