import { useEffect, useState } from "react";
import { DatePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { convertToUnixTimestamp } from "./convertToUnixTimestamp";

const DeliveryDatePicker = ({ onChange, defaultValue }: any) => {
  const formatter = useDateFormatter();
  const [value, setValue] = useState(parseDate("2024-01-01"));

  useEffect(() => {
    if (defaultValue) {
      setValue(parseDate(defaultValue));
    }
  }, [defaultValue, setValue]);

  useEffect(() => {
    onChange(convertToUnixTimestamp(value, formatter));
  }, [value]);

  return (
    <div className="flex flex-row gap-2">
      <div className="flex w-full flex-col gap-y-2">
        <DatePicker
          className="max-w-[284px]"
          aria-label="delivery-date-picker"
          //@ts-ignore
          value={value}
          //@ts-ignore
          onChange={setValue}
        />
      </div>
    </div>
  );
};

export default DeliveryDatePicker;
