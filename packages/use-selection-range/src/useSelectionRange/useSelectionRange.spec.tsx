import { useSelectionRange } from './useSelectionRange'
import { act, render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

const user = userEvent.setup()

const Comp = () => {
  const [ref, setRef] = useState<HTMLInputElement | null>(null)

  const { caret } = useSelectionRange(ref)

  return (
    <div>
      <input ref={setRef} defaultValue="123456" />
      <div>
        <span id="start">{caret.start}</span>
        <span id="end">{caret.end}</span>
      </div>
    </div>
  )
}

const InvalidComp = () => {
  const [ref, setRef] = useState<HTMLElement | null>(null)

  const { caret } = useSelectionRange(ref)

  return (
    <div>
      <div
        id="input"
        suppressContentEditableWarning
        contentEditable
        ref={setRef}
      >
        123456
      </div>
      <div>
        <span id="start">{caret.start}</span>
        <span id="end">{caret.end}</span>
      </div>
    </div>
  )
}

describe('useSelectionRange', () => {
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

  it('Should track caret position', async () => {
    const { container } = render(<Comp />)

    const start = container.querySelector('#start')
    const end = container.querySelector('#end')
    const input = container.querySelector('input')

    if (!input) {
      throw new Error('Input element is not valid')
    }

    expect(start).toBeDefined()
    expect(end).toBeDefined()

    expect(start?.textContent).toBe('0')
    expect(end?.textContent).toBe('0')

    await act(async () => {
      await user.click(input)
    })

    expect(start?.textContent).toBe('6')
    expect(end?.textContent).toBe('6')

    await act(async () => {
      await user.keyboard('{ArrowLeft}')
    })

    expect(start?.textContent).toBe('5')
    expect(end?.textContent).toBe('5')
  })

  it("Should do nothing when e.target doesn't have selectionStart or selectionEnd", async () => {
    const { container } = render(<InvalidComp />)

    const start = container.querySelector('#start')
    const end = container.querySelector('#end')
    const input = container.querySelector('#input')

    if (!input) {
      throw new Error('Input element is not valid')
    }

    expect(start).toBeDefined()
    expect(end).toBeDefined()

    expect(start?.textContent).toBe('0')
    expect(end?.textContent).toBe('0')

    await act(async () => {
      await user.click(input)
    })

    expect(start?.textContent).toBe('0')
    expect(end?.textContent).toBe('0')
  })
})
