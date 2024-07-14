import { useEffect, useState } from "react";
import { DatePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { unixTimestampToYMD } from "@/utils/unixTimestamp";

const placeholder = parseDate("2000-01-01");

const DeliveryDatePicker = ({ onChange, defaultValue }: any) => {
  const formatter = useDateFormatter({ dateStyle: "short" });
  const [value, setValue] = useState(placeholder);

  const handleChange = (newValue: any) => {
    if (newValue !== value) {
      setValue(newValue);
      const dateString = formatter.format(newValue.toDate(getLocalTimeZone()));
      const [day, month, year] = dateString.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      const unixTimestamp = Math.floor(date.getTime() / 1000);
      onChange && onChange(unixTimestamp);
    }
  };

  useEffect(() => {
    if (defaultValue) {
      const date = unixTimestampToYMD(defaultValue);
      const newValue = parseDate(date);
      setValue(newValue);
    }
  }, [defaultValue, setValue]);

  return (
    <div className="flex flex-row gap-2">
      <div className="flex w-full flex-col gap-y-2">
        <DatePicker
          className="max-w-[284px]"
          aria-label="delivery-date-picker"
          //@ts-ignore
          value={value}
          //@ts-ignore
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default DeliveryDatePicker;
