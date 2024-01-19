import { useCallback, useRef, useState } from 'react';

const DEFAULT_ALLOW_CHARACTERS = /^[+0-9][0-9]*$/;

export type UsePhoneInput = {
  /**
   * @description Phone value
   */
  value?: string;
  /**
   * @description onChange handler
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const usePhoneInput = ({ value }: UsePhoneInput = {}) => {
  const [innerValue, setInnerValue] = useState<string>('');
  const keyPressed = useRef<Record<string, boolean>>({});
  const _v = useRef<string>('');

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    _v.current = e.target.value;
    setInnerValue(e.target.value);
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Autofill behaviour
    if (!e.key || e.key === 'Unidentified') return;

    keyPressed.current[e.key] = true;

    let keys = [];
    for (const [key, isPressed] of Object.entries(keyPressed.current)) {
      if (isPressed) keys.push(key);
    }

    const startPos = e.currentTarget.selectionStart || 0;
    const endPos = e.currentTarget.selectionEnd || _v.current.length;

    console.log(startPos, endPos);

    const _value = `${_v.current.slice(0, startPos + 1)}${e.key}${_v.current.slice(startPos + 1, endPos)}`;

    console.log(_value);

    const combination = keys.join('');

    const isDel = e.key === 'Backspace';
    const isSelectAll = combination === 'Controla';
    const isUndo = combination === 'Controlz';
    const isRedo = combination === 'ControlShiftZ';
    const isMovingCursor = combination.includes('Arrow');

    if (
      isMovingCursor ||
      isRedo ||
      isUndo ||
      isDel ||
      isSelectAll ||
      DEFAULT_ALLOW_CHARACTERS.test(_value)
    ) {
      return;
    }

    e.preventDefault();
  }, []);

  const onKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    keyPressed.current[e.key] = false;
  }, []);

  const register = useCallback(() => {
    return {
      value: value || innerValue,
      onChange,
      onKeyDown,
      onKeyUp,
      type: 'tel',
      autocomplete: 'tel',
    };
  }, [innerValue, onChange, onKeyDown, onKeyUp, value]);

  return {
    register,
  };
};
