import { useCallback, useEffect } from 'react'

type Delimiter = string
type Delimiters = Delimiter[]

export const getDelimiterRegexByDelimiter = (delimiter: string): RegExp =>
  new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g')

export const stripDelimiters = ({
  value,
  delimiters,
}: {
  value: string
  delimiters: Delimiters
}): string => {
  delimiters.forEach((current: string) => {
    current.split('').forEach((letter) => {
      value = value.replace(getDelimiterRegexByDelimiter(letter), '')
    })
  })

  return value
}

/**
 * @description Calculate the caret position after all the delimiters have been eliminated.
 *
 * @example
 * The delimiter is "-" and the value is "+1-5|05" where "|" is the caret.
 * Before remove the delimiter the caret position starts at 4 and ends at 4.
 * After remove all the delimiter the caret would start at 3 and end at 3 since the value has been transform to this "+15|05"
 */
export const calculateCaretPositionWithoutDelimiters = (
  value: string,
  selectionEnd: number,
  delimiters: Delimiters,
) => {
  let idx = selectionEnd
  for (let charIdx = 0; charIdx < selectionEnd; charIdx++) {
    if (delimiters.includes(value[charIdx])) {
      idx--
    }
  }
  return idx
}

/**
 * @description Calculate the correct caret position without removing any delimiters after the value has been modified at the previous caret position.
 * @example
 * The delimiter is "-" and the value is "+1-5|05" where "|" is the caret and the value after changed is "+1-5205"
 * We expect the caret would start at 5 and end at 5 - "+1-52|05"
 */
export const calculateCaretPositionWithDelimiters = (
  value: string,
  selectionEnd: number,
  delimiters: Delimiters,
) => {
  let idx = selectionEnd

  for (let charIdx = 0; charIdx < value.length; charIdx++) {
    if (delimiters.includes(value[charIdx])) {
      idx = idx + 1
    }

    if (charIdx === idx - 1) break
  }
  return idx
}

export const calculateDelimiterQty = (
  value: string,
  delimiters: string[] = [],
) => {
  let result = 0
  for (const char of value) {
    if (delimiters.includes(char)) {
      result++
    }
  }

  return result
}

export type UsePreserveInputCaretPositionOpts = {
  delimiters?: string[]
  prefix?: string
}
export const usePreserveInputCaretPosition = (
  inputEl?: HTMLInputElement | null,
  { delimiters = [], prefix }: UsePreserveInputCaretPositionOpts = {},
) => {
  const onInput = useCallback(
    (e: Event) => {
      const ev = e as InputEvent
      const target = e.target as HTMLInputElement
      const value = target.value
      const caretEnd = target.selectionEnd

      const isBackward = ev.inputType === 'deleteContentBackward'

      // If `insertText` and enter at the end of the input then do nothing
      if (!isBackward && value.length === caretEnd) return

      const preserveIdx = calculateCaretPositionWithoutDelimiters(
        value,
        caretEnd || /* istanbul ignore next */ 0,
        delimiters,
      )

      window.requestAnimationFrame(() => {
        const strippedValue = stripDelimiters({
          value: target.value,
          delimiters,
        })
        if (strippedValue === prefix) return

        let actualIdx = calculateCaretPositionWithDelimiters(
          value,
          preserveIdx,
          delimiters,
        )

        /**
         * If the index is within the length of the prefix then place the caret at the end of the prefix.
         */
        if (typeof prefix === 'string' && actualIdx <= prefix.length) {
          actualIdx = prefix.length
        }

        const delimiterQtyBeforeUpdate = calculateDelimiterQty(
          value,
          delimiters,
        )
        const delimiterQtyAfterUpdate = calculateDelimiterQty(
          target.value,
          delimiters,
        )
        const diff =
          delimiterQtyAfterUpdate > delimiterQtyBeforeUpdate
            ? delimiterQtyAfterUpdate - delimiterQtyBeforeUpdate
            : 0
        target.setSelectionRange(actualIdx + diff, actualIdx + diff)
      })
    },
    [delimiters, prefix],
  )

  useEffect(() => {
    if (!inputEl) return

    inputEl.addEventListener('input', onInput)

    return () => {
      inputEl.removeEventListener('input', onInput)
    }
  }, [inputEl, onInput])
}
