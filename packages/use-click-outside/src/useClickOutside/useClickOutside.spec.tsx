import { render, act } from '@testing-library/react'
import { useClickOutside } from './useClickOutside'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

const Comp = () => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const [isOutside, setIsOutside] = useState<boolean>(true)

  useClickOutside(ref, () => {
    setIsOutside(false)
  })

  return (
    <div id="outter">
      <div ref={setRef} id="inner" onClick={() => setIsOutside(true)} />
      <div id="result">{JSON.stringify(isOutside)}</div>
    </div>
  )
}

const CompWithoutCallback = () => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const [isOutside, setIsOutside] = useState<boolean>(true)

  useClickOutside(ref)

  return (
    <div id="outter">
      <div ref={setRef} id="inner" onClick={() => setIsOutside(true)} />
      <div id="result">{JSON.stringify(isOutside)}</div>
    </div>
  )
}

describe('useClickOutside', () => {
  it('Should trigger callback when click outside', async () => {
    const { container } = render(<Comp />)

    const result = container.querySelector('#result')
    const outter = container.querySelector('#outter')
    const inner = container.querySelector('#inner')

    if (!result || !outter || !inner) {
      throw new Error('cannot query elements')
    }

    expect(result?.textContent).toBe('true')

    await act(async () => {
      await user.click(outter)
    })

    expect(result?.textContent).toBe('false')

    await act(async () => {
      await user.click(inner)
    })

    expect(result?.textContent).toBe('true')
  })

  it('Shoud do noting when no callback is provided', async () => {
    const { container } = render(<CompWithoutCallback />)

    const result = container.querySelector('#result')
    const outter = container.querySelector('#outter')
    const inner = container.querySelector('#inner')

    if (!result || !outter || !inner) {
      throw new Error('cannot query elements')
    }

    expect(result?.textContent).toBe('true')

    await act(async () => {
      await user.click(outter)
    })

    expect(result?.textContent).toBe('true') // Since no callback was provided
  })
})
