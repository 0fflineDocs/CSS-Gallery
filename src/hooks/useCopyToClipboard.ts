import { useState, useCallback } from 'react';

export function useCopyToClipboard(resetDelay = 2000) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedValue(text);
        setTimeout(() => setCopiedValue(null), resetDelay);
        return true;
      } catch {
        setCopiedValue(null);
        return false;
      }
    },
    [resetDelay]
  );

  return { copiedValue, copy };
}
