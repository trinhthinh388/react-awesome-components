import * as React from 'react';
import { UsePhoneInput, usePhoneInput } from '../hooks/usePhoneInput';
import classNames from 'classnames';
import Flags from 'country-flag-icons/react/3x2';

import styles from './styles.module.scss';

export type PhoneInputProps = {
  inputComponent?: 'input';
  inputClassname?: string;
  selectClassname?: string;
  selectButtonClassname?: string;
  selectListClassname?: string;
  selectOptionClassname?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
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
  ...props
}: PhoneInputProps) => {
  const {
    register,
    selectedCountry,
    isSelectOpen,
    toggleCountrySelect,
    options,
  } = usePhoneInput({
    // onChange(e) {
    //   console.log(e);
    // },
    ...props,
  });

  const Options = React.useMemo(
    () => () => (
      <ul className={classNames(styles.selectList, selectListClassname)}>
        {options.map((opt) => {
          const Flag = Flags[opt.iso2];
          return (
            <li className={classNames(styles.selectOpt, selectOptionClassname)}>
              <Flag className={styles.flag} />
              <span className={styles.country}>{opt.name}</span>
              <span className={styles.phoneCode}>{`+${opt.phoneCode}`}</span>
            </li>
          );
        })}
      </ul>
    ),
    [options, selectListClassname, selectOptionClassname]
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
