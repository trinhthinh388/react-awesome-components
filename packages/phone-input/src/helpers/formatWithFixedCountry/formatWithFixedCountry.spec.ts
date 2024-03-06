import { formatWithFixedCountry } from './formatWithFixedCountry'

describe('formatWithFixedCountry', () => {
  it('Should return empty string when phone value is invalid', () => {
    expect(formatWithFixedCountry('', 'US')).toBe('')
  })

  it('Should leave as-is when the value is already has valid country code.', () => {
    expect(formatWithFixedCountry('+123456', 'US')).toBe('+123456')
  })

  it('Should format to the correct country code.', () => {
    expect(formatWithFixedCountry('+123456', 'VN')).toBe('+84123456')
    expect(formatWithFixedCountry('0123456', 'VN')).toBe('+84123456')
    expect(formatWithFixedCountry('123456', 'VN')).toBe('+84123456')
  })
})
