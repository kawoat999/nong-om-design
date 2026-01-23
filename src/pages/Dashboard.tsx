import { useEffect, useRef, useState } from 'react';
import {
  Camera, FileUp, Sparkles, ChevronRight, X, CheckCircle2, CalendarDays,
  Tag, ArrowDownCircle, ArrowUpCircle, FileText, Plus, XCircle, RefreshCw,
  Utensils, Car, Film, Pill, Receipt, ShoppingCart, TrendingUp, Package, LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import nongOmLogo from '@/assets/nong-om-logo.png';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

// Category configuration with icons and colors
const categoryConfig: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  food: { icon: Utensils, color: '#F97316', label: 'อาหาร' },
  transport: { icon: Car, color: '#3B82F6', label: 'เดินทาง' },
  entertainment: { icon: Film, color: '#EC4899', label: 'บันเทิง' },
  healthcare: { icon: Pill, color: '#10B981', label: 'สุขภาพ' },
  utilities: { icon: Receipt, color: '#6366F1', label: 'ค่าบิล' },
  shopping: { icon: ShoppingCart, color: '#8B5CF6', label: 'ของใช้' },
  investment: { icon: TrendingUp, color: '#14B8A6', label: 'ลงทุน' },
  other: { icon: Package, color: '#6B7280', label: 'อื่นๆ' },
};

interface TransactionResult {
  date: Date;
  itemName: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  notes?: string;
}

type ViewState = 'upload' | 'success' | 'error';

