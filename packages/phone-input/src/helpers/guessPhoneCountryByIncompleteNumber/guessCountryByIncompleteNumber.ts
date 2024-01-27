import { AsYouType, CountryCode } from 'libphonenumber-js'
import { getPossibleCountriesByCallingCode } from '../getPossibleCountriesByCallingCode/getPossibleCountriesByCallingCode'
import { formatInternational } from '../formatInternational/formatInternational'

const asYouType = new AsYouType()

/**
 * @description guessCountryByIncompleteNumber will guess the possible country by the provided incomplete phone number. It only cares the country calling code and ignore the rest
 *
 */
export const guessCountryByIncompleteNumber = (
  value: string,
): CountryCode | undefined => {
  const internationalValue = formatInternational(value)
  const possibleCountries =
    getPossibleCountriesByCallingCode(internationalValue)
  asYouType.reset()
  asYouType.input(internationalValue)
  const possibleCountry = asYouType.getCountry()

  if (!possibleCountry) return possibleCountries[0]

  return possibleCountry
}
