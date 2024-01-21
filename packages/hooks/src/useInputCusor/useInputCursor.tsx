import { useEffect, useRef } from 'react';

export const useInputCursor = (inputEl: HTMLInputElement | null) => {
  const pos = useRef<{ start: number | null; end: number | null }>({
    start: 0,
    end: 0,
  });

  useEffect(() => {
    console.log(inputEl);
    if (!inputEl) return;
    const track = (e: KeyboardEvent | MouseEvent) => {
      setTimeout(() => {
        if (e.target instanceof HTMLInputElement) {
          pos.current = {
            start: e.target.selectionStart,
            end: e.target.selectionEnd,
          };
          console.log(pos.current);
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

  return pos.current;
};
