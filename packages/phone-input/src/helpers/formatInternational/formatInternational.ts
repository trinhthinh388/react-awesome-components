import { parseIncompletePhoneNumber } from 'libphonenumber-js';

export const formatInternational = (phoneValue: string) => {
  if (!phoneValue) return '';
  if (phoneValue.startsWith('+')) return parseIncompletePhoneNumber(phoneValue);

  if (phoneValue.startsWith('0'))
    return parseIncompletePhoneNumber('+' + phoneValue.slice(1));

  return parseIncompletePhoneNumber('+' + phoneValue);
};
