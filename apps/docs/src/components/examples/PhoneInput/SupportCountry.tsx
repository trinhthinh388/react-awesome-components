import { useState } from "react";
import {
  PhoneInput,
  PhoneInputChangeMetadata,
} from "@react-awesome/phone-input";

export const SupportCountryPhoneInput = () => {
  const [value, setValue] = useState<PhoneInputChangeMetadata>({
    isPossible: false,
    isValid: false,
    e164Value: "",
    country: "VN",
    phoneCode: "84",
    formattedValue: "",
    isSupported: true,
  });

  return (
    <div>
      <PhoneInput
        placeholder="Enter your phone number"
        onChange={(_, m) => {
          setValue(m);
        }}
        value={value?.formattedValue}
        defaultCountry={value.country}
        supportedCountries={["US", "CA", "VN"]}
      />

      <h3 className="mt-3 font-bold text-xl underline underline-offset-4">
        onChange event
      </h3>
      <ul className="mt-2">
        {Object.keys(value).map((key) => {
          const v = value[key as keyof PhoneInputChangeMetadata];
          return (
            <li key={key}>
              <span className="font-medium">👉 {key}</span>
              <code className="ml-2 nx-border-black nx-border-opacity-[0.04] nx-bg-opacity-[0.03] nx-bg-black nx-break-words nx-rounded-md nx-border nx-py-0.5 nx-px-[.25em] nx-text-[.9em] dark:nx-border-white/10 dark:nx-bg-white/10">
                {v.toString()}
              </code>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
