/**
 * @description returns true if container's size is between two given breakpoints.
 * `between` won't compare the equation.
 */
export const between =
  (
    BREAKPOINTS: Record<string, number>,
    containerEl: HTMLElement | null,
    direction: 'horizontal' | 'vertical' = 'horizontal',
  ) =>
  (minBreakpoint: string, maxBreakpoint: string) => {
    if (!containerEl) return false
    const min = BREAKPOINTS[minBreakpoint]
    const max = BREAKPOINTS[maxBreakpoint]
    const dimension = direction === 'horizontal' ? 'width' : 'height'
    return (
      containerEl.getBoundingClientRect()[dimension] > min &&
      containerEl.getBoundingClientRect()[dimension] < max
    )
  }
