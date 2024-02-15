/**
 * @description returns true if container's size is smaller than given breakpoint
 */
export const smaller =
  (
    BREAKPOINTS: Record<string, number>,
    containerEl: HTMLElement | null,
    direction: 'horizontal' | 'vertical' = 'horizontal',
  ) =>
  (breakpoint: string) => {
    if (!containerEl) return false
    const value = BREAKPOINTS[breakpoint]
    const dimension = direction === 'horizontal' ? 'width' : 'height'
    return containerEl.getBoundingClientRect()[dimension] < value
  }
