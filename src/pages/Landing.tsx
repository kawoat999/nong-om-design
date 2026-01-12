import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, PieChart, Target, Shield, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: TrendingUp,
    title: 'Track Your Money',
    description: 'Monitor income and expenses with beautiful charts and real-time insights.',
  },
  {
    icon: PieChart,
    title: 'Budget Wisely',
    description: 'Set monthly budgets by category and stay on top of your spending.',
  },
  {
    icon: Target,
    title: 'Achieve Goals',
    description: 'Save for what matters most with visual progress tracking.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and protected at all times.',
  },
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
  show: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Nong Om</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Smart Personal Finance
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Take Control of Your{' '}
              <span className="text-primary">Financial Future</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track expenses, set budgets, and achieve your savings goals with Nong Om — 
              the beautiful and intuitive personal finance tracker.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="gap-2 px-8">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-30 rounded-3xl" />
              <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
                {/* Mock Dashboard Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bento-card p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
                    <p className="text-2xl font-bold">$12,450</p>
                    <p className="text-xs text-income">+8.2%</p>
                  </div>
                  <div className="bento-card p-4">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Income</p>
                    <p className="text-2xl font-bold text-income">$5,200</p>
                    <p className="text-xs text-muted-foreground">+$400</p>
                  </div>
                  <div className="bento-card p-4">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Expenses</p>
                    <p className="text-2xl font-bold text-expense">$3,150</p>
                    <p className="text-xs text-muted-foreground">-$120</p>
                  </div>
                </div>
                <div className="h-48 bg-muted/50 rounded-xl flex items-center justify-center">
                  <div className="flex items-end gap-2 h-32">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                        className="w-8 sm:w-12 bg-primary/80 rounded-t-md"
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Manage Money
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features wrapped in a simple, beautiful interface.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="bento-card p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bento-card p-8 sm:p-12 bg-gradient-to-br from-primary/5 to-accent/5"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of users who are already taking control of their money with Nong Om.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gap-2 px-8">
                Get Started for Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Nong Om</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nong Om. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
