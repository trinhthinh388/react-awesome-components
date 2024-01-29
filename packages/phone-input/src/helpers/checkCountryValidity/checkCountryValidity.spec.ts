import { checkCountryValidity } from './checkCountryValidity'

describe('checkCountryValidity', () => {
  it('Should return true when country is supported', () => {
    expect(checkCountryValidity('US', ['US'])).toBe(true)
  })

  it('Should return false when country is not supported', () => {
    expect(checkCountryValidity('US', ['AU'])).toBe(false)
  })

  it('Should return true when country list is not provided', () => {
    expect(checkCountryValidity('US')).toBe(true)
  })

  it('Should return false when country list is an empty array', () => {
    expect(checkCountryValidity('US', [])).toBe(false)
  })
})
