import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, PieChart, Target, Shield, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: TrendingUp,
    title: 'Track Spending',
    description: 'See where your money goes with clear, simple charts.',
  },
  {
    icon: PieChart,
    title: 'Set Budgets',
    description: 'Create monthly budgets and get alerts when you overspend.',
  },
  {
    icon: Target,
    title: 'Save for Goals',
    description: 'Set savings goals and watch your progress grow.',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your data is encrypted and always protected.',
  },
];

const benefits = [
  'Free to use',
  'No credit card required',
  'Works on all devices',
  'Simple setup in 2 minutes',
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">Nong Om</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="shadow-sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Personal Finance Made Simple
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-5">
              Manage Your Money
              <br />
              <span className="text-primary">Without the Stress</span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
              Track your spending, set budgets, and reach your savings goals — all in one beautiful, easy-to-use app.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link to="/auth">
                <Button size="lg" className="gap-2 px-6 shadow-md hover:shadow-lg transition-shadow">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-14"
          >
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent blur-3xl opacity-40 -z-10" />
              
              <div className="bg-card border border-border/60 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-muted/30 px-4 py-3 border-b border-border/50 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  <span className="ml-3 text-xs text-muted-foreground">Dashboard</span>
                </div>
                
                <div className="p-5 sm:p-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
                    <div className="bg-muted/40 rounded-xl p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Balance</p>
                      <p className="text-lg sm:text-xl font-bold">$12,450</p>
                    </div>
                    <div className="bg-muted/40 rounded-xl p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Income</p>
                      <p className="text-lg sm:text-xl font-bold text-income">$5,200</p>
                    </div>
                    <div className="bg-muted/40 rounded-xl p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Expenses</p>
                      <p className="text-lg sm:text-xl font-bold text-expense">$3,150</p>
                    </div>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="bg-muted/30 rounded-xl p-4 h-36 sm:h-44 flex items-end justify-center gap-2 sm:gap-3">
                    {[35, 55, 40, 70, 50, 85, 60, 45, 75].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
                        className="w-5 sm:w-8 bg-primary/70 rounded-t-md"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Simple Tools for Smart Money
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything you need to understand and manage your finances.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-border/50 rounded-2xl p-8 sm:p-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Start Managing Your Money Today
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands of users who are taking control of their finances with Nong Om.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gap-2 px-6 shadow-md">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">Nong Om</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Nong Om. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
