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
  formatNational,
  formatWithFixedCountry,
  checkCountryValidity,
} from '../helpers'

const INTERNATIONAL_FORMAT = /^[+0-9][0-9]*$/
const LOCAL_FORMAT = /^[0-9][0-9]*$/

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
   * @description - use smart caret
   */
  smartCaret?: boolean
  /**
   * @description - Phone input mode.
   * If mode is `local` then the country code won't be included in the phone value and user must follow the country is currently being selected.
   * @default "international"
   */
  mode?: 'international' | 'national'
  /**
   * @description - Country code
   * If `country` is provided, the auto detect country will be disabled.
   */
  country?: CountryCode
}

export const usePhoneInput = ({
  value,
  supportedCountries,
  defaultCountry,
  onChange: onPhoneChange = () => {},
  smartCaret = true,
  mode = 'international',
  country,
}: UsePhoneInput = {}) => {
  /**
   * Refs
   */
  const asYouType = React.useRef<AsYouType>(new AsYouType(defaultCountry))
  const isPasted = React.useRef<boolean>(false)
  /**
   * States
   */
  const [inputRef, setInputRef] = React.useState<HTMLInputElement | null>(null)
  const [isSelectOpen, setSelectOpen] = React.useState<boolean>(false)
  const [innerValue, setInnerValue] = React.useState<string>('')

  const currentCountryCodeRef = React.useRef<CountryCode>(
    (() => {
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
    })(),
  )

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
  const normalizeValue = React.useCallback(
    (phone: string) => {
      if (country && mode === 'national') {
        return formatWithFixedCountry(phone, country).replace(
          '+' + getCountryCallingCode(country),
          '',
        )
      }

      if (country) return formatWithFixedCountry(phone, country)

      switch (mode) {
        case 'international':
          return formatInternational(phone)
        case 'national':
          return formatNational(phone)
        default:
          return phone
      }
    },
    [country, mode],
  )
  const guessCountry = React.useCallback(
    (value: string) => {
      /**
       * When country is passed, the guessCountry is disabled.
       */
      if (country) return country

      /**
       * When mode is `national`, country should be parsed based on the current selected country
       */
      if (mode === 'national' && currentCountryCodeRef.current)
        return currentCountryCodeRef.current

      return guessCountryByIncompleteNumber(value)
    },
    [country, mode],
  )
  const openCountrySelect = React.useCallback(() => setSelectOpen(true), [])
  const closeCountrySelect = React.useCallback(() => setSelectOpen(false), [])
  const toggleCountrySelect = React.useCallback(
    (state?: boolean) => setSelectOpen(state ? state : (prev) => !prev),
    [],
  )
  const generateMetadata = React.useCallback(
    (value: string): PhoneInputChangeMetadata => {
      const guessedCountry =
        guessCountry(value) || currentCountryCodeRef.current

      const isSupported = checkCountryValidity(
        guessedCountry,
        supportedCountries,
      )

      // If country is not supported country then return the defaultCountry or the first country in the option list.
      const country = isSupported
        ? guessedCountry
        : defaultCountry || options[0].iso2

      /**
       * Reset asYouType to the latest country and parse from it.
       */
      asYouType.current = new AsYouType(country)
      asYouType.current.reset()
      asYouType.current.input(value)

      const phoneCode =
        asYouType.current.getCallingCode() || getCountryCallingCode(country)
      let formattedValue = formatIncompletePhoneNumber(value, country)

      /**
       * Since input value in national format won't include the country code so we have to manually append it.
       */
      if (mode === 'national') {
        formattedValue = formatIncompletePhoneNumber(
          `${phoneCode}${value}`,
          country,
        )
        formattedValue = formattedValue.replace(phoneCode, '').trim()
      }

      return {
        isPossible: asYouType.current.isPossible(),
        isValid: asYouType.current.isValid(),
        e164Value:
          asYouType.current.getNumber()?.format('E.164', {
            fromCountry: country,
          }) || '',
        country,
        phoneCode,
        formattedValue,
        isSupported,
      }
    },
    [defaultCountry, guessCountry, mode, options, supportedCountries],
  )
  const setSelectedCountry = React.useCallback(
    (country: CountryCode) => {
      currentCountryCodeRef.current = country
      const metadata = generateMetadata('')
      onPhoneChange(undefined, metadata)
      setInnerValue('')
      closeCountrySelect()
    },
    [closeCountrySelect, generateMetadata, onPhoneChange],
  )
  const handlePastedValue = React.useCallback(
    (value: string) => {
      if (isPasted.current && mode === 'national') {
        const asYouPaste = new AsYouType()
        asYouPaste.input(value)

        if (value.startsWith('+')) {
          const pastedCountry =
            asYouPaste.getCountry() || guessCountryByIncompleteNumber(value)

          /**
           * If `country` is passed and the pasted country is not equal then return empty string.
           */
          if (country && country !== pastedCountry) return value.slice(1)

          if (pastedCountry) {
            asYouType.current = new AsYouType(pastedCountry)
            currentCountryCodeRef.current = pastedCountry
            return value.replace(`+${getCountryCallingCode(pastedCountry)}`, '')
          }
        } else if (value.startsWith('0')) {
          return value.slice(1)
        }

        isPasted.current = false
      }

      return value
    },
    [country, isPasted, mode],
  )

  /**
   * Event Handlers
   */
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const allowFormat =
        mode === 'international' ? INTERNATIONAL_FORMAT : LOCAL_FORMAT

      // format raw value and assign back to the event target
      e.target.value = normalizeValue(handlePastedValue(e.target.value))

      if (e.target.value === normalizeValue(innerValue)) return

      if (allowFormat.test(e.target.value) || e.target.value === '') {
        const metadata = generateMetadata(e.target.value)

        e.target.value = metadata.formattedValue

        onPhoneChange(e, metadata)

        currentCountryCodeRef.current = metadata.country
        setInnerValue(metadata.formattedValue)
      }
    },
    [
      generateMetadata,
      handlePastedValue,
      innerValue,
      mode,
      normalizeValue,
      onPhoneChange,
    ],
  )

  const onPaste = React.useCallback(() => {
    isPasted.current = true
  }, [])

  const register = React.useCallback(
    (
      name?: string,
    ): Pick<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      | 'ref'
      | 'name'
      | 'type'
      | 'autoComplete'
      | 'value'
      | 'onChange'
      | 'onPaste'
    > => {
      return {
        ref: setInputRef,
        name,
        value: innerValue,
        onChange,
        onPaste,
        type: 'tel',
        autoComplete: 'tel',
      }
    },
    [innerValue, onChange, onPaste],
  )

  /**
   * Effects
   */
  React.useEffect(() => {
    if (country && country !== currentCountryCodeRef.current) {
      setSelectedCountry(country)
    }
  }, [country, setSelectedCountry])

  React.useEffect(() => {
    if (!value) return
    if (value !== innerValue) {
      const metadata = generateMetadata(value)
      onPhoneChange(undefined, metadata)
      setInnerValue(value)
    }
  }, [generateMetadata, innerValue, onPhoneChange, value])

  return {
    inputEl: inputRef,
    register,
    options,
    isSelectOpen,
    openCountrySelect,
    closeCountrySelect,
    toggleCountrySelect,
    selectedCountry: currentCountryCodeRef.current,
    phoneCode: getCountryCallingCode(currentCountryCodeRef.current),
    setSelectedCountry,
  }
}
