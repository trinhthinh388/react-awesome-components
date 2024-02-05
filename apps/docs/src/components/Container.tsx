import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'

export const Container = ({
  children,
  showSizeHandler = false,
}: {
  children: React.ReactNode
  showSizeHandler?: boolean
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWith] = useState<number | undefined>()

  useEffect(() => {
    if (!showSizeHandler || !ref.current) return

    setWith(ref.current.clientWidth)

    const callback = (entries: ResizeObserverEntry[]) => {
      if (!entries.length) return

      const [entry] = entries

      const { target } = entry
    }

    const observer = new ResizeObserver(callback)

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [showSizeHandler])

  return (
    <div
      ref={ref}
      className={classNames('mt-5 border rounded-lg p-4', {
        'mr-9 relative': showSizeHandler,
      })}
      style={{
        width,
      }}
    >
      {children}

      <div
        className="pointer-events-auto absolute top-1/2 right-0 -mt-6 p-2 hidden md:block cursor-ew-resize select-none touch-pan-y origin-[50%_50%_0px] [transform:_translate3d(20px,_0px,_0px)_scale(1,_1)]"
        draggable="false"
      >
        <div className="w-1.5 h-8 bg-slate-500/60 rounded-full"></div>
      </div>
    </div>
  )
}
