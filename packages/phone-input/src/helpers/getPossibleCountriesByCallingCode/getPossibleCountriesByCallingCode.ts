import countryData from 'libphonenumber-js/metadata.min.json'
import { formatInternational } from '../formatInternational/formatInternational'

export const getPossibleCountriesByCallingCode = (phoneValue: string) => {
  const cleanValue = formatInternational(phoneValue)

  if (!cleanValue) return []

  /**
   * Country Calling Code maximum length is 3.
   * P/s: Slice at 1 because the first character is always the plug sign (+).
   */
  const countriesHaveOneChars =
    countryData.country_calling_codes[cleanValue.slice(1, 2)] || []
  const countriesHaveTwoChars =
    countryData.country_calling_codes[cleanValue.slice(1, 3)] || []
  const countriesHaveThreeChars =
    countryData.country_calling_codes[cleanValue.slice(1, 4)] || []

  /**
   * Should prefer the best match with most characters
   */
  return Array.from(
    new Set([
      ...countriesHaveThreeChars,
      ...countriesHaveTwoChars,
      ...countriesHaveOneChars,
    ])
  )
}
