import { useRef, useState } from 'react';
import { Camera, FileUp, Sparkles, Receipt, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpenCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file.name);
      // TODO: Handle file upload
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #3730A3 100%)' }}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, white 0%, transparent 50%)' }}
        />
      </div>

      {/* Header */}
      <header className="relative pt-16 pb-6 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-400 shadow-2xl shadow-primary/30">
            <Receipt className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-2 tracking-tight"
        >
          Nong Om
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="text-secondary text-lg font-medium">Budget Visualization</span>
          <Sparkles className="w-4 h-4 text-secondary" />
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-8">
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

        {/* Instruction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 mb-4"
        >
          <p className="text-white/90 text-center text-sm leading-relaxed">
            📸 ถ่ายรูปใบเสร็จหรือเลือกไฟล์เพื่อบันทึกรายจ่ายของคุณอัตโนมัติ
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          {/* Camera Button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Button
              onClick={handleOpenCamera}
              className={cn(
                "w-full h-16 text-lg font-semibold rounded-2xl",
                "bg-gradient-to-r from-primary to-purple-400",
                "hover:from-primary/90 hover:to-purple-400/90",
                "text-white shadow-xl shadow-primary/30",
                "transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/40",
                "flex items-center justify-between px-6"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <span>ถ่ายรูป</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-70" />
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
                "w-full h-16 text-lg font-semibold rounded-2xl",
                "bg-gradient-to-r from-secondary to-amber-400",
                "hover:from-secondary/90 hover:to-amber-400/90",
                "text-white shadow-xl shadow-secondary/30",
                "transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-secondary/40",
                "flex items-center justify-between px-6"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <FileUp className="w-5 h-5" />
                </div>
                <span>เลือกไฟล์</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-70" />
            </Button>
          </motion.div>
        </div>

        {/* Selected File Preview */}
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm mt-4 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
          >
            <p className="text-white/70 text-sm mb-1">ไฟล์ที่เลือก:</p>
            <p className="text-white font-medium truncate">{selectedFile.name}</p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative py-8 text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
          <p className="text-white/60 text-sm">
            Made with <span className="text-primary">💜</span> for better budgeting
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
        </motion.div>
      </footer>
    </div>
  );
}
