import { renderHook } from '@testing-library/react'
import { usePrevious } from './usePrevious'

describe('usePrevious', () => {
  it('Should store previous value', () => {
    const { result, rerender } = renderHook((value = 1) => usePrevious(value))

    expect(result.current).toBe(1)

    rerender(2)
    rerender(2)

    expect(result.current).toBe(2)
  })
})
