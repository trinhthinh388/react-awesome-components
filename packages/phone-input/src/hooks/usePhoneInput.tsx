/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  getCountries,
  CountryCode,
  getCountryCallingCode,
  formatIncompletePhoneNumber,
  AsYouType,
} from 'libphonenumber-js';
import {
  guessCountryByIncompleteNumber,
  formatInternational,
} from '../helpers';

const DEFAULT_ALLOW_CHARACTERS = /^[+0-9][0-9]*$/;

export type PhoneInputChangeEvent = {
  isValid: boolean;
  isPossible: boolean;
  possibleCountry?: CountryCode;
  originalValue: string;
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
  supportedCountries?: CountryCode[];
  /**
   * @description Default selected country
   */
  defaultCountry?: CountryCode;
  /**
   * @description onChange handler
   */
  onChange?: (ev: PhoneInputChangeEvent) => void;
  /**
   * @description Specify event to guess the country on.
   */
  guessOn?: 'blur' | 'change' | boolean;
};

export const usePhoneInput = ({
  value,
  supportedCountries,
  defaultCountry,
  onChange: onPhoneChange = () => {},
  guessOn = 'change',
}: UsePhoneInput = {}) => {
  const asYouType = React.useRef<AsYouType>(new AsYouType(defaultCountry));
  const originalValue = React.useRef<string>('');
  const [inputRef, setInputRef] = React.useState<HTMLInputElement | null>(null);
  const [innerValue, setInnerValue] = React.useState<
    NonNullable<{ phone: string; country: CountryCode }>
  >(() => {
    const getInitialCountry = () => {
      const countryList = getCountries();
      if (defaultCountry) return defaultCountry;
      if (
        !defaultCountry &&
        supportedCountries &&
        Array.isArray(supportedCountries) &&
        supportedCountries.length > 0
      )
        return supportedCountries[0];

      return countryList[0];
    };

    return {
      phone: value || '',
      country: getInitialCountry(),
    };
  });
  const [isSelectOpen, setSelectOpen] = React.useState<boolean>(false);

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
    if (!Array.isArray(supportedCountries)) return genCountryOpts(_c);

    return genCountryOpts(_c.filter((c) => supportedCountries.includes(c)));
  }, [supportedCountries]);

  const guessCountry = React.useCallback(
    (value: string) => {
      if (!guessOn) return;
      return guessCountryByIncompleteNumber(value);
    },
    [guessOn]
  );
  const openCountrySelect = React.useCallback(() => setSelectOpen(true), []);
  const closeCountrySelect = React.useCallback(() => setSelectOpen(false), []);
  const toggleCountrySelect = React.useCallback(
    (state?: boolean) => setSelectOpen(state ? state : (prev) => !prev),
    []
  );
  const formatPhoneEvent = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): PhoneInputChangeEvent => {
      const _value = formatInternational(e.target.value);
      const guessedCountry = guessCountry(_value);
      const country = guessedCountry || innerValue.country;

      return {
        ...e,
        target: {
          ...e.target,
          value: formatIncompletePhoneNumber(_value, {
            defaultCountry: country,
          }),
        },
        originalValue: originalValue.current,
        isPossible: asYouType.current.isPossible(),
        isValid: asYouType.current.isValid(),
        e164Value: asYouType.current.getNumber()?.format('E.164') || '',
        possibleCountry: asYouType.current.country,
        country,
        phoneCode:
          asYouType.current.getCallingCode() || getCountryCallingCode(country),
      };
    },
    [guessCountry, innerValue.country]
  );
  const [caret, setCaret] = React.useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  /**
   * Event Handlers
   */
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const start = e.target.selectionStart || 0;
      const end = e.target.selectionEnd || 0;

      setCaret({
        start,
        end,
      });

      e.target.value = formatInternational(e.target.value);

      if (
        DEFAULT_ALLOW_CHARACTERS.test(e.target.value) ||
        e.target.value === ''
      ) {
        asYouType.current.reset();
        asYouType.current.input(e.target.value);

        const event = formatPhoneEvent(e);

        onPhoneChange(event);

        setInnerValue((prev) => ({
          ...prev,
          country: event.country,
          phone: event.target.value,
        }));
      }
    },
    [formatPhoneEvent, onPhoneChange]
  );

  const register = React.useCallback(
    (
      name?: string
    ): React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    > => {
      return {
        ref: setInputRef,
        name,
        value: innerValue.phone,
        onChange,
        type: 'tel',
        autoComplete: 'tel',
      };
    },
    [innerValue.phone, onChange]
  );

  React.useEffect(() => {
    asYouType.current = new AsYouType(innerValue.country);
  }, [innerValue.country]);

  React.useEffect(() => {
    if (!value) return;
    if (value !== innerValue.phone) {
      setInnerValue((prev) => ({
        ...prev,
        phone: value,
      }));
    }
  }, [innerValue, value]);

  React.useEffect(() => {
    inputRef?.setSelectionRange(caret.start, caret.end);
  }, [caret.end, caret.start, innerValue.phone, inputRef]);

  return {
    register,
    options,
    isSelectOpen,
    openCountrySelect,
    closeCountrySelect,
    toggleCountrySelect,
    selectedCountry: innerValue.country,
  };
};
