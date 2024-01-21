import { useCallback, useMemo, useState } from 'react';
import { getCountries, CountryCode } from 'libphonenumber-js';

const DEFAULT_ALLOW_CHARACTERS = /^[+0-9][0-9]*$/;

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
   * @description onChange handler
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const usePhoneInput = ({ value, countries }: UsePhoneInput = {}) => {
  const [innerValue, setInnerValue] = useState<string>('');

  const options = useMemo(() => {
    const _c = getCountries();
    if (!Array.isArray(countries)) return _c;

    return _c.filter((c) => countries.includes(c));
  }, [countries]);

  /**
   * Event Handlers
   */
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (DEFAULT_ALLOW_CHARACTERS.test(e.target.value) || e.target.value === '')
      setInnerValue(e.target.value);
  }, []);

  const register = useCallback(
    (name?: string) => {
      return {
        name,
        value: value || innerValue,
        onChange,
        type: 'tel',
        autocomplete: 'tel',
      };
    },
    [innerValue, onChange, value]
  );

  return {
    register,
    options,
  };
};
