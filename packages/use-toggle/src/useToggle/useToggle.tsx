import { useCallback, useMemo, useState } from 'react'

export const useToggle = (
  initialValue: boolean,
): [boolean, (value?: boolean) => void] => {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(
    (_value?: boolean) =>
      setValue((prev) => (typeof _value === 'boolean' ? _value : !prev)),
    [],
  )

  return useMemo(() => [value, toggle], [toggle, value])
}
