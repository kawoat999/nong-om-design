import { useRef, useState } from 'react';
import { Camera, FileUp, Sparkles, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import nongOmLogo from '@/assets/nong-om-logo.png';

export default function Dashboard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleOpenCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file);
    if (file) {
      setSelectedFile(file);
      console.log('File type:', file.type);
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

  const handleAnalyze = () => {
    if (selectedFile) {
      console.log('Analyzing file:', selectedFile.name);
      // TODO: Implement OCR/analysis
    }
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
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-4">
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
          className="w-full max-w-sm bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 mb-2"
        >
          <p className="text-white text-center text-sm leading-relaxed">
            📸 ถ่ายรูปใบเสร็จหรือเลือกไฟล์เพื่อบันทึกรายจ่ายของคุณอัตโนมัติ
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-3">
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm mt-4 bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30"
            >
              {/* Image Preview */}
              {previewUrl && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              {/* File Name */}
              <p className="text-white/80 text-xs mb-1">ไฟล์ที่เลือก:</p>
              <p className="text-white font-medium text-sm truncate mb-4">{selectedFile.name}</p>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className={cn(
                    "flex-1 h-11 rounded-xl font-semibold",
                    "bg-transparent border-2 border-red-400 text-red-100",
                    "hover:bg-red-500/20 hover:border-red-300",
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
