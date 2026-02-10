import { AnimatePresence } from 'framer-motion';
import type { ThemePreset } from '../types/theme';
import { ThemeCard } from './ThemeCard';

interface ThemeGridProps {
  themes: ThemePreset[];
}

export function ThemeGrid({ themes }: ThemeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 place-content-center justify-items-center">
      <AnimatePresence mode="popLayout">
        {themes.map((theme, i) => (
          <ThemeCard key={theme.id} theme={theme} index={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}
