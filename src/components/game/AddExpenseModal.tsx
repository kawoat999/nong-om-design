import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, FileUp, X, Sparkles, CheckCircle2, XCircle, RefreshCw,
    CalendarDays, FileText, Tag, ArrowDownCircle, ArrowUpCircle,
    Utensils, Car, Film, Pill, Receipt, ShoppingCart, TrendingUp, Package,
    LucideIcon, Loader2, CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { transactionService } from '@/services/transactionService';
import { toThaiISOString } from '@/lib/thaiTime';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Category configuration
const categoryConfig: Record<string, { icon: LucideIcon; color: string; label: string }> = {
    food: { icon: Utensils, color: '#F97316', label: 'Food' },
    transport: { icon: Car, color: '#3B82F6', label: 'Transport' },
    entertainment: { icon: Film, color: '#EC4899', label: 'Fun' },
    healthcare: { icon: Pill, color: '#10B981', label: 'Health' },
    utilities: { icon: Receipt, color: '#6366F1', label: 'Bills' },
    shopping: { icon: ShoppingCart, color: '#8B5CF6', label: 'Shop' },
    investment: { icon: TrendingUp, color: '#14B8A6', label: 'Invest' },
    other: { icon: Package, color: '#6B7280', label: 'Other' },
};

interface TransactionResult {
    date: Date;
    itemName: string;
    category: string;
    type: 'income' | 'expense';
    amount: number;
    notes?: string;
}

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (transaction: TransactionResult) => void;
    initialData?: TransactionResult & { id?: string };
}

