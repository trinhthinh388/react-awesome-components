import { Mock } from 'vitest'
import { Autosizer } from './autosizer'
import { render } from '@testing-library/react'

describe('useBreakpoint', () => {
  let MockObserverInstance: ResizeObserver
  let GlobalResizeObserver: Mock

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

  it('Should observe resize event', async () => {
    const { unmount } = render(<Autosizer />)

    expect(MockObserverInstance.observe).toHaveBeenCalled()

    unmount()

    expect(MockObserverInstance.disconnect).toHaveBeenCalled()
  })
})
