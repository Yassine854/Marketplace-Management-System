// import { useEffect, useState } from "react";
// import { DatePicker } from "@nextui-org/react";
// import { parseDate, getLocalTimeZone } from "@internationalized/date";
// import { useDateFormatter } from "@react-aria/i18n";
// import { unixTimestampToYMD } from "@/utils/unixTimestamp";

// const placeholder = parseDate("2000-01-01");

// const DeliveryDatePicker = ({ onChange, selectedDate, isReadOnly }: any) => {
//   const formatter = useDateFormatter({ dateStyle: "short" });
//   const [value, setValue] = useState(placeholder);

//   const handleChange = (newValue: any) => {
//     if (newValue !== value) {
//       setValue(newValue);
//       const dateString = formatter.format(newValue.toDate(getLocalTimeZone()));
//       const [day, month, year] = dateString.split("/").map(Number);
//       const date = new Date(year, month - 1, day);
//       const unixTimestamp = Math.floor(date.getTime() / 1000);
//       onChange && onChange(unixTimestamp);
//     }
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       const date = unixTimestampToYMD(selectedDate);
//       const newValue = parseDate(date);
//       setValue(newValue);
//     }
//   }, [selectedDate, setValue]);

//   return (
//     <div className="flex flex-row gap-2">
//       <div className="flex w-full flex-col gap-y-2">
//         <DatePicker
//           isReadOnly={isReadOnly}
//           className="max-w-[284px]"
//           aria-label="delivery-date-picker"
//           //@ts-ignore
//           value={value}
//           //@ts-ignore
//           onChange={handleChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default DeliveryDatePicker;

import React from "react";
import { DatePicker } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";

export default function App() {
  let now = today(getLocalTimeZone());

  let disabledRanges = [
    [now, now.add({ days: 5 })],
    [now.add({ days: 14 }), now.add({ days: 16 })],
    [now.add({ days: 23 }), now.add({ days: 24 })],
  ];

  let { locale } = useLocale();

  let isDateUnavailable = (date: any) =>
    // isWeekend(date, locale) ||
    disabledRanges.some(
      (interval) =>
        date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0,
    );

  return (
    <DatePicker
      label="Appointment date"
      aria-label="Appointment date"
      isDateUnavailable={isDateUnavailable}
      //@ts-ignore
      minValue={today(getLocalTimeZone())}
    />
  );
}
