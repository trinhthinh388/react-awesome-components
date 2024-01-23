import { useEffect, useState } from 'react';

export type UseSelectionRangeOpts = {
  initialPosition?: {
    start: number;
    end: number;
  };
};

export const useSelectionRange = (
  inputEl?: HTMLElement | null,
  { initialPosition = { start: 0, end: 0 } }: UseSelectionRangeOpts = {}
) => {
  const [caret, setCaret] = useState<{ start: number; end: number }>({
    start: initialPosition.start,
    end: initialPosition.end,
  });

  useEffect(() => {
    if (!inputEl) return;
    const onKeyDown = (e: KeyboardEvent) => {
      setTimeout(() => {
        if (e.target instanceof HTMLInputElement) {
          console.log(
            'SELECTIOn RANGE',
            e.target.selectionStart,
            e.target.selectionEnd
          );
          setCaret({
            start: e.target.selectionStart || 0,
            end: e.target.selectionEnd || 0,
          });
        }
      }, 0);
    };

    inputEl.addEventListener('keydown', onKeyDown);

    return () => {
      inputEl.removeEventListener('keydown', onKeyDown);
    };
  }, [inputEl]);

  return {
    caret,
  };
};
