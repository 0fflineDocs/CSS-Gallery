import { motion } from 'framer-motion';
import type { ThemePreset } from '../types/theme';
import { ThemePreview } from './ThemePreview';

interface ThemeCardProps {
  theme: ThemePreset;
  index: number;
}

export function ThemeCard({ theme, index }: ThemeCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        layout: { duration: 0.25 },
      }}
      className="flex flex-col w-full max-w-[360px]"
    >
      {/* Window */}
      <div
        className="overflow-hidden rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-200"
      >
        {/* Chrome bar */}
        <div
          className="flex items-center justify-center px-4"
          style={{
            height: 36,
            backgroundColor: theme.colors.muted,
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <span className="text-[12px] font-medium text-slate-400">
            {theme.name}
          </span>
        </div>

        {/* Preview content */}
        <ThemePreview theme={theme} />
      </div>
    </motion.article>
  );
}
