import { CountryCode } from 'libphonenumber-js'

export const checkCountryValidity = (
  country: CountryCode | string,
  list?: CountryCode[]
) => {
  if (!list) return true
  return list.includes(country.toUpperCase() as CountryCode)
}
