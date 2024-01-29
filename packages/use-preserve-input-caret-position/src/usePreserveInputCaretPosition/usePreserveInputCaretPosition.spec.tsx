import { render, renderHook, act } from '@testing-library/react'
import {
  calculateCaretPositionWithDelimiters,
  calculateCaretPositionWithoutDelimiters,
  getDelimiterRegexByDelimiter,
  calculateDelimiterQty,
  stripDelimiters,
  usePreserveInputCaretPosition,
} from './usePreserveInputCaretPosition'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

const Comp = () => {
  const [value, setValue] = useState<string>('')
  const [ref, setRef] = useState<HTMLInputElement | null>(null)

  usePreserveInputCaretPosition(ref, { delimiters: ['-'] })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setValue('')
      return
    }

    const value = e.target.value.replace(/-/g, '').match(/.{1,2}/g)

    if (value) {
      setValue(value.join('-'))
    } else {
      setValue('')
    }
  }

  return (
    <input
      ref={setRef}
      value={value}
      onChange={onChange}
      placeholder="xx-xx-xx..."
    />
  )
}

const CompWithPrefix = () => {
  const [value, setValue] = useState<string>('PREFIX')
  const [ref, setRef] = useState<HTMLInputElement | null>(null)

  usePreserveInputCaretPosition(ref, {
    delimiters: ['-'],
    prefix: 'PREFIX',
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      setValue('PREFIX')
      return
    }
    if (value.length < 6) return
    if (!value.startsWith('PREFIX')) return
    const cleanValue = e.target.value.replace('PREFIX', '')

    if (cleanValue === '') {
      setValue('PREFIX')
      return
    }

    if (cleanValue === '-') {
      setValue('PREFIX-')
      return
    }

    const formattedValue = cleanValue.replace(/-/g, '').match(/.{1,2}/g)

    if (formattedValue) {
      setValue('PREFIX-' + formattedValue.join('-'))
    } else {
      setValue('PREFIX')
    }
  }

  return (
    <input
      ref={setRef}
      value={value}
      onChange={onChange}
      placeholder="PREFIX xx-xx-xx..."
    />
  )
}

describe('getDelimiterRegexByDelimiter', () => {
  it('Should replace the correct delimiters', () => {
    expect(getDelimiterRegexByDelimiter(' ')).toStrictEqual(/ /g)
  })
})

describe('stripDelimiters', () => {
  it('Should remove all delimiters', () => {
    expect(
      stripDelimiters({
        value: '+ 128-34',
        delimiters: [' ', '-'],
      }),
    ).toStrictEqual('+12834')
  })
})

describe('calculateCaretPositionWithoutDelimiters', () => {
  it('Should get the correct position', () => {
    const result = calculateCaretPositionWithoutDelimiters('+1-505', 4, ['-'])
    expect(result).toBe(3)
  })
})

describe('calculateCaretPositionWithoutDelimiters', () => {
  it('Should get the correct position', () => {
    /**
     * Assume the previous position was 3.
     */
    const result = calculateCaretPositionWithDelimiters('+1-5205', 4, ['-'])
    expect(result).toBe(5)
  })
})

describe('calculateDelimiterQty', () => {
  it('Should get delimiters quantity', () => {
    /**
     * Assume the previous position was 3.
     */
    const result = calculateDelimiterQty('+1-5205', ['-'])
    expect(result).toBe(1)
  })

  it('Delimiters should be empty array by default', () => {
    /**
     * Assume the previous position was 3.
     */
    const result = calculateDelimiterQty('+1-5205')
    expect(result).toBe(0)
  })
})

