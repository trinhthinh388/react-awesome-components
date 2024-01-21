import Flag from 'react-flagpack';
import { usePhoneInput } from './usePhoneInput';

export type PhoneInputProps = {
  inputComponent?: 'input';
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const PhoneInput = ({
  inputComponent: Input = 'input',
  name,
}: PhoneInputProps) => {
  const { register, options } = usePhoneInput();

  return (
    <div>
      <select name={name}>
        {options.map((opt) => (
          <option value={opt}>
            <Flag code={opt} />
          </option>
        ))}
      </select>
      <Input {...register(name)} />
    </div>
  );
};
