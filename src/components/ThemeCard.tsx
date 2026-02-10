import { motion } from 'framer-motion';
import type { ThemePreset } from '../types/theme';
import { ThemePreview } from './ThemePreview';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ThemeCardProps {
  theme: ThemePreset;
  index: number;
}

function PaletteDot({
  color,
  hex,
  copied,
  onCopy,
}: {
  color: string;
  hex: string;
  copied: boolean;
  onCopy: (c: string) => void;
}) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={() => onCopy(hex)}
            className="group/dot flex flex-col items-center gap-1.5 cursor-pointer border-none bg-transparent p-0"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <span
              className="block w-8 h-8 rounded-full border border-white/[0.08] relative"
              style={{ backgroundColor: hex }}
            >
              {copied && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <span className="text-[8px] font-medium text-white">OK</span>
                </span>
              )}
            </span>
            <span className="text-[9px] text-slate-600 group-hover/dot:text-slate-400 transition-colors font-mono leading-none">
              {hex}
            </span>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-md bg-slate-800 px-2.5 py-1 text-[11px] text-slate-200 shadow-lg font-mono capitalize"
            sideOffset={6}
          >
            {color}
            <Tooltip.Arrow className="fill-slate-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
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
