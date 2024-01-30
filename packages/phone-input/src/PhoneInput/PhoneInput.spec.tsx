import { PhoneInput } from './PhoneInput'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'

const user = userEvent.setup({
  delay: 300,
})

const Comp = () => {
  return (
    <div id="container">
      <PhoneInput />
    </div>
  )
}

describe('PhoneInput', () => {
  it('should render phone input', async () => {
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

  it('should show country select', async () => {
    const { container } = render(<Comp />)

    const input = container.querySelector('input')
    const countrySelect = container.querySelector('button')

    if (!input || !countrySelect) {
      throw new Error('input is not a valid element.')
    }

    await act(async () => {
      await user.click(countrySelect)
    })

    expect(
      container.querySelector('ul[class*=selectList]')?.parentElement,
    ).toBeVisible()
  })

  it('should close country select when click outside', async () => {
    const { container } = render(<Comp />)

    const input = container.querySelector('input')
    const countrySelect = container.querySelector('div[class*=countrySelect]')

    if (!input || !countrySelect) {
      throw new Error('input is not a valid element.')
    }

    await act(async () => {
      await user.click(countrySelect)
    })

    expect(
      container.querySelector('ul[class*=selectList]')?.parentElement,
    ).toBeVisible()

    await act(async () => {
      await user.click(input)
    })

    expect(
      container
        .querySelector('ul[class*=selectList]')
        ?.parentElement?.classList.value.includes('hidden'),
    ).toBe(true)
  })

  it('should close the country select when click on country option', async () => {
    const { container } = render(<Comp />)

    const input = container.querySelector('input')
    const countrySelect = container.querySelector('div[class*=countrySelect]')
    const opt = container.querySelector('li')

    if (!input || !countrySelect || !opt) {
      throw new Error('input is not a valid element.')
    }

    await act(async () => {
      await user.click(countrySelect)
    })

    expect(
      container.querySelector('ul[class*=selectList]')?.parentElement,
    ).toBeVisible()

    await act(async () => {
      await user.click(opt)
    })

    expect(
      container
        .querySelector('ul[class*=selectList]')
        ?.parentElement?.classList.value.includes('hidden'),
    ).toBe(true)
  })
})
