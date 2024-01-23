import { useState } from 'react';
import {
  PhoneInput,
  PhoneInputChangeMetadata,
} from '@react-awesome/phone-input';

export const DefaultPhoneInput = () => {
  const [value, setValue] = useState<PhoneInputChangeMetadata>({
    isValid: false,
    isPossible: false,
    country: 'VN',
    e164Value: '',
    phoneCode: '84',
    formattedValue: '',
  });

  console.log(value);

  return (
    <div>
      <PhoneInput
        placeholder="Enter your phone number"
        onChange={(_, m) => {
          setValue(m);
        }}
        value={value?.formattedValue}
      />
      {/* <ul>
        {Object.keys(value).map((key) => (
          <li key={key}>
            <span>{key}</span>
            <span>
              {value[key as keyof PhoneInputChangeMetadata].toString()}
            </span>
          </li>
        ))}
      </ul> */}
    </div>
  );
};
