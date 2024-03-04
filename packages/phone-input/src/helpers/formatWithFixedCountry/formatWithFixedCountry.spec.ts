import { formatWithFixedCountry } from './formatWithFixedCountry'

describe('formatWithFixedCountry', () => {
  it('Should leave as-is when the value is already has valid country code.', () => {
    expect(formatWithFixedCountry('+123456', 'US')).toBe('+123456')
  })

  it('Should format to the correct country code.', () => {
    expect(formatWithFixedCountry('+123456', 'VN')).toBe('+84123456')
  })
})
