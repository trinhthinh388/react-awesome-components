import { useEffect } from 'react'

export const useClickOutside = (
  el: HTMLElement | null,
  callback?: (event: MouseEvent) => any
) => {
  useEffect(() => {
    if (!callback) return
    const check = (e: MouseEvent) => {
      if (el && !el.contains(e.target as Node)) {
        callback(e)
      }
    }
    window.document.addEventListener('click', check)

    return () => {
      window.document.removeEventListener('click', check)
    }
  }, [callback, el])
}
