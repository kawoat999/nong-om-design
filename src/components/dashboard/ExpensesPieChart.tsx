import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Transaction, CategoryType, CATEGORY_CONFIG } from '@/types/finance';

interface ExpensesPieChartProps {
  transactions: Transaction[];
}

export function ExpensesPieChart({ transactions }: ExpensesPieChartProps) {
  const chartData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    
    const categoryTotals: Record<CategoryType, number> = {} as Record<CategoryType, number>;
    
    expenses.forEach((t) => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = 0;
      }
      categoryTotals[t.category] += Number(t.amount);
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: CATEGORY_CONFIG[category as CategoryType].label,
        value: amount,
        color: CATEGORY_CONFIG[category as CategoryType].color,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bento-card h-[400px]"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Expenses by Category</h3>
        <p className="text-sm text-muted-foreground">This month's breakdown</p>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percentage = ((data.value / total) * 100).toFixed(1);
                  return (
                    <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                      <p className="font-medium text-sm">{data.name}</p>
                      <p className="text-sm text-foreground">
                        {formatCurrency(data.value)} ({percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[85%] flex items-center justify-center text-muted-foreground">
          No expenses recorded yet
        </div>
      )}
    </motion.div>
  );
}
