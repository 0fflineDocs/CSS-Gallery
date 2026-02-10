import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ColorSwatchProps {
  color: string;
  label: string;
  copied: boolean;
  onCopy: (color: string) => void;
}

export function ColorSwatch({ color, label, copied, onCopy }: ColorSwatchProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={() => onCopy(color)}
            className="group flex flex-col items-center gap-1.5 cursor-pointer border-none bg-transparent p-0"
          >
            <motion.div
              className="relative w-9 h-9 rounded-full border border-white/[0.08]"
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50"
                  >
                    <span className="text-[9px] font-medium text-white">OK</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <span className="text-[9px] text-slate-600 group-hover:text-slate-400 transition-colors font-mono mt-2 leading-none">
              {label}
            </span>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-md bg-slate-800 px-3 py-1.5 text-xs text-slate-200 shadow-lg font-mono"
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
