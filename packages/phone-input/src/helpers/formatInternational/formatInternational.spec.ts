import { formatInternational } from './formatInternational'

describe('formatInternational', () => {
  it('Should return empty string when input value is not valid', () => {
    expect(formatInternational('')).toBe('')
  })

  it('Should leave as-is when the value is already in international format.', () => {
    expect(formatInternational('+123456')).toBe('+123456')
  })

  it('Should auto append + sign.', () => {
    expect(formatInternational('123456')).toBe('+123456')
  })

  it('Should auto append + sign and remove first 0 digit.', () => {
    expect(formatInternational('0123456')).toBe('+123456')
  })
})
