import { greater } from './greater'

const BREAKPOINTS = {
  sm: 1,
  md: 2,
  lg: 3,
}

describe('greater', () => {
  const mockGetBoundingClientRect = vitest.fn()

  const el = {
    getBoundingClientRect: mockGetBoundingClientRect,
  } as unknown as HTMLElement

  it('Should return false when no element was passed', () => {
    expect(greater(BREAKPOINTS, null)('sm')).toBe(false)
  })

  it('Should return true when element size is larger than the breakpoint', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 1.5,
      height: 1.5,
    })
    expect(greater(BREAKPOINTS, el)('sm')).toBe(true)
  })

  it('Should return false when element size is smaller than the breakpoint', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 2.5,
      height: 2.5,
    })
    expect(greater(BREAKPOINTS, el)('lg')).toBe(false)
  })

  it('Should compare height when direction is vertical', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 2.5,
      height: 2.5,
    })
    expect(greater(BREAKPOINTS, el, 'vertical')('sm')).toBe(true)
  })
})
