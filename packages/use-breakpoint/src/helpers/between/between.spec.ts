import { between } from './between'

const BREAKPOINTS = {
  sm: 1,
  md: 2,
  lg: 3,
}

describe('between', () => {
  const mockGetBoundingClientRect = vitest.fn()

  const el = {
    getBoundingClientRect: mockGetBoundingClientRect,
  } as unknown as HTMLElement

  it('Should return false when no element was passed', () => {
    expect(between(BREAKPOINTS, null)('sm', 'lg')).toBe(false)
  })

  it('Should return true when element size is between two breakpoint', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 1.5,
      height: 1.5,
    })
    expect(between(BREAKPOINTS, el)('sm', 'md')).toBe(true)
  })

  it('Should return false when element size is not between two breakpoint', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 2.5,
      height: 2.5,
    })
    expect(between(BREAKPOINTS, el)('sm', 'md')).toBe(false)
  })

  it('Should compare height when direction is vertical', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 2.5,
      height: 2.5,
    })
    expect(between(BREAKPOINTS, el, 'vertical')('sm', 'md')).toBe(false)
  })
})
