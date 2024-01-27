import * as React from 'react'
import { UsePhoneInput, usePhoneInput } from '../hooks/usePhoneInput'
import { useClickOutside } from '@react-awesome/hooks'
import classNames from 'classnames'
import Flags from 'country-flag-icons/react/3x2'

import styles from './styles.module.scss'
import '../styles/global.scss'

export type PhoneInputProps = {
  inputComponent?: 'input'
  inputClassname?: string
  selectClassname?: string
  selectButtonClassname?: string
  selectListClassname?: string
  selectOptionClassname?: string
  showCountrySelect?: boolean
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'onChange'
> &
  UsePhoneInput

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
  showCountrySelect = true,
  ...props
}: PhoneInputProps) => {
  const countrySelectPane = React.useRef<HTMLDivElement>(null)
  const {
    options,
    register,
    selectedCountry,
    isSelectOpen,
    toggleCountrySelect,
    setSelectedCountry,
    closeCountrySelect,
  } = usePhoneInput({
    onChange,
    defaultCountry,
    supportedCountries,
    smartCaret,
    ...props,
  })

  useClickOutside(countrySelectPane.current, () => {
    closeCountrySelect()
  })

  const Options = React.useMemo(
    () => () => (
      <ul className={classNames(styles.selectList, selectListClassname)}>
        {options.map((opt) => {
          const Flag = Flags[opt.iso2]
          return (
            <li
              key={opt.iso2}
              className={classNames(styles.selectOpt, selectOptionClassname)}
              onClick={() => setSelectedCountry(opt.iso2)}
            >
              <Flag className={styles.flag} />
              <span suppressHydrationWarning className={styles.country}>
                {opt.name}
              </span>
              <span className={styles.phoneCode}>{`+${opt.phoneCode}`}</span>
            </li>
          )
        })}
      </ul>
    ),
    [options, selectListClassname, selectOptionClassname, setSelectedCountry],
  )

  const SelectedFlag = Flags[selectedCountry]

  return (
    <div
      className={classNames(
        styles.container,
        { [styles.containerWithoutCountrySelect]: !showCountrySelect },
        className,
      )}
    >
      {showCountrySelect && (
        <div
          ref={countrySelectPane}
          className={classNames(styles.countrySelect, selectClassname)}
        >
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
          <div className={classNames({ [styles.hidden]: !isSelectOpen })}>
            <Options />
          </div>
        </div>
      )}
      <Input
        className={classNames(
          styles.input,
          { [styles.inputWithoutCountrySelect]: !showCountrySelect },
          inputClassname,
        )}
        {...register(name)}
        {...props}
      />
    </div>
  )
}
