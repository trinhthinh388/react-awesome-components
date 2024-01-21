import { Sandpack } from '@codesandbox/sandpack-react';

export const Preview = ({
  code,
  scope,
}: {
  code: string;
  scope: Record<string, unknown>;
}) => (
  <Sandpack
    template="react"
    files={{
      '/App.js': `
      import React from 'react';
      import { PhoneInput } from '@react-awesome/phone-input'
      function App() {
        const [country, setCountry] = React.useState("US");
        
        return (
          <PhoneInput
            placeholder="Enter your phone number"
            defaultCountry={country}
          />
        );
      }
      export default App;`,
    }}
  />
);