export default function Dashboard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ViewState>('upload');
  const [savedTransaction, setSavedTransaction] = useState<TransactionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const previewCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedFile) return;
    // Ensure the preview + buttons are visible (especially on smaller screens)
    requestAnimationFrame(() => {
      previewCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [selectedFile]);

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
    console.log('File selected:', file);
    if (file) {
      setSelectedFile(file);
      console.log('File type:', file.type);

      // Clean up previous preview URL (prevents memory leaks)
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        console.log('Preview URL created:', url);
        setPreviewUrl(url);
      } else {
        // Clear preview for non-image files
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
    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    console.log('Analyzing file:', selectedFile.name);

    // Show loading state
    setViewState('upload'); // Keep on upload but could add loading indicator

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1]; // Remove data URL prefix
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      // Send to N8N webhook
      const response = await fetch('https://kawoat9.app.n8n.cloud/webhook/6aa89004-c110-48c0-b52a-38c98fbe0224', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: { image: base64 } }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('N8N Response:', text);

      if (!text || !text.trim()) {
        throw new Error('Server ไม่ได้ส่งข้อมูลกลับมา');
      }

      const data = JSON.parse(text);
      console.log('Parsed data:', data);

      // Map Thai field names from N8N response
      const result: TransactionResult = {
        date: data['วันที่'] ? new Date(data['วันที่']) : new Date(),
        itemName: data['ชื่อ'] || data.item || 'ไม่ระบุ',
        category: mapCategory(data['หมวดหมู่'] || data.category || 'other'),
        type: (data['ประเภท'] === 'income' || data.type === 'income') ? 'income' : 'expense',
        amount: parseFloat(data['จำนวนเงิน'] || data.amount || 0),
        notes: data['หมายเหตุ'] || data.notes || `จากใบเสร็จ: ${selectedFile.name}`,
      };

      setSavedTransaction(result);
      setViewState('success');
    } catch (error) {
      console.error('Error analyzing receipt:', error);
      setErrorMessage(error instanceof Error ? error.message : 'ไม่สามารถอ่านข้อมูลจากรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
      setViewState('error');
    }

    // Clean up
    handleCancel();
  };

  // Helper function to map Thai category names to English keys
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

  const handleAddNewReceipt = () => {
    setViewState('upload');
    setSavedTransaction(null);
    setErrorMessage('');
  };

  const handleTryAgain = () => {
    setViewState('upload');
    setErrorMessage('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen h-screen flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)' }}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #C4B5FD 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #FCD34D 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.35, 0.25] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/3 right-10 w-32 h-32 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FBBF24 0%, transparent 70%)' }}
        />
      </div>

      {/* Header */}
      <header className="relative pt-12 pb-4 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-3 flex justify-center"
        >
          <img
            src={nongOmLogo}
            alt="Nong Om Logo"
            className="w-24 h-24 object-cover rounded-full drop-shadow-2xl"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-1 tracking-tight"
        >
          Nong Om
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="text-yellow-200 text-base font-medium">Budget Visualization</span>
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </motion.div>
      </header>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 min-h-0 flex flex-col items-center gap-4 px-6 py-4 overflow-y-auto',
          (selectedFile || viewState !== 'upload') ? 'justify-start' : 'justify-center'
        )}
      >
        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {viewState === 'error' ? (
            /* Error Page */
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4"
              >
                <XCircle className="w-12 h-12 text-red-400" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-3"
              >
                เกิดข้อผิดพลาด
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/70 text-center mb-6"
              >
                {errorMessage}
              </motion.p>

              {/* Try Again Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full"
              >
                <Button
                  onClick={handleTryAgain}
                  className={cn(
                    "w-full h-14 text-base font-semibold rounded-2xl",
                    "bg-white/90 hover:bg-white",
                    "text-primary shadow-xl",
                    "transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
                    "flex items-center justify-center gap-3"
                  )}
                >
                  <RefreshCw className="w-5 h-5" />
                  ลองใหม่อีกครั้ง
                </Button>
              </motion.div>
            </motion.div>
          ) : viewState === 'success' && savedTransaction ? (
            /* Success Page */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-6"
              >
                บันทึกสำเร็จ!
              </motion.h2>

              {/* Transaction Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full bg-white/20 backdrop-blur-lg rounded-2xl p-5 border border-white/30 space-y-4"
              >
                {/* Date */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">วันที่</p>
                    <p className="text-white font-medium">
                      {format(savedTransaction.date, 'd MMMM yyyy', { locale: th })}
                    </p>
                  </div>
                </div>

                {/* Item Name */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">รายการ</p>
                    <p className="text-white font-medium">{savedTransaction.itemName}</p>
                  </div>
                </div>

                {/* Category */}
                {(() => {
                  const catConfig = categoryConfig[savedTransaction.category] || categoryConfig.other;
                  const CategoryIcon = catConfig.icon;
                  return (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${catConfig.color}20` }}
                      >
                        <CategoryIcon className="w-5 h-5" style={{ color: catConfig.color }} />
                      </div>
                      <div>
                        <p className="text-white/60 text-xs">หมวดหมู่</p>
                        <p className="text-white font-medium">{catConfig.label}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Type */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    {savedTransaction.type === 'income' ? (
                      <ArrowDownCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <ArrowUpCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">ประเภท</p>
                    <p className={cn(
                      "font-medium",
                      savedTransaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    )}>
                      {savedTransaction.type === 'income' ? 'รายรับ' : 'รายจ่าย'}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">จำนวนเงิน</p>
                    <p className="text-xl font-bold" style={{ color: '#F59E0B' }}>
                      {formatCurrency(savedTransaction.amount)}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {savedTransaction.notes && (
                  <div className="pt-3 border-t border-white/20">
                    <p className="text-white/60 text-xs mb-1">หมายเหตุ</p>
                    <p className="text-white/90 text-sm">{savedTransaction.notes}</p>
                  </div>
                )}
              </motion.div>

              {/* Add New Receipt Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full mt-6"
              >
                <Button
                  onClick={handleAddNewReceipt}
                  className={cn(
                    "w-full h-14 text-base font-semibold rounded-2xl",
                    "bg-white/90 hover:bg-white",
                    "text-primary shadow-xl",
                    "transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
                    "flex items-center justify-center gap-3"
                  )}
                >
                  <Plus className="w-5 h-5" />
                  เพิ่มใบเสร็จใหม่
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            /* Upload UI */
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              {/* Instruction Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 mb-4"
              >
                <p className="text-white text-center text-sm leading-relaxed">
                  📸 ถ่ายรูปใบเสร็จหรือเลือกไฟล์เพื่อบันทึกรายจ่ายของคุณอัตโนมัติ
                </p>
              </motion.div>

              {/* Action Buttons */}
              <div className="w-full space-y-3">
                {/* Camera Button */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Button
                    onClick={handleOpenCamera}
                    className={cn(
                      "w-full h-14 text-base font-semibold rounded-2xl",
                      "bg-white/90 hover:bg-white",
                      "text-primary shadow-xl",
                      "transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
                      "flex items-center justify-between px-5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-primary" />
                      </div>
                      <span>ถ่ายรูป</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-50" />
                  </Button>
                </motion.div>

                {/* File Button */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  <Button
                    onClick={handleOpenFile}
                    className={cn(
                      "w-full h-14 text-base font-semibold rounded-2xl",
                      "bg-yellow-400/90 hover:bg-yellow-400",
                      "text-gray-900 shadow-xl",
                      "transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
                      "flex items-center justify-between px-5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-yellow-600/20 flex items-center justify-center">
                        <FileUp className="w-5 h-5 text-gray-900" />
                      </div>
                      <span>เลือกไฟล์</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-50" />
                  </Button>
                </motion.div>
              </div>

              {/* Selected File Preview */}
              <AnimatePresence>
                {selectedFile && (
                  <motion.div
                    ref={previewCardRef}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full mt-4 bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30"
                  >
                    {/* Image Preview */}
                    {previewUrl ? (
                      <div className="mb-4 rounded-xl overflow-hidden bg-black/20">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-48 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 rounded-xl overflow-hidden bg-white/10 h-48 flex items-center justify-center">
                        <p className="text-white/60 text-sm">ไม่สามารถแสดงตัวอย่างไฟล์นี้ได้</p>
                      </div>
                    )}

                    <p className="text-white/80 text-xs mb-1">ไฟล์ที่เลือก:</p>
                    <p className="text-white font-medium text-sm truncate mb-4">{selectedFile.name}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className={cn(
                          "flex-1 h-11 rounded-xl font-semibold",
                          "bg-transparent border-2 border-destructive/60 text-destructive",
                          "hover:bg-destructive/10 hover:border-destructive/80",
                          "transition-all duration-200"
                        )}
                      >
                        <X className="w-4 h-4 mr-2" />
                        ยกเลิก
                      </Button>
                      <Button
                        onClick={handleAnalyze}
                        className={cn(
                          "flex-1 h-11 rounded-xl font-semibold",
                          "bg-white/90 hover:bg-white text-primary",
                          "shadow-lg hover:shadow-xl",
                          "transition-all duration-200"
                        )}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        วิเคราะห์
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative py-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2"
        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/40" />
          <p className="text-white/80 text-sm">
            Made with 💜 for better budgeting
          </p>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/40" />
        </motion.div>
      </footer>
    </div>
  );
}