export function AddExpenseModal({ isOpen, onClose, onSuccess, initialData }: AddExpenseModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [viewState, setViewState] = useState<'upload' | 'manual' | 'success' | 'error'>(initialData ? 'manual' : 'upload');
    const [savedTransaction, setSavedTransaction] = useState<TransactionResult | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Manual Form State
    const [manualForm, setManualForm] = useState({
        amount: initialData ? initialData.amount.toString() : '',
        itemName: initialData ? initialData.itemName : '',
        category: initialData ? initialData.category : 'food',
        date: initialData ? format(initialData.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setViewState('manual');
                setManualForm({
                    amount: initialData.amount.toString(),
                    itemName: initialData.itemName,
                    category: initialData.category,
                    date: format(initialData.date, 'yyyy-MM-dd')
                });
            } else {
                setViewState('upload');
                setManualForm({
                    amount: '',
                    itemName: '',
                    category: 'food',
                    date: format(new Date(), 'yyyy-MM-dd')
                });
            }
        }
    }, [isOpen, initialData]);

    const handleOpenCamera = () => {
        if (cameraInputRef.current) cameraInputRef.current.value = '';
        cameraInputRef.current?.click();
    };

    const handleOpenFile = () => {
        if (fileInputRef.current) fileInputRef.current.value = '';
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            if (file.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    const mapCategory = (category: string): string => {
        const categoryMap: Record<string, string> = {
            'อาหาร': 'food',
            'เดินทาง': 'transport',
            'บันเทิง': 'entertainment',
            'สุขภาพ': 'healthcare',
            'ค่าบิล': 'utilities',
            'ของใช้': 'shopping',
            'ลงทุน': 'investment',
            'อื่นๆ': 'other',
        };
        return categoryMap[category] || category.toLowerCase() || 'other';
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setIsLoading(true);

        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(selectedFile);
            });

            const response = await fetch('https://kawoat9.app.n8n.cloud/webhook/6aa89004-c110-48c0-b52a-38c98fbe0224', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body: { image: base64 } }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const text = await response.text();
            if (!text || !text.trim()) throw new Error('Server ไม่ได้ส่งข้อมูลกลับมา');

            const data = JSON.parse(text);
            const result: TransactionResult = {
                date: data['วันที่'] ? new Date(data['วันที่']) : new Date(),
                itemName: data['ชื่อ'] || data.item || 'ไม่ระบุ',
                category: mapCategory(data['หมวดหมู่'] || data.category || 'other'),
                type: (data['ประเภท'] === 'income' || data.type === 'income') ? 'income' : 'expense',
                amount: parseFloat(data['จำนวนเงิน'] || data.amount || 0),
                notes: data['หมายเหตุ'] || data.notes || '',
            };

            // Save to Database (Google Sheets)
            const saved = await transactionService.addTransaction({
                date: toThaiISOString(result.date),
                category: result.category,
                amount: result.amount,
                note: result.itemName, // Use item name as note
            });

            if (!saved) throw new Error('Failed to save transaction to database');

            setSavedTransaction(result);
            setViewState('success');
            onSuccess?.(result);
        } catch (error) {
            console.error('Error analyzing receipt:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Cannot read data');
            setViewState('error');
        } finally {
            setIsLoading(false);
            handleCancel();
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result: TransactionResult = {
                date: new Date(manualForm.date),
                itemName: manualForm.itemName || 'Manual Entry',
                category: manualForm.category,
                type: 'expense', // Default to expense for now
                amount: parseFloat(manualForm.amount),
                notes: '',
            };

            let success = false;

            if (initialData && initialData.id) {
                // Update existing
                success = await transactionService.updateTransaction({
                    id: initialData.id,
                    date: toThaiISOString(result.date),
                    category: result.category,
                    amount: result.amount,
                    note: result.itemName,
                });
            } else {
                // Add new
                const saved = await transactionService.addTransaction({
                    date: toThaiISOString(result.date),
                    category: result.category,
                    amount: result.amount,
                    note: result.itemName,
                });
                success = !!saved;
            }

            if (!success) throw new Error('Failed to save transaction');

            setSavedTransaction(result);
            setViewState('success');
            onSuccess?.(result);
        } catch (error) {
            console.error('Error saving manual transaction:', error);
            setErrorMessage('Failed to save transaction');
            setViewState('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setViewState('upload');
        setSavedTransaction(null);
        setErrorMessage('');
    };

    const handleClose = () => {
        handleReset();
        handleCancel();
        onClose();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0,
        }).format(amount);
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
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">{initialData ? 'Edit Expense' : 'Add Expense'}</h3>
                        <button onClick={handleClose} className="text-white/60 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Hidden inputs */}
                    <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                    <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />

                    <AnimatePresence mode="wait">
                        {viewState === 'error' ? (
                            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-3" />
                                <p className="text-white font-medium mb-2">Error</p>
                                <p className="text-white/60 text-sm mb-4">{errorMessage}</p>
                                <Button onClick={handleReset} className="bg-white/20 hover:bg-white/30 text-white">
                                    <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                                </Button>
                            </motion.div>
                        ) : viewState === 'success' && savedTransaction ? (
                            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-4">
                                <div className="text-center mb-4">
                                    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-2" />
                                    <p className="text-white font-bold text-lg">Saved!</p>
                                </div>

                                <div className="bg-white/10 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CalendarDays className="w-4 h-4 text-white/60" />
                                        <span className="text-white text-sm">{format(savedTransaction.date, 'd MMM yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-white/60" />
                                        <span className="text-white text-sm">{savedTransaction.itemName}</span>
                                    </div>
                                    {(() => {
                                        const cat = categoryConfig[savedTransaction.category] || categoryConfig.other;
                                        const CatIcon = cat.icon;
                                        return (
                                            <div className="flex items-center gap-3">
                                                <CatIcon className="w-4 h-4" style={{ color: cat.color }} />
                                                <span className="text-white text-sm">{cat.label}</span>
                                            </div>
                                        );
                                    })()}
                                    <div className="flex items-center gap-3">
                                        {savedTransaction.type === 'income' ? (
                                            <ArrowDownCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <ArrowUpCircle className="w-4 h-4 text-red-400" />
                                        )}
                                        <span className="text-white text-sm">{savedTransaction.type === 'income' ? 'Income' : 'Expense'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Tag className="w-4 h-4 text-yellow-400" />
                                        <span className="text-yellow-400 font-bold">{formatCurrency(savedTransaction.amount)}</span>
                                    </div>
                                </div>

                                <Button onClick={handleClose} className="w-full mt-4 bg-white/90 hover:bg-white text-primary font-semibold">
                                    Done
                                </Button>
                            </motion.div>
                        ) : viewState === 'manual' ? (
                            <motion.div key="manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <form onSubmit={handleManualSubmit} className="space-y-4 pt-2">
                                    <div>
                                        <label className="text-white/70 text-sm block mb-1">Item Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={manualForm.itemName}
                                            onChange={e => setManualForm({ ...manualForm, itemName: e.target.value })}
                                            placeholder="What did you buy?"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/70 text-sm block mb-1">Amount (฿)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={manualForm.amount}
                                            onChange={e => setManualForm({ ...manualForm, amount: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-white/70 text-sm block mb-1">Date</label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className={cn(
                                                            "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-left flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary",
                                                            !manualForm.date && "text-white/50"
                                                        )}
                                                    >
                                                        <CalendarIcon className="w-4 h-4 text-white/60" />
                                                        {manualForm.date
                                                            ? format(new Date(manualForm.date), 'dd/MM/yyyy', { locale: enUS })
                                                            : 'Pick a date'}
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={manualForm.date ? new Date(manualForm.date) : undefined}
                                                        onSelect={(d) => d && setManualForm({ ...manualForm, date: format(d, 'yyyy-MM-dd') })}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div>
                                            <label className="text-white/70 text-sm block mb-1">Category</label>
                                            <select
                                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                                                value={manualForm.category}
                                                onChange={e => setManualForm({ ...manualForm, category: e.target.value })}
                                            >
                                                {Object.entries(categoryConfig).map(([key, config]) => (
                                                    <option key={key} value={key} className="text-foreground bg-card">{config.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button type="button" onClick={handleReset} variant="outline" className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10 bg-transparent">
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isLoading} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold shadow-lg">
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {/* Preview */}
                                {selectedFile && (
                                    <div className="mb-4">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-40 object-contain rounded-xl bg-black/20" />
                                        ) : (
                                            <div className="w-full h-40 rounded-xl bg-white/10 flex items-center justify-center text-white/50 text-sm">
                                                No preview available
                                            </div>
                                        )}
                                        <p className="text-white/70 text-xs mt-2 truncate">{selectedFile.name}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {!selectedFile ? (
                                    <div className="space-y-3">
                                        <Button onClick={handleOpenFile} className="w-full h-12 bg-yellow-400/90 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl">
                                            <FileUp className="w-5 h-5 mr-2" /> Upload File
                                        </Button>
                                        <div className="relative py-2">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-white/20" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-transparent px-2 text-white/50">Or</span>
                                            </div>
                                        </div>
                                        <Button onClick={() => setViewState('manual')} className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border-2 border-dashed border-white/20">
                                            <FileText className="w-5 h-5 mr-2" /> Manual Input
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <Button onClick={handleCancel} variant="outline" className="flex-1 h-11 rounded-xl border-red-400/60 text-red-400 hover:bg-red-400/10">
                                            <X className="w-4 h-4 mr-1" /> Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAnalyze}
                                            disabled={isLoading}
                                            className="flex-1 h-11 rounded-xl bg-white/90 hover:bg-white text-primary font-semibold"
                                        >
                                            {isLoading ? (
                                                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                            ) : (
                                                <Sparkles className="w-4 h-4 mr-1" />
                                            )}
                                            {isLoading ? 'Analyzing...' : 'Analyze'}
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
