import {
  CountryCode,
  getCountryCallingCode,
  parseIncompletePhoneNumber,
} from 'libphonenumber-js'

export const formatWithFixedCountry = (
  phoneValue: string,
  country: CountryCode,
) => {
  if (!phoneValue) return ''

  const prefix = `+${getCountryCallingCode(country)}`

  if (phoneValue.startsWith(prefix))
    return parseIncompletePhoneNumber(phoneValue)

  if (phoneValue.startsWith('+'))
    return `${prefix}${parseIncompletePhoneNumber(phoneValue.replace(/\+/g, ''))}`

  if (phoneValue.startsWith('0'))
    return `${prefix}${parseIncompletePhoneNumber(phoneValue.slice(1))}`

  return `${prefix}${parseIncompletePhoneNumber(phoneValue)}`
}
