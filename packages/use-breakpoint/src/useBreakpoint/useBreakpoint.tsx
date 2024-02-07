import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  smaller,
  smallerOrEqual,
  greater,
  greaterOrEqual,
  between,
} from '../helpers'
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

export type UseBreakpointUtils<
  B extends Record<string, number> = DefaultBreakpointConfigs,
> = B extends DefaultBreakpointConfigs
  ? {
      greater(k: keyof DefaultBreakpointConfigs): boolean
      greaterOrEqual: (k: keyof DefaultBreakpointConfigs) => boolean
      smaller(k: keyof DefaultBreakpointConfigs): boolean
      smallerOrEqual(k: keyof DefaultBreakpointConfigs): boolean
      between(
        a: keyof DefaultBreakpointConfigs,
        b: keyof DefaultBreakpointConfigs,
      ): boolean
    }
  : B extends Record<infer K, number>
    ? {
        greater(k: K): boolean
        greaterOrEqual(k: K): boolean
        smaller(k: K): boolean
        smallerOrEqual(k: K): boolean
        between(a: K, b: K): boolean
      }
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
  useResizeObserver?: boolean
}

export function useBreakpoint<B extends Record<string, number>>(
  containerEl: HTMLElement | null,
  opts: UseBreakpointOpts<B> = {},
): { currentBreakpoint?: keyof B } & UseBreakpointUtils<B> {
  const {
    breakpoints: BPS = DEFAULT_BREAKPOINTS,
    callbacks,
    fallbackValue,
  } = opts
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    keyof typeof BPS | undefined
  >(fallbackValue as keyof typeof BPS)

  const BPS_VALUES_ARR = useMemo(
    () => Object.values(BPS).sort((a, b) => a - b),
    [BPS],
  )
  const BPS_BY_KEYS = useMemo(
    () =>
      Object.keys(BPS).reduce<Record<string, keyof typeof BPS>>((obj, key) => {
        const bpKey = BPS[key as keyof typeof BPS]
        if (obj[bpKey]) {
          throw new Error(
            `Found two breakpoints has the same value: ${obj[bpKey]} and ${key}`,
          )
        }
        obj[bpKey] = key as keyof typeof BPS
        return obj
      }, {}),
    [BPS],
  )

  const determineCurrentBreakpoint = useCallback(
    ({ width }: { width: number; height: number }) => {
      for (let i = 0; i < BPS_VALUES_ARR.length; i++) {
        const currentBp = BPS_VALUES_ARR[i]
        if (i === 0 && width <= currentBp) {
          setCurrentBreakpoint(BPS_BY_KEYS[currentBp.toString()])
          break
        } else if (width > BPS_VALUES_ARR[i - 1] && width <= currentBp) {
          setCurrentBreakpoint(BPS_BY_KEYS[currentBp.toString()])
          break
        } else if (i + 1 === BPS_VALUES_ARR.length && width > currentBp) {
          setCurrentBreakpoint(BPS_BY_KEYS[currentBp.toString()])
          break
        }
      }
    },
    [BPS_BY_KEYS, BPS_VALUES_ARR],
  )

  useEffect(() => {
    if (!containerEl) return

    const callback = (entries: ResizeObserverEntry[]) => {
      const [entry] = entries
      const { width, height } = entry.contentRect
      determineCurrentBreakpoint({
        width,
        height,
      })
    }

    const resizeObserver = new ResizeObserver(callback)

    resizeObserver.observe(containerEl)

    return () => {
      resizeObserver.disconnect()
    }
  }, [containerEl, determineCurrentBreakpoint])

  // @ts-expect-error
  return {
    currentBreakpoint,
    smaller: smaller(BPS, containerEl),
    smallerOrEqual: smallerOrEqual(BPS, containerEl),
    greater: greater(BPS, containerEl),
    greaterOrEqual: greaterOrEqual(BPS, containerEl),
    between: between(BPS, containerEl),
  }
}
