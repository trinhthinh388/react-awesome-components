import { formatNational } from './formatNational'

describe('formatNational', () => {
  it('Should leave as-is when the value is already in national format.', () => {
    expect(formatNational('+123456')).toBe('123456')
  })

  it('Should auto remove + sign.', () => {
    expect(formatNational('123456')).toBe('123456')
  })

  it('Should auto remove + sign and remove first 0 digit.', () => {
    expect(formatNational('0123456')).toBe('123456')
  })

  it('Should return empty string when input value is not valid', () => {
    expect(formatNational('')).toBe('')
  })
})
