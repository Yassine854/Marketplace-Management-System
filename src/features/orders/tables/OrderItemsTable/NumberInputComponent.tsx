import { useState, useEffect, useCallback } from "react";
import CustomNumberInput from "./CustomNumberInput";

const NumberInputComponent = ({
  max,
  min,
  defaultValue,
  onChange,
  step,
}: any) => {
  const [value, setValue] = useState<number>(Number(defaultValue));

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): number => {
    const value = event.target.value;
    const numValue = Number(value);
    if (numValue < 0) {
      event.target.value = "0";
      return 0;
    } else if (numValue > max) {
      event.target.value = max.toString();
      return max;
    }
    return numValue;
  };

  useEffect(() => {
    onChange && onChange(value);
  }, [value, onChange]);

  useEffect(() => {
    if (!value) {
      setValue(0);
    }
  }, [value, setValue]);

  useCallback(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <CustomNumberInput
      onChange={(_, value) => {
        setValue(Number(value));
      }}
      value={value}
      onInputChange={(event) => {
        if (defaultValue != undefined) {
          const value = handleInputChange(event);
          setValue(value);
        }
      }}
      max={max}
      min={min}
      step={step}
    />
  );
};

export default NumberInputComponent;
