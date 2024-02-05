import { useEffect, useState } from 'react'
import _debounce from 'lodash/debounce'

const DEFAULT_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}
export type DefaultBreakpointConfigs = typeof DEFAULT_BREAKPOINTS
export type BreakpointConfig = Record<string, number>
export type UseBreakpointCallback = () => any

export type UseBreakpointCallbacks<
  O extends Record<string, number> = DefaultBreakpointConfigs,
> = O extends DefaultBreakpointConfigs
  ? Record<keyof DefaultBreakpointConfigs, UseBreakpointCallback>
  : O extends Record<infer K, number>
    ? Record<K, UseBreakpointCallback>
    : never

export type UseBreakpointOpts<
  B extends Record<string, number> = DefaultBreakpointConfigs,
> = {
  /**
   * @description Breakpoints object, each breakpoint should be defined in `px` value.
   */
  breakpoints?: B
  callbacks?: Partial<UseBreakpointCallbacks<B>>
  fallbackValue?: keyof B
}

export function useBreakpoint<B extends Record<string, number>>(
  containerEl: HTMLElement | null,
  opts: UseBreakpointOpts<B> = {},
) {
  const {
    breakpoints: BPS = DEFAULT_BREAKPOINTS,
    callbacks,
    fallbackValue,
  } = opts
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    keyof typeof BPS | undefined
  >(fallbackValue as keyof typeof BPS)

  useEffect(() => {
    if (!containerEl) return

    const callback = (entries: ResizeObserverEntry[]) => {
      console.log(entries)
    }

    const resizeObserver = new ResizeObserver(_debounce(callback))

    resizeObserver.observe(containerEl)

    return () => {
      resizeObserver.disconnect()
    }
  }, [containerEl])

  return currentBreakpoint
}
