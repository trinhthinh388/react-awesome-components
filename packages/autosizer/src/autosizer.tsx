import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { mergeRefs } from 'react-merge-refs'

export type AutosizerProps = {
  children?: (_: { width: number; height: number }) => React.ReactNode
  initialSize?: {
    width?: number
    height?: number
  }
} & Omit<React.ComponentPropsWithRef<'div'>, 'children'>

export const Autosizer = forwardRef<HTMLDivElement, AutosizerProps>(
  ({ children = () => void 0, initialSize = {}, ...props }, ref) => {
    const elRef = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState({
      width: initialSize.width || 0,
      height: initialSize.height || 0,
    })

    const watch = useCallback(
      /* istanbul ignore next */ () => {
        if (!elRef.current) return

        const observer = new ResizeObserver(
          /* istanbul ignore next */ (entries) => {
            if (!entries.length) return
            const [entry] = entries
            setSize({
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            })
          },
        )

        observer.observe(elRef.current)

        return () => {
          observer.disconnect()
        }
      },
      [],
    )

    useEffect(() => watch(), [watch])

    return (
      <div ref={mergeRefs([elRef, ref])} {...props}>
        {children(size)}
      </div>
    )
  },
)
