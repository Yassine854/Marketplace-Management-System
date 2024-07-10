import { useEffect, useState } from "react";
import { DatePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

function formatUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Convert UNIX timestamp to milliseconds
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
  const day = ("0" + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
}

const DeliveryDatePicker = ({ onChange, defaultValue }: any) => {
  const formatter = useDateFormatter({ dateStyle: "short" });
  const [value, setValue] = useState(parseDate("2023-07-06"));

  useEffect(() => {
    if (defaultValue) {
      const date = formatUnixTimestamp(defaultValue);

      setValue(parseDate(date));
    }
  }, [defaultValue, setValue]);

  //To Refactor
  useEffect(() => {
    if (value) {
      const dateString = formatter.format(value.toDate(getLocalTimeZone()));
      const [day, month, year] = dateString.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      const unixTimestamp = Math.floor(date.getTime() / 1000);
      onChange(unixTimestamp);
    }
    //adding onChange to dependency array cause a problem
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
