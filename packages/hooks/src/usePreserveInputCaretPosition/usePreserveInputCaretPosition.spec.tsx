import { renderHook } from '@testing-library/react'
import {
  calculateCaretPositionWithDelimiters,
  calculateCaretPositionWithoutDelimiters,
  getDelimiterRegexByDelimiter,
  calculateDelimiterQty,
  stripDelimiters,
  usePreserveInputCaretPosition,
} from './usePreserveInputCaretPosition'
import { useRef, useState } from 'react'

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
  const Comp = () => {
    const [value, setValue] = useState<string>('')
    const ref = useRef<HTMLInputElement>(null)

    usePreserveInputCaretPosition(ref.current, { delimiters: ['-'] })

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value.match(/.{1,2}/g)?.join('-') || '')
    }

    return <input ref={ref} value={value} onChange={onChange} />
  }
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
})
