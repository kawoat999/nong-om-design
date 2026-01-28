import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Target,
  Settings,
  TrendingDown,
  TrendingUp,
  Flame,
  Trophy,
  Bell
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import nongOmLogo from '@/assets/nong-om-mascot.jpg';
import { useState, useEffect } from 'react';
import { transactionService } from '@/services/transactionService';
import { isSameDay, isSameWeek, parseISO } from 'date-fns';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: Receipt },
  { path: '/budget', label: 'Budget', icon: PiggyBank },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/settings', label: 'Settings', icon: Settings },
];

interface AppSidebarProps {
  onClose?: () => void;
}

export function AppSidebar({ onClose }: AppSidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();

  const handleNavClick = () => {
    onClose?.();
  };

  // State for stats
  const [todaySpent, setTodaySpent] = useState(0);
  const [weekSpent, setWeekSpent] = useState(0);
  const [gameStats, setGameStats] = useState({ streak: 0, level: 1, progress: 0, nextLevel: 2 });


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const transactions = await transactionService.fetchTransactions();
        const today = new Date();

        let todaySum = 0;
        let weekSum = 0;

        transactions.forEach(t => {
          const date = new Date(t.date);
          if (isSameDay(date, today)) {
            todaySum += t.amount;
          }
          if (isSameWeek(date, today, { weekStartsOn: 1 })) { // Monday start
            weekSum += t.amount;
          }
        });

        setTodaySpent(todaySum);
        setWeekSpent(weekSum);

        // Fetch Gamification Stats
        const stats = await transactionService.getGamificationStats();
        setGameStats(stats);

      } catch (error) {
        console.error("Failed to fetch sidebar stats", error);
      }
    };

    fetchStats();
    // Optional: Poll every minute or listen to global events if needed
  }, []);

  return (
    <aside className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3" onClick={handleNavClick}>
          <img
            src={nongOmLogo}
            alt="Nong Om Logo"
            className="w-10 h-10 rounded-full object-cover shadow-md"
          />
          <div>
            <h1 className="text-base font-bold tracking-tight">Nong Om</h1>
            <p className="text-[10px] text-sidebar-foreground/60">Finance Tracker</p>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 -mr-2">
              <div className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-sidebar pointer-events-none" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[280px] ml-12 z-[100]">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-lg">👋</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Welcome to Nong Om!</p>
                  <p className="text-xs text-muted-foreground">
                    Start tracking your finance and build your dream city today.
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Just now</p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.path}
                onClick={handleNavClick}
                className={cn(
                  'sidebar-link',
                  isActive && 'active'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="flex-1 p-3 space-y-3">
        <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50 font-medium">
          Daily Summary
        </p>

        {/* Today's Spending */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-sidebar-accent/50 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[10px] text-sidebar-foreground/60">Today</span>
          </div>
          <p className="text-lg font-bold text-red-400">฿{todaySpent.toLocaleString()}</p>
        </motion.div>

        {/* Week's Spending */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-sidebar-accent/50 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] text-sidebar-foreground/60">This Week</span>
          </div>
          <p className="text-lg font-bold text-blue-400">฿{weekSpent.toLocaleString()}</p>
        </motion.div>

        {/* Gamification Stats */}
        <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50 font-medium pt-2">
          Achievements
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-2"
        >
          {/* Streak */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-2.5 text-center">
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-orange-400">{gameStats.streak}</p>
            <p className="text-[9px] text-sidebar-foreground/60">Day Streak</p>
          </div>

          {/* Level */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg p-2.5 text-center">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-yellow-400">Lv.{gameStats.level}</p>
            <p className="text-[9px] text-sidebar-foreground/60">Level</p>
          </div>
        </motion.div>

        {/* Progress to Next Level */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-sidebar-accent/30 rounded-lg p-2.5"
        >
          <div className="flex justify-between text-[10px] text-sidebar-foreground/60 mb-1">
            <span>To Lv.{gameStats.nextLevel}</span>
            <span>{gameStats.progress.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
              style={{ width: `${gameStats.progress}%` }}
            />
          </div>
        </motion.div>
      </div>


    </aside >
  );
}
