/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  getCountries,
  CountryCode,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  formatIncompletePhoneNumber,
  parseIncompletePhoneNumber,
  AsYouType,
} from 'libphonenumber-js';
import { useSelectionRange } from '@react-awesome/hooks';

const DEFAULT_ALLOW_CHARACTERS = /^[+0-9][0-9]*$/;

export type PhoneInputChangeEvent = {
  isValid: boolean;
  isPossible: boolean;
  possibleCountry?: CountryCode;
  originalValue: string;
  formattedValue: string;
  e164Value: string;
  country: CountryCode;
  phoneCode: string;
} & React.ChangeEvent<HTMLInputElement>;

export type UsePhoneInput = {
  /**
   * @description Phone value
   */
  value?: string;
  /**
   * @description Supported countries
   */
  countries?: CountryCode[];
  /**
   * @description Default selected country
   */
  defaultCountry?: CountryCode;
  /**
   * @description onChange handler
   */
  onChange?: (ev: PhoneInputChangeEvent) => void;
  /**
   * @description Automatically append `+` at the beginning of the input value.
   */
  autoAppendPlusSign?: boolean;
  /**
   * @description Specify event to guess the country on.
   */
  guessOn?: 'blur' | 'change';
};

export const usePhoneInput = ({
  value,
  countries,
  defaultCountry,
  onChange: onPhoneChange = () => {},
  autoAppendPlusSign = true,
  guessOn = 'change',
}: UsePhoneInput = {}) => {
  const asYouType = React.useRef<AsYouType>(new AsYouType(defaultCountry));
  const originalValue = React.useRef<string>('');
  const [inputRef, setInputRef] = React.useState<HTMLInputElement | null>(null);
  const [innerValue, setInnerValue] = React.useState<string>('');
  const [isSelectOpen, setSelectOpen] = React.useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = React.useState<CountryCode>(
    () => {
      const countryList = getCountries();
      if (defaultCountry) return defaultCountry;
      if (
        !defaultCountry &&
        countries &&
        Array.isArray(countries) &&
        countries.length > 0
      )
        return countries[0];

      return countryList[0];
    }
  );
  const selectionRange = useSelectionRange(inputRef);

  const options = React.useMemo(() => {
    const _c = getCountries();
    const getCountryName = (code: CountryCode) =>
      new Intl.DisplayNames(['en'], { type: 'region' }).of(code);
    const genCountryOpts = (_countries: CountryCode[]) =>
      _countries.map((_c) => ({
        iso2: _c,
        name: getCountryName(_c),
        phoneCode: getCountryCallingCode(_c),
      }));
    if (!Array.isArray(countries)) return genCountryOpts(_c);

    return genCountryOpts(_c.filter((c) => countries.includes(c)));
  }, [countries]);

  const openCountrySelect = React.useCallback(() => setSelectOpen(true), []);
  const closeCountrySelect = React.useCallback(() => setSelectOpen(false), []);
  const toggleCountrySelect = React.useCallback(
    (state?: boolean) => setSelectOpen(state ? state : (prev) => !prev),
    []
  );
  const genPhoneEvent = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): PhoneInputChangeEvent => {
      const _value = parseIncompletePhoneNumber(e.target.value);
      const phone = parsePhoneNumberFromString(_value);
      return {
        ...e,
        originalValue: originalValue.current,
        isPossible: asYouType.current.isPossible(),
        isValid: asYouType.current.isValid(),
        formattedValue: phone?.format('INTERNATIONAL') || '',
        e164Value: phone?.format('E.164') || '',
        possibleCountry: asYouType.current.country,
        country: phone?.country || selectedCountry,
        phoneCode:
          phone?.countryCallingCode || getCountryCallingCode(selectedCountry),
      };
    },
    [selectedCountry]
  );
  const appendPlusSign = React.useCallback(
    (_value: string) => {
      if (!autoAppendPlusSign || _value === '') return _value;

      if (!_value.startsWith('+')) {
        return `+${_value}`;
      }

      return _value;
    },
    [autoAppendPlusSign]
  );

  /**
   * Event Handlers
   */
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = appendPlusSign(
        parseIncompletePhoneNumber(e.target.value)
      );

      if (
        DEFAULT_ALLOW_CHARACTERS.test(e.target.value) ||
        e.target.value === ''
      ) {
        asYouType.current.reset();
        asYouType.current.input(e.target.value);
        originalValue.current = e.target.value;
        setInnerValue(formatIncompletePhoneNumber(e.target.value));
        onPhoneChange(genPhoneEvent(e));
        return;
      }

      /**
       * Ensure the cursor must retain when the value is not valid.
       */
      queueMicrotask(() => {
        inputRef?.setSelectionRange(selectionRange.start, selectionRange.end);
      });
    },
    [
      appendPlusSign,
      genPhoneEvent,
      inputRef,
      onPhoneChange,
      selectionRange.end,
      selectionRange.start,
    ]
  );

  const register = React.useCallback(
    (name?: string) => {
      return {
        ref: setInputRef,
        name,
        value: value || innerValue,
        onChange,
        type: 'tel',
        autoComplete: 'tel',
      };
    },
    [innerValue, onChange, value]
  );

  React.useEffect(() => {
    asYouType.current = new AsYouType(selectedCountry);
  }, [selectedCountry]);

  return {
    register,
    options,
    isSelectOpen,
    openCountrySelect,
    closeCountrySelect,
    toggleCountrySelect,
    selectedCountry,
    setSelectedCountry,
  };
};
