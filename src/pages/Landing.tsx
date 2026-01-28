import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, PieChart, Target, Shield, ArrowRight, CheckCircle2, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import nongOmLogo from '@/assets/nong-om-mascot.jpg';

const features = [
  {
    icon: TrendingUp,
    title: 'Track Every Baht',
    description: 'Log your income and expenses in seconds. See exactly where your money goes each month with clear, visual reports.',
  },
  {
    icon: PieChart,
    title: 'Smart Budgeting',
    description: 'Set monthly budgets for food, transport, shopping, and more. Get notified before you overspend.',
  },
  {
    icon: Target,
    title: 'Reach Your Goals',
    description: 'Saving for a trip? A new phone? Set goals and track your progress with beautiful visual indicators.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your financial data stays private. We use bank-level encryption to keep your information safe.',
  },
];

const steps = [
  { number: '01', title: 'Sign Up Free', description: 'Create your account in under a minute. No credit card needed.' },
  { number: '02', title: 'Add Transactions', description: 'Log your income and expenses as they happen.' },
  { number: '03', title: 'See Insights', description: 'Get a clear picture of your spending habits and savings.' },
];

const testimonials = [
  { name: 'Somchai', quote: 'Finally, a simple way to track my spending. I saved 3,000 baht in my first month!' },
  { name: 'Ploy', quote: 'I love how easy it is to use. Now I know exactly where my money goes.' },
  { name: 'Bank', quote: 'The budget alerts help me stay on track. Best finance app I have used.' },
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <img
                src={nongOmLogo}
                alt="Nong Om Logo"
                className="w-9 h-9 rounded-xl object-cover shadow-sm"
              />
              <span className="text-lg font-bold tracking-tight">Nong Om</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
            </nav>
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
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Take Control of
              <br />
              <span className="text-primary">Your Money</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
              The simple way to track spending, set budgets, and save for your goals. Start for free today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link to="/auth">
                <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-lg hover:shadow-xl transition-shadow">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base">
                  Learn More
                </Button>
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>2-min setup</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-8 px-6 border-y border-border/50 bg-muted/20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm"><strong className="text-foreground">1,000+</strong> <span className="text-muted-foreground">active users</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="text-sm"><strong className="text-foreground">4.9/5</strong> <span className="text-muted-foreground">user rating</span></span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm"><strong className="text-foreground">฿50M+</strong> <span className="text-muted-foreground">tracked</span></span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Simple tools to help you understand your money and make smarter decisions.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="flex gap-5 p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Get started in minutes. No complicated setup required.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by Users
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              See what people are saying about Nong Om.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 bg-card border border-border/50 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed">"{testimonial.quote}"</p>
                <p className="text-sm font-medium text-muted-foreground">— {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Take Control?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of people who are already managing their money smarter with Nong Om.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-lg">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/50 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <img
                src={nongOmLogo}
                alt="Nong Om Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-semibold">Nong Om</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
            </nav>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nong Om. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
