import { greaterOrEqual } from './greaterOrEqual'

const BREAKPOINTS = {
  sm: 1,
  md: 2,
  lg: 3,
}

describe('greaterOrEqual', () => {
  const mockGetBoundingClientRect = vitest.fn()

  const el = {
    getBoundingClientRect: mockGetBoundingClientRect,
  } as unknown as HTMLElement

  it('Should return false when no element was passed', () => {
    expect(greaterOrEqual(BREAKPOINTS, null)('sm')).toBe(false)
  })

  it('Should return true when element size is larger or equal to the breakpoint', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 1,
      height: 1,
    })
    expect(greaterOrEqual(BREAKPOINTS, el)('sm')).toBe(true)
  })

  it('Should return false when element size is smaller than the breakpoint', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 2.5,
      height: 2.5,
    })
    expect(greaterOrEqual(BREAKPOINTS, el)('lg')).toBe(false)
  })

  it('Should compare height when direction is vertical', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 2.5,
      height: 2.5,
    })
    expect(greaterOrEqual(BREAKPOINTS, el, 'vertical')('sm')).toBe(true)
  })
})
