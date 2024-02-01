import { act, renderHook } from '@testing-library/react'
import { useToggle } from './useToggle'

describe('useToggle', () => {
  it('Should toggle the value', () => {
    const { result, rerender } = renderHook(() => useToggle(true))

    expect(result.current.isOn).toBe(true)

    act(() => {
      result.current.toggle()
      rerender()
    })

    expect(result.current.isOn).toBe(false)

    act(() => {
      result.current.toggle(true)
      rerender()
    })

    expect(result.current.isOn).toBe(true)
  })
})
