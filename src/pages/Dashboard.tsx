import { useRef } from 'react';
import { Camera, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleOpenCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
      // TODO: Handle file upload
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #1E1B4B, #312E81)' }}>
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-2"
        >
          Nong Om
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-secondary text-lg font-medium"
        >
          Budget Visualization
        </motion.p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
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

        {/* Camera Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleOpenCamera}
            size="lg"
            className="w-64 h-16 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl"
          >
            <Camera className="w-6 h-6 mr-3" />
            ถ่ายรูป
          </Button>
        </motion.div>

        {/* File Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleOpenFile}
            size="lg"
            variant="secondary"
            className="w-64 h-16 text-lg font-semibold shadow-xl"
          >
            <FileUp className="w-6 h-6 mr-3" />
            เลือกไฟล์
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 text-sm"
        >
          Made with 💜 for better budgeting
        </motion.p>
      </footer>
    </div>
  );
}
