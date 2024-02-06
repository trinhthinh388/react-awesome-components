import React, { useCallback, useState } from 'react'

export const useToggle = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(
    (_value?: boolean) =>
      setValue((prev) => (typeof _value === 'boolean' ? _value : !prev)),
    []
  )

  return {
    toggle,
    isOn: value,
  }
}
