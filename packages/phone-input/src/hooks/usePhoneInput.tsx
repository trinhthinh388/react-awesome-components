/* eslint-disable no-unused-vars */
import * as React from 'react'
import {
  getCountries,
  CountryCode as CCode,
  getCountryCallingCode,
  formatIncompletePhoneNumber,
  AsYouType,
} from 'libphonenumber-js'
import { usePreserveInputCaretPosition } from '@react-awesome/use-preserve-input-caret-position'
import {
  guessCountryByIncompleteNumber,
  formatInternational,
  checkCountryValidity,
} from '../helpers'

const DEFAULT_ALLOW_FORMAT = /^[+0-9][0-9]*$/

export type CountryCode = CCode

export type PhoneInputChangeMetadata = {
  isValid: boolean
  isPossible: boolean
  e164Value: string
  country: CountryCode
  phoneCode: string
  formattedValue: string
  /**
   * @description Whether this country is supported by the `supportedCountries` property or not
   */
  isSupported: boolean
}

export type UsePhoneInput = {
  /**
   * @description Phone value
   */
  value?: string
  /**
   * @description Supported countries
   */
  supportedCountries?: CountryCode[]
  /**
   * @description Default selected country
   */
  defaultCountry?: CountryCode
  /**
   * @description onChange handler.
   * The `ev` could be `undefined` when the event is triggered when user select another country.
   */
  onChange?: (
    ev: React.ChangeEvent<HTMLInputElement> | undefined,
    metadata: PhoneInputChangeMetadata,
  ) => void
  /**
   * @description Turn on/off guessing country on change.
   */
  guessCountryOnChange?: boolean
  /**
   * @description - use smart caret
   */
  smartCaret?: boolean
}

export const usePhoneInput = ({
  value,
  supportedCountries,
  defaultCountry,
  onChange: onPhoneChange = () => {},
  guessOn = 'change',
  smartCaret = true,
}: UsePhoneInput = {}) => {
  /**
   * Refs
   */
  const asYouType = React.useRef<AsYouType>(new AsYouType(defaultCountry))

  /**
   * States
   */
  const [inputRef, setInputRef] = React.useState<HTMLInputElement | null>(null)
  const [innerValue, setInnerValue] = React.useState<
    NonNullable<{ phone: string; country: CountryCode }>
  >(() => {
    const getInitialCountry = () => {
      const countryList = getCountries()
      if (defaultCountry) return defaultCountry
      if (
        !defaultCountry &&
        supportedCountries &&
        Array.isArray(supportedCountries) &&
        supportedCountries.length > 0
      )
        return supportedCountries[0]

      return countryList[0]
    }

    return {
      phone: value || '',
      country: getInitialCountry(),
    }
  })
  const [isSelectOpen, setSelectOpen] = React.useState<boolean>(false)

  if (smartCaret) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePreserveInputCaretPosition(inputRef, {
      delimiters: ['+', ' ', '(', ')', '-'],
    })
  }

  /**
   * Memo
   */
  const options = React.useMemo(() => {
    const _c = getCountries()
    const getCountryName = (code: CountryCode) =>
      new Intl.DisplayNames(['en'], { type: 'region' }).of(code)
    const genCountryOpts = (_countries: CountryCode[]) =>
      _countries.map((_c) => ({
        iso2: _c,
        name: getCountryName(_c),
        phoneCode: getCountryCallingCode(_c),
      }))
    if (!Array.isArray(supportedCountries)) return genCountryOpts(_c)

    return genCountryOpts(_c.filter((c) => supportedCountries.includes(c)))
  }, [supportedCountries])

  /**
   * Helpers
   */
  const guessCountry = React.useCallback(
    (value: string) => {
      if (!guessOn) return
      return guessCountryByIncompleteNumber(value)
    },
    [guessOn],
  )
  const openCountrySelect = React.useCallback(() => setSelectOpen(true), [])
  const closeCountrySelect = React.useCallback(() => setSelectOpen(false), [])
  const toggleCountrySelect = React.useCallback(
    (state?: boolean) => setSelectOpen(state ? state : (prev) => !prev),
    [],
  )
  const generateMetadata = React.useCallback(
    (value: string, currentCountry: CountryCode): PhoneInputChangeMetadata => {
      const _value = formatInternational(value)
      const guessedCountry = guessCountry(_value) || currentCountry
      const isSupported = checkCountryValidity(
        guessedCountry,
        supportedCountries,
      )
      // If country is not supported country then return the defaultCountry or the first country in the option list.
      const country = isSupported
        ? guessedCountry
        : defaultCountry || options[0].iso2
      const formattedValue = formatIncompletePhoneNumber(value, country)

      return {
        isPossible: asYouType.current.isPossible(),
        isValid: asYouType.current.isValid(),
        e164Value: asYouType.current.getNumber()?.format('E.164') || '',
        country,
        phoneCode:
          asYouType.current.getCallingCode() || getCountryCallingCode(country),
        formattedValue,
        isSupported,
      }
    },
    [defaultCountry, guessCountry, options, supportedCountries],
  )
  const setSelectedCountry = React.useCallback(
    (country: CountryCode) => {
      const metadata = generateMetadata('', country)
      onPhoneChange(undefined, metadata)
      setInnerValue((prev) => ({
        ...prev,
        country,
        phone: '',
      }))
      closeCountrySelect()
    },
    [closeCountrySelect, generateMetadata, onPhoneChange],
  )

  /**
   * Event Handlers
   */
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // format raw value and assign back to the event target
      e.target.value = formatInternational(e.target.value)

      if (DEFAULT_ALLOW_FORMAT.test(e.target.value) || e.target.value === '') {
        asYouType.current.reset()
        asYouType.current.input(e.target.value)

        const metadata = generateMetadata(e.target.value, innerValue.country)

        e.target.value = metadata.formattedValue

        onPhoneChange(e, metadata)

        setInnerValue((prev) => ({
          ...prev,
          country: metadata.country,
          phone: metadata.formattedValue,
        }))
      }
    },
    [generateMetadata, innerValue.country, onPhoneChange],
  )

  const register = React.useCallback(
    (
      name?: string,
    ): Pick<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      'ref' | 'name' | 'type' | 'autoComplete' | 'value' | 'onChange'
    > => {
      return {
        ref: setInputRef,
        name,
        value: innerValue.phone,
        onChange,
        type: 'tel',
        autoComplete: 'tel',
      }
    },
    [innerValue.phone, onChange],
  )

  /**
   * Effects
   */
  React.useEffect(() => {
    asYouType.current = new AsYouType(innerValue.country)
  }, [innerValue.country])

  React.useEffect(() => {
    if (!value) return
    if (value !== innerValue.phone) {
      setInnerValue((prev) => ({
        ...prev,
        phone: value,
      }))
    }
  }, [innerValue, onPhoneChange, value])

  return {
    inputEl: inputRef,
    register,
    options,
    isSelectOpen,
    openCountrySelect,
    closeCountrySelect,
    toggleCountrySelect,
    selectedCountry: innerValue.country,
    phoneCode: getCountryCallingCode(innerValue.country),
    setSelectedCountry,
  }
}
