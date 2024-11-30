import { useDebounce } from './use-debounce'
import { renderHook } from '@testing-library/react'

describe('useDebounce', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('Should debounce the state update', () => {
    const { result, rerender } = renderHook(() => useDebounce(1, 3_000))
    expect(result.current).toBe(undefined)
    vi.runAllTimers()
    rerender()
    expect(result.current).toBe(1)
  })
})
