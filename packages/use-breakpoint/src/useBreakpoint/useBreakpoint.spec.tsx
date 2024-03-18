import { Mock } from 'vitest'
import { useBreakpoint } from './useBreakpoint'
import { renderHook } from '@testing-library/react'

describe('useBreakpoint', () => {
  let MockObserverInstance: ResizeObserver
  let GlobalResizeObserver: Mock
  const mockEl = {} as unknown as HTMLElement

  beforeEach(() => {
    MockObserverInstance = {
      observe: vitest.fn(),
      unobserve: vitest.fn(),
      disconnect: vitest.fn(),
    }
    GlobalResizeObserver = vitest
      .fn()
      .mockImplementation(() => MockObserverInstance)
    global.ResizeObserver = GlobalResizeObserver
  })

  afterEach(() => {
    vitest.resetAllMocks()
  })

  it('Should do nothing when element is null', async () => {
    const { unmount } = renderHook(() =>
      useBreakpoint({
        containerEl: null,
      }),
    )

    expect(MockObserverInstance.observe).not.toHaveBeenCalled()
  })

  it('Should observe resize event on passed element', async () => {
    const { unmount } = renderHook(() =>
      useBreakpoint({
        containerEl: mockEl,
      }),
    )

    expect(MockObserverInstance.observe).toHaveBeenCalled()

    unmount()

    expect(MockObserverInstance.disconnect).toHaveBeenCalled()
  })

  it('Should throw error if breakpoint has two keys has the same value', () => {
    try {
      console.error = vitest.fn()
      renderHook(() =>
        useBreakpoint({
          containerEl: mockEl,
          breakpoints: {
            sm: 1,
            md: 1,
            lg: 2,
          },
        }),
      )
    } catch (err) {
      expect(err).toBeDefined()
      expect((err as any).message).toBe(
        'Found two breakpoints has the same value: sm and md',
      )
    }
  })

  it('Should trigger callback when condition is met - smaller than the smallest breakpoint', () => {
    const mockCallback = vitest.fn()
    GlobalResizeObserver.mockImplementationOnce((callback) => {
      callback([
        {
          contentRect: {
            width: 640,
            height: 640,
          },
        },
      ])
      return MockObserverInstance
    })

    renderHook(() =>
      useBreakpoint({
        containerEl: mockEl,
        callbacks: {
          sm: mockCallback,
        },
      }),
    )

    expect(mockCallback).toHaveBeenCalled()
  })

  it('Should trigger callback when condition is met - within two breakpoints', () => {
    const mockCallback = vitest.fn()
    GlobalResizeObserver.mockImplementationOnce((callback) => {
      callback([
        {
          contentRect: {
            width: 780,
            height: 780,
          },
        },
      ])
      return MockObserverInstance
    })

    renderHook(() =>
      useBreakpoint({
        containerEl: mockEl,
        callbacks: {
          lg: mockCallback,
        },
      }),
    )

    expect(mockCallback).toHaveBeenCalled()
  })

  it('Should trigger callback when condition is met - larger than the largest breakpoint', () => {
    const mockCallback = vitest.fn()
    GlobalResizeObserver.mockImplementationOnce((callback) => {
      callback([
        {
          contentRect: {
            width: 1538,
            height: 1538,
          },
        },
      ])
      return MockObserverInstance
    })

    renderHook(() =>
      useBreakpoint({
        containerEl: mockEl,
        callbacks: {
          '2xl': mockCallback,
        },
      }),
    )

    expect(mockCallback).toHaveBeenCalled()
  })
})
