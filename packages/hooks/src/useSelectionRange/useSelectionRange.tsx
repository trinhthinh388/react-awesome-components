import { useEffect, useState } from 'react';

export const useSelectionRange = (inputEl: HTMLInputElement | null) => {
  const [caretPos, setPos] = useState<{
    start: number | null;
    end: number | null;
  }>({
    start: 0,
    end: 0,
  });

  useEffect(() => {
    console.log(inputEl);
    if (!inputEl) return;
    const track = (e: KeyboardEvent | MouseEvent) => {
      setTimeout(() => {
        if (e.target instanceof HTMLInputElement) {
          setPos({
            start: e.target.selectionStart,
            end: e.target.selectionEnd,
          });
        }
      }, 0);
    };

    inputEl.addEventListener('keydown', track);
    inputEl.addEventListener('mousedown', track);
    inputEl.addEventListener('mouseup', track);

    return () => {
      inputEl.removeEventListener('keydown', track);
      inputEl.removeEventListener('mousedown', track);
      inputEl.removeEventListener('mouseup', track);
    };
  }, [inputEl]);

  return caretPos;
};
