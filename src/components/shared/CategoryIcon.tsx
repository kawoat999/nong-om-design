import {
  Home,
  UtensilsCrossed,
  Car,
  Zap,
  Gamepad2,
  ShoppingBag,
  Heart,
  Briefcase,
  Laptop,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-react';
import { CategoryType, CATEGORY_CONFIG } from '@/types/finance';
import { cn } from '@/lib/utils';

const iconMap = {
  Home,
  UtensilsCrossed,
  Car,
  Zap,
  Gamepad2,
  ShoppingBag,
  Heart,
  Briefcase,
  Laptop,
  TrendingUp,
  MoreHorizontal,
};

interface CategoryIconProps {
  category: CategoryType;
  className?: string;
  iconClassName?: string;
}

export function CategoryIcon({ category, className, iconClassName }: CategoryIconProps) {
  const config = CATEGORY_CONFIG[category];
  const IconComponent = iconMap[config.icon as keyof typeof iconMap] || MoreHorizontal;

  return (
    <div
      className={cn(
        'rounded-xl flex items-center justify-center',
        className
      )}
      style={{ backgroundColor: `${config.color}15` }}
    >
      <IconComponent 
        className={cn('w-5 h-5', iconClassName)} 
        style={{ color: config.color }}
      />
    </div>
  );
}
