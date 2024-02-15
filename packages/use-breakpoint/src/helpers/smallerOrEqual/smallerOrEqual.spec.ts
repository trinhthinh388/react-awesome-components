import { smallerOrEqual } from './smallerOrEqual'

const BREAKPOINTS = {
  sm: 1,
  md: 2,
  lg: 3,
}

describe('smallerOrEqual', () => {
  const mockGetBoundingClientRect = vitest.fn()

  const el = {
    getBoundingClientRect: mockGetBoundingClientRect,
  } as unknown as HTMLElement

  it('Should return false when no element was passed', () => {
    expect(smallerOrEqual(BREAKPOINTS, null)('sm')).toBe(false)
  })

  it('Should return true when element size is smaller or equal to the breakpoint', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 1,
      height: 1,
    })
    expect(smallerOrEqual(BREAKPOINTS, el)('lg')).toBe(true)
  })

  it('Should return false when element size is larger than the breakpoint', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 2.5,
      height: 2.5,
    })
    expect(smallerOrEqual(BREAKPOINTS, el)('sm')).toBe(false)
  })

  it('Should compare height when direction is vertical', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 2.5,
      height: 2.5,
    })
    expect(smallerOrEqual(BREAKPOINTS, el, 'vertical')('sm')).toBe(false)
  })
})