describe('usePreserveInputCaretPosition', () => {
  it('Should register onInput event', () => {
    const mockInput = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    renderHook(() =>
      usePreserveInputCaretPosition(mockInput as unknown as HTMLInputElement),
    )

    expect(mockInput.addEventListener.mock.calls[0][0]).toBe('input')
  })

  it('Should do nothing when input is not provided', () => {
    const mockInput = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    renderHook(() => usePreserveInputCaretPosition(undefined))

    expect(mockInput.addEventListener).not.toHaveBeenCalled()
  })

  it('Should be able to type at the end of the string as normal', async () => {
    const { container } = render(<Comp />)

    const input = container.querySelector('input')

    if (!(input instanceof HTMLInputElement)) {
      throw new Error('input element is not valid.')
    }

    expect(input.getAttribute('placeholder')).toBe('xx-xx-xx...')

    await act(async () => {
      input.focus()

      await user.type(input, '123456')
    })

    expect(input.getAttribute('value')).toBe('12-34-56')

    await act(async () => {
      await user.type(input, '7')
    })

    expect(input.getAttribute('value')).toBe('12-34-56-7')
  })

  it('Should be able to delete from the end of the string as normal', async () => {
    const { container } = render(<Comp />)

    const input = container.querySelector('input')

    if (!(input instanceof HTMLInputElement)) {
      throw new Error('input element is not valid.')
    }

    expect(input.getAttribute('placeholder')).toBe('xx-xx-xx...')

    await act(async () => {
      input.focus()

      await user.type(input, '123456')
    })

    expect(input.getAttribute('value')).toBe('12-34-56')

    await act(async () => {
      await user.type(input, '7')
    })

    expect(input.getAttribute('value')).toBe('12-34-56-7')

    await act(async () => {
      await user.keyboard('{Backspace}')
    })

    expect(input.getAttribute('value')).toBe('12-34-56')
  })

  it('Should be able to edit at the middle of the string', async () => {
    const { container } = render(<Comp />)

    const input = container.querySelector('input')

    if (!(input instanceof HTMLInputElement)) {
      throw new Error('input element is not valid.')
    }

    expect(input.getAttribute('placeholder')).toBe('xx-xx-xx...')

    await act(async () => {
      input.focus()

      await user.type(input, '123456')
    })

    expect(input.getAttribute('value')).toBe('12-34-56')

    // navigate to the position 4

    await act(async () => {
      await user.keyboard(
        '[ArrowLeft][ArrowLeft][ArrowLeft][ArrowLeft][Backspace]',
      )

      await user.keyboard('{7}')
    })

    expect(input.getAttribute('value')).toBe('12-74-56')

    await act(async () => {
      await user.keyboard('{8}')
    })

    /**
     * Because after delete `7` the caret will be placed like this 12-|74-56
     * Flow: 12-3|4-56 -> 12|-4-56 -> 12-|74-56 -> 12-87|-45-6
     */
    expect(input.getAttribute('value')).toBe('12-87-45-6')
  })

  it('Should be able to ignore the prefix', async () => {
    const { container } = render(<CompWithPrefix />)

    const input = container.querySelector('input')

    if (!(input instanceof HTMLInputElement)) {
      throw new Error('input element is not valid.')
    }

    expect(input.getAttribute('placeholder')).toBe('PREFIX xx-xx-xx...')

    await act(async () => {
      input.focus()

      await user.type(input, '123456')
    })

    expect(input.getAttribute('value')).toBe('PREFIX-12-34-56')

    await act(async () => {
      await user.keyboard(
        '{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}',
      )
    })

    expect(input.getAttribute('value')).toBe('PREFIX')
  })

  it('Should place the caret next to the prefix when pressed backspace inside prefix range', async () => {
    const { container } = render(<CompWithPrefix />)

    const input = container.querySelector('input')

    if (!(input instanceof HTMLInputElement)) {
      throw new Error('input element is not valid.')
    }

    expect(input.getAttribute('placeholder')).toBe('PREFIX xx-xx-xx...')

    await act(async () => {
      input.focus()

      await user.type(input, '123456')
    })

    expect(input.getAttribute('value')).toBe('PREFIX-12-34-56')

    /**
     * The caret position would be: PRE|FIX-12-34-56
     */
    await act(async () => {
      await user.keyboard(
        '{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{Backspace}',
      )

      await user.keyboard('{7}')

      await user.keyboard('{8}')
    })

    expect(input.getAttribute('value')).toBe('PREFIX-78-12-34-56')
  })
})
