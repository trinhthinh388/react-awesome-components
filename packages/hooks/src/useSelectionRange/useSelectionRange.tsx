import { useEffect, useState } from 'react'

export type UseSelectionRangeOpts = {
  initialPosition?: {
    start: number
    end: number
  }
}

export const useSelectionRange = (
  inputEl?: HTMLElement | null,
  { initialPosition = { start: 0, end: 0 } }: UseSelectionRangeOpts = {},
) => {
  const [caret, setCaret] = useState<{ start: number; end: number }>({
    start: initialPosition.start,
    end: initialPosition.end,
  })

  useEffect(() => {
    if (!inputEl) return
    const onKeyDown = (e: KeyboardEvent | MouseEvent) => {
      setTimeout(() => {
        if (
          e.target &&
          'selectionStart' in e.target &&
          'selectionEnd' in e.target &&
          typeof e.target.selectionStart === 'number' &&
          typeof e.target.selectionEnd === 'number'
        ) {
          setCaret({
            start: e.target.selectionStart,
            end: e.target.selectionEnd,
          })
        }
      }, 0)
    }

    inputEl.addEventListener('keydown', onKeyDown)
    inputEl.addEventListener('click', onKeyDown)

    return () => {
      inputEl.removeEventListener('keydown', onKeyDown)
      inputEl.removeEventListener('click', onKeyDown)
    }
  }, [inputEl])

  return {
    caret,
  }
}
