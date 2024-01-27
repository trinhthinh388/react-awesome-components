import { it, expect, describe } from 'vitest'
import { guessCountryByIncompleteNumber } from './guessCountryByIncompleteNumber'

describe('guessPhoneCountry', () => {
  it('Should work', () => {
    expect(guessCountryByIncompleteNumber('1')).toBe('US')

    expect(guessCountryByIncompleteNumber('1 505')).toBe('US')
    expect(guessCountryByIncompleteNumber('+1 505')).toBe('US')

    expect(guessCountryByIncompleteNumber('1 684')).toBe('AS')
    expect(guessCountryByIncompleteNumber('+1684')).toBe('AS')
  })
})
