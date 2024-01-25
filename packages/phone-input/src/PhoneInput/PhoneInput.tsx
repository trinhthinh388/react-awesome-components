import * as React from 'react';
import { UsePhoneInput, usePhoneInput } from '../hooks/usePhoneInput';
import classNames from 'classnames';
import Flags from 'country-flag-icons/react/3x2';

import styles from './styles.module.scss';
import '../styles/global.scss';

export type PhoneInputProps = {
  inputComponent?: 'input';
  inputClassname?: string;
  selectClassname?: string;
  selectButtonClassname?: string;
  selectListClassname?: string;
  selectOptionClassname?: string;
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'onChange'
> &
  UsePhoneInput;

export const PhoneInput = ({
  inputComponent: Input = 'input',
  name,
  inputClassname,
  selectClassname,
  selectButtonClassname,
  selectListClassname,
  selectOptionClassname,
  className,
  onChange,
  defaultCountry,
  supportedCountries,
  smartCaret,
  ...props
}: PhoneInputProps) => {
  const {
    options,
    register,
    selectedCountry,
    isSelectOpen,
    toggleCountrySelect,
    setSelectedCountry,
  } = usePhoneInput({
    onChange,
    defaultCountry,
    supportedCountries,
    smartCaret,
    ...props,
  });

  const Options = React.useMemo(
    () => () => (
      <ul className={classNames(styles.selectList, selectListClassname)}>
        {options.map((opt) => {
          const Flag = Flags[opt.iso2];
          return (
            <li
              key={opt.iso2}
              className={classNames(styles.selectOpt, selectOptionClassname)}
              onClick={() => setSelectedCountry(opt.iso2)}
            >
              <Flag className={styles.flag} />
              <span className={styles.country}>{opt.name}</span>
              <span className={styles.phoneCode}>{`+${opt.phoneCode}`}</span>
            </li>
          );
        })}
      </ul>
    ),
    [options, selectListClassname, selectOptionClassname, setSelectedCountry]
  );

  const SelectedFlag = Flags[selectedCountry];

  return (
    <div className={classNames(styles.container, className)}>
      <div className={classNames(styles.countrySelect, selectClassname)}>
        <button
          className={classNames(styles.selectBtn, selectButtonClassname)}
          onClick={() => toggleCountrySelect()}
        >
          <SelectedFlag className={styles.flag} />
          <i
            className={classNames(styles.chevronDown, {
              [styles.selectOpen]: isSelectOpen,
            })}
          />
        </button>
        {isSelectOpen && <Options />}
      </div>
      <Input
        className={classNames(styles.input, inputClassname)}
        {...register(name)}
        {...props}
      />
    </div>
  );
};
