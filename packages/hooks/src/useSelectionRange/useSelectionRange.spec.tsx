import { useSelectionRange } from './useSelectionRange'
import { renderHook } from '@testing-library/react'

const mockSetter = vi.fn()

vitest.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useState: (initialValue: any) => [initialValue, mockSetter],
  }
})

describe('useSelectionRange', () => {
  const mockSetter = vitest.fn()

  it('Should do nothing if input is not provided', () => {
    const mockInput = {
      addEventListener: vitest.fn(),
      removeEventListener: vitest.fn(),
    }

    renderHook(() => useSelectionRange(undefined))

    expect(mockInput.addEventListener).not.toHaveBeenCalled()
  })

  it('Should register keydown and click event', () => {
    const mockInput = {
      addEventListener: vitest.fn(),
      removeEventListener: vitest.fn(),
    }

    renderHook(() =>
      useSelectionRange(mockInput as unknown as HTMLInputElement),
    )

    expect(mockInput.addEventListener).toHaveBeenCalledTimes(2)
    expect(mockInput.addEventListener.mock.calls[0][0]).toBe('keydown')
    expect(mockInput.addEventListener.mock.calls[1][0]).toBe('click')
  })

  it('Should unregister keydown and click event on unmount', () => {
    const mockInput = {
      addEventListener: vitest.fn(),
      removeEventListener: vitest.fn(),
    }

    const { unmount } = renderHook(() =>
      useSelectionRange(mockInput as unknown as HTMLInputElement),
    )

    unmount()

    expect(mockInput.removeEventListener).toHaveBeenCalledTimes(2)
    expect(mockInput.removeEventListener.mock.calls[0][0]).toBe('keydown')
    expect(mockInput.removeEventListener.mock.calls[1][0]).toBe('click')
  })

  it('Should set new caret position', () => {
    let isCalled = false
    const mockInput = {
      addEventListener: vitest.fn((_, fn) => {
        if (isCalled) return
        fn({
          target: {
            selectionStart: 1,
            selectionEnd: 2,
          },
        })
        isCalled = true
      }),
      removeEventListener: vitest.fn(),
    }

    renderHook(() =>
      useSelectionRange(mockInput as unknown as HTMLInputElement),
    )

    setTimeout(() => {
      expect(mockSetter).toHaveBeenCalled()
      expect(mockSetter).toHaveBeenCalledWith({
        start: 1,
        end: 2,
      })
    }, 100)
  })

  it("Should do nothing when e.target doesn't have selectionStart or selectionEnd", () => {
    let trackFn = (e: any) => {}
    const mockInput = {
      addEventListener: vitest.fn((_, fn) => {
        trackFn = fn
      }),
      removeEventListener: vitest.fn(),
    }

    renderHook(() =>
      useSelectionRange(mockInput as unknown as HTMLInputElement),
    )

    trackFn({
      target: {},
    })

    expect(mockSetter).not.toHaveBeenCalled()
  })
})
