import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarIcon } from "@radix-ui/react-icons"; // You can use any icon library

interface DateInputProps {
  value: string; // Expects a string value (e.g., "2023-10-15")
  onChange: (date: string) => void; // Returns a string value
  placeholder?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Convert the string value to a Date object for the DayPicker
  const dateValue = value ? new Date(value) : undefined;

  const handleDayClick = (date: Date | undefined) => {
    if (date) {
      // Convert the selected date to an ISO string (e.g., "2023-10-15")
      const isoDateString = date.toISOString().split("T")[0];
      onChange(isoDateString); // Update the form with the string value
    }
    setIsCalendarOpen(false); // Close the calendar
  };

  return (
    <div className="relative">
      <div className="flex items-center rounded-md border p-2">
        <input
          type="text"
          readOnly
          value={value || ""} // Display the string value directly
          placeholder={placeholder || "Select a date"}
          className="flex-1 outline-none"
        />
        <button
          type="button"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <CalendarIcon className="h-5 w-5" />
        </button>
      </div>

      {isCalendarOpen && (
        <div className="absolute z-10 mt-2 rounded-md border bg-white shadow-lg">
          <DayPicker
            mode="single"
            selected={dateValue} // Pass the Date object to DayPicker
            onSelect={handleDayClick}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
