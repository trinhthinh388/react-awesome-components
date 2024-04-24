import { act, renderHook } from '@testing-library/react'
import { useToggle } from './useToggle'

describe('useToggle', () => {
  it('Should toggle the value', () => {
    const { result } = renderHook(() => useToggle(true))

    expect(result.current[1]).toBeInstanceOf(Function)

    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1](true)
    })

    expect(result.current[0]).toBe(true)
  })
})
