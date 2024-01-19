import { usePrevious } from '@react-awesome/hooks';
import { useCallback, useRef, useState } from 'react';
import { usePhoneInput } from './usePhoneInput';

export type PhoneInputProps = {
  inputComponent?: 'input';
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const PhoneInput = ({
  inputComponent: Input = 'input',
  value,
}: PhoneInputProps) => {
  const { register } = usePhoneInput();

  return <Input {...register()} />;
};
