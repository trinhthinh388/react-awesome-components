import { usePhoneInput } from './usePhoneInput'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'
import { CountryCode } from 'libphonenumber-js'
import { useState } from 'react'

const user = userEvent.setup({
  delay: 300,
})

const Comp = ({
  supportedCountries,
  defaultCountry,
  smartCaret,
  value,
  mode = 'international',
  country,
  onChange = () => {},
}: {
  country?: CountryCode
  supportedCountries?: CountryCode[]
  defaultCountry?: CountryCode
  smartCaret?: boolean
  value?: string
  mode?: any
  onChange?: any
}) => {
  const [, rerender] = useState<boolean>(false)
  const { register, selectedCountry, setSelectedCountry } = usePhoneInput({
    supportedCountries: supportedCountries,
    defaultCountry,
    smartCaret,
    value,
    mode,
    country,
    onChange,
  })

  return (
    <div>
      <span id={selectedCountry} />
      <input {...register('phone-input')} />
      <button
        onClick={() => {
          setSelectedCountry('FI')
          rerender((prev) => !prev)
        }}
      >
        Set FI
      </button>
    </div>
  )
}

describe('usePhoneInput', () => {
  it('Should only allow to enter phone number characters', async () => {
    const { container } = render(<Comp />)

    const input = container.querySelector('input')

    if (!input) {
      throw new Error('input is not a valid element.')
    }

    await act(async () => {
      input.focus()
      await user.keyboard('{a},{b},{c},{1},{2},{3}')
    })

    expect(input.getAttribute('value')).toBe('+1 23')
  })

  it('Should allow to enter plus sign at the beginning', async () => {
    const { container } = render(<Comp />)

    const input = container.querySelector('input')

    if (!input) {
      throw new Error('input is not a valid element.')
    }

    await act(async () => {
      input.focus()
      await user.keyboard('+')
    })

    expect(input.getAttribute('value')).toBe('+')
  })

  it('Should be able to format the phone value on typing', async () => {
    const { container } = render(<Comp />)

    const input = container.querySelector('input')

    if (!input) {
      throw new Error('input is not a valid element.')
    }

    await act(async () => {
      input.focus()
      await user.keyboard('{+},{1},{2},{3}')
    })

    expect(input.getAttribute('value')).toBe('+1 23')
  })

  it('Should only allow supported country to be detected', async () => {
    const { container } = render(<Comp supportedCountries={['VN']} />)

    const input = container.querySelector('input')

    if (!input) {
      throw new Error('input is not a valid element.')
    }

    expect(container.querySelector('#VN')).toBeVisible()

    await act(async () => {
      input.focus()
      await user.keyboard('{+},{1},{2},{3}')
    })

    expect(input.getAttribute('value')).toBe('+1 23')

    expect(container.querySelector('#VN')).toBeVisible()
  })

  it('Should render default country', async () => {
    const { container } = render(<Comp defaultCountry="CA" />)

    const input = container.querySelector('input')

    if (!input) {
      throw new Error('input is not a valid element.')
    }

    expect(container.querySelector('#CA')).toBeVisible()
  })

  it('Should be able to delete all', async () => {
    const { container, rerender } = render(<Comp />)

    const input = container.querySelector('input')

    if (!input) {
      throw new Error('input is not a valid element.')
    }

    await act(async () => {
      input.focus()
      await user.keyboard('{+},{1},{2},{3}')
    })

    expect(input.getAttribute('value')).toBe('+1 23')

    await act(async () => {
      input.focus()
      await user.keyboard('{Control>}a{/Control}')
      await user.keyboard('{Backspace}')
    })

    expect(input.getAttribute('value')).toBe('')
  })

  it('Should allow to turn off smart caret', async () => {
    const { container } = render(
      <Comp defaultCountry="CA" smartCaret={false} />,
    )

    const input = container.querySelector('input')

    if (!input) {
      throw new Error('input is not a valid element.')
    }

    expect(container.querySelector('#CA')).toBeVisible()

    await act(async () => {
      input.focus()
      await user.keyboard('{+},{1},{2},{3},{4},{5}')
    })

    expect(input.getAttribute('value')).toBe('+1 234 5')

    await act(async () => {
      input.focus()
      await user.keyboard('{ArrowLeft}{ArrowLeft}{Backspace}{6}') // +1 234| 5
    })

    expect(input.getAttribute('value')).toBe('+1 235 6') // it should be +1 236 5 if used smart caret
  })

  it('Should be able to set value passed as props', async () => {
    const { container, rerender } = render(<Comp />)

    const input = container.querySelector('input')

    if (!input) {
      throw new Error('input is not a valid element.')
    }

    expect(input.getAttribute('value')).toBe('')

    await act(async () => {
      rerender(<Comp value="+1 753 396 4271" />)
    })

    expect(input.getAttribute('value')).toBe('+1 753 396 4271')
  })

  it('Should be able to set the selected country via API', async () => {
    const { container } = render(<Comp />)

    const input = container.querySelector('input')

    if (!input) {
      throw new Error('input is not a valid element.')
    }

    await act(async () => {
      await user.click(container.querySelector('button')!)
    })

    expect(container.querySelector('#FI')).toBeVisible()
  })

  /**
   * National format
   */
  describe('National format', () => {
    it('Should format value in national when mode is national', async () => {
      const { container } = render(<Comp mode="national" country="VN" />)

      const input = container.querySelector('input')

      if (!input) {
        throw new Error('input is not a valid element.')
      }

      expect(container.querySelector('#VN')).toBeVisible()

      await act(async () => {
        input.focus()
        await user.keyboard('{1},{2},{3}')
      })

      // Should be treated as VN number +84 123 since country detector has been disabled.
      expect(input.getAttribute('value')).toBe('1 23')

      expect(container.querySelector('#VN')).toBeVisible()
    })

    it('Should only allow national phone number character', async () => {
      const { container } = render(<Comp mode="national" country="VN" />)

      const input = container.querySelector('input')

      if (!input) {
        throw new Error('input is not a valid element.')
      }

      expect(container.querySelector('#VN')).toBeVisible()

      await act(async () => {
        input.focus()
        await user.keyboard('{+},{1},{2},{3}')
      })

      expect(input.getAttribute('value')).toBe('1 23')

      expect(container.querySelector('#VN')).toBeVisible()
    })

    it('Should only trigger change event when value is actually changed', async () => {
      const onChange = vitest.fn()
      const { container } = render(
        <Comp defaultCountry="VN" onChange={onChange} />,
      )
      const input = container.querySelector('input')

      if (!input) {
        throw new Error('input is not a valid element.')
      }

      expect(container.querySelector('#VN')).toBeVisible()

      await act(async () => {
        input.focus()
        await user.keyboard('{+},{1},{2},{3}')
      })

      expect(input.getAttribute('value')).toBe('+1 23')
      expect(onChange).toHaveBeenCalledTimes(4) // Since user has typed 4 times

      await act(async () => {
        input.focus()
        await user.keyboard('{a}{b}{c}')
      })

      expect(input.getAttribute('value')).toBe('+1 23')
      expect(onChange).toHaveBeenCalledTimes(4) // OnChange event shouldn't be triggered since user entered invalid letters.
    })
  })

  /**
   * Fixed country
   */
  describe('Fixed country code', () => {
    it('Should disable country detection when country is passed', async () => {
      const onChange = vitest.fn()
      const { container } = render(<Comp country="VN" onChange={onChange} />)
      const input = container.querySelector('input')

      if (!input) {
        throw new Error('input is not a valid element.')
      }

      expect(container.querySelector('#VN')).toBeVisible()

      await act(async () => {
        input.focus()
        await user.keyboard('{+},{1},{2},{3}')
      })

      expect(input.getAttribute('value')).toBe('+84 123')

      expect(container.querySelector('#VN')).toBeVisible()
    })

    it('Should keep passed country and format as national', async () => {
      const onChange = vitest.fn()
      const { container } = render(
        <Comp country="VN" mode="national" onChange={onChange} />,
      )
      const input = container.querySelector('input')

      if (!input) {
        throw new Error('input is not a valid element.')
      }

      expect(container.querySelector('#VN')).toBeVisible()

      await act(async () => {
        input.focus()
        await user.keyboard('{+},{1},{2},{3}')
      })

      expect(input.getAttribute('value')).toBe('1 23')

      expect(container.querySelector('#VN')).toBeVisible()
    })
  })

  /**
   * Paste event
   */
  describe('Paste event', () => {
    it('Should parse value on paste', async () => {
      const onChange = vitest.fn()
      const { container } = render(<Comp onChange={onChange} />)
      const input = container.querySelector('input')

      if (!input) {
        throw new Error('input is not a valid element.')
      }

      await act(async () => {
        input.focus()
        await user.paste('+84522369680')
      })

      expect(input.getAttribute('value')).toBe('+84 522 369 680')

      expect(container.querySelector('#VN')).toBeVisible()

      expect(onChange.mock.calls[0][1]).toEqual({
        country: 'VN',
        e164Value: '+84522369680',
        formattedValue: '+84 522 369 680',
        isPossible: true,
        isSupported: true,
        isValid: true,
        phoneCode: '84',
      })
    })

    it('Should parse value on paste - national format', async () => {
      const onChange = vitest.fn()
      const { container } = render(<Comp mode="national" onChange={onChange} />)
      const input = container.querySelector('input')

      if (!input) {
        throw new Error('input is not a valid element.')
      }

      await act(async () => {
        input.focus()
        await user.paste('+1 472 248 2233')
      })

      expect(input.getAttribute('value')).toBe('(472) 248-2233')

      expect(container.querySelector('#US')).toBeVisible()

      expect(onChange.mock.calls[0][1]).toEqual({
        country: 'US',
        e164Value: '+14722482233',
        formattedValue: '(472) 248-2233',
        isPossible: true,
        isSupported: true,
        isValid: true,
        phoneCode: '1',
      })
    })

    it('Should detect country', async () => {
      const onChange = vitest.fn()
      const { container } = render(<Comp onChange={onChange} />)
      const input = container.querySelector('input')

      if (!input) {
        throw new Error('input is not a valid element.')
      }

      await act(async () => {
        input.focus()
        await user.paste('+84522369680')
      })

      expect(input.getAttribute('value')).toBe('+84 522 369 680')

      expect(container.querySelector('#VN')).toBeVisible()

      await act(async () => {
        input.focus()
        await user.keyboard('{Control>}A{/Control}{Backspace}')
      })

      expect(input.getAttribute('value')).toBe('')
      expect(container.querySelector('#VN')).toBeVisible()

      await act(async () => {
        input.focus()
        await user.paste('+15052269363')
      })

      expect(input.getAttribute('value')).toBe('+1 505 226 9363')
      expect(container.querySelector('#US')).toBeVisible()
      expect(onChange.mock.calls[2][1]).toEqual({
        country: 'US',
        e164Value: '+15052269363',
        formattedValue: '+1 505 226 9363',
        isPossible: true,
        isSupported: true,
        isValid: true,
        phoneCode: '1',
      })
    })

    it('Should detect country and parse in national format', async () => {
      const onChange = vitest.fn()
      const { container } = render(<Comp mode="national" onChange={onChange} />)
      const input = container.querySelector('input')

      if (!input) {
        throw new Error('input is not a valid element.')
      }

      await act(async () => {
        input.focus()
        await user.paste('+84522369680')
      })

      expect(input.getAttribute('value')).toBe('522 369 680')

      expect(container.querySelector('#VN')).toBeVisible()

      await act(async () => {
        input.focus()
        await user.keyboard('{Control>}A{/Control}{Backspace}')
      })

      expect(input.getAttribute('value')).toBe('')
      expect(container.querySelector('#VN')).toBeVisible()

      await act(async () => {
        input.focus()
        await user.paste('+15052269363')
      })

      expect(input.getAttribute('value')).toBe('(505) 226-9363')
      expect(container.querySelector('#US')).toBeVisible()
      expect(onChange.mock.calls[2][1]).toEqual({
        country: 'US',
        e164Value: '+15052269363',
        formattedValue: '(505) 226-9363',
        isPossible: true,
        isSupported: true,
        isValid: true,
        phoneCode: '1',
      })
    })
  })
})
