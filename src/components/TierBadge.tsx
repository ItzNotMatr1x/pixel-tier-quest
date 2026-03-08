import { TierName, TIER_COLORS } from "@/lib/data";
import { motion } from "framer-motion";

const tierBgClasses: Record<TierName, string> = {
  Unranked: 'bg-muted',
  HT1: 'bg-tier-ht1',
  HT2: 'bg-tier-ht2',
  HT3: 'bg-tier-ht3',
  HT4: 'bg-tier-ht4',
  HT5: 'bg-tier-ht5',
  LT1: 'bg-tier-lt1',
  LT2: 'bg-tier-lt2',
  LT3: 'bg-tier-lt3',
  LT4: 'bg-tier-lt4',
  LT5: 'bg-tier-lt5',
};

const tierShadowClasses: Record<TierName, string> = {
  HT1: 'shadow-[0_0_12px_hsl(43_100%_55%/0.6)]',
  HT2: 'shadow-[0_0_12px_hsl(280_70%_55%/0.6)]',
  HT3: 'shadow-[0_0_12px_hsl(220_90%_55%/0.6)]',
  HT4: 'shadow-[0_0_12px_hsl(195_90%_55%/0.6)]',
  HT5: 'shadow-[0_0_12px_hsl(180_90%_50%/0.6)]',
  LT1: 'shadow-[0_0_12px_hsl(140_70%_45%/0.6)]',
  LT2: 'shadow-[0_0_12px_hsl(90_70%_50%/0.6)]',
  LT3: 'shadow-[0_0_12px_hsl(50_95%_55%/0.6)]',
  LT4: 'shadow-[0_0_12px_hsl(30_95%_55%/0.6)]',
  LT5: 'shadow-[0_0_12px_hsl(0_80%_55%/0.6)]',
};

const tierTextClasses: Record<TierName, string> = {
  HT1: 'text-tier-ht1',
  HT2: 'text-tier-ht2',
  HT3: 'text-tier-ht3',
  HT4: 'text-tier-ht4',
  HT5: 'text-tier-ht5',
  LT1: 'text-tier-lt1',
  LT2: 'text-tier-lt2',
  LT3: 'text-tier-lt3',
  LT4: 'text-tier-lt4',
  LT5: 'text-tier-lt5',
};

interface TierBadgeProps {
  tier: TierName;
  size?: 'sm' | 'md' | 'lg';
}

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const sizeClasses = {
    sm: 'h-6 px-2 text-xs gap-1',
    md: 'h-8 px-3 text-sm gap-1.5',
    lg: 'h-10 px-4 text-base gap-2',
  };

  const dotSize = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center rounded-md font-display font-bold ${sizeClasses[size]} bg-background/80 border border-border/50`}
    >
      <span className={`${dotSize[size]} rounded-sm ${tierBgClasses[tier]} ${tierShadowClasses[tier]} animate-glow-pulse`} />
      <span className={tierTextClasses[tier]}>{tier}</span>
    </motion.div>
  );
}

export { tierBgClasses, tierTextClasses, tierShadowClasses };
