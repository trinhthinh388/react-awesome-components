import { useEffect, useRef, useState } from 'react'

export function useDebounce<T>(state: T, timeout: number = 3_00): T {
  const [debounced, setDebounced] = useState<T>()
  const timeoutId = useRef<number>()

  useEffect(() => {
    const id = timeoutId.current
    if (id) {
      clearTimeout(id)
    }

    timeoutId.current = window.setTimeout(() => {
      setDebounced(state)
    }, timeout)

    return () => {
      clearTimeout(id)
    }
  }, [state, timeout])

  return debounced as T
}
