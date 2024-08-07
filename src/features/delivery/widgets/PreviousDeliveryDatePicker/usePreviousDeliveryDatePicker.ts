import { useState, useImperativeHandle, useEffect } from "react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { formatJsDate2IsoDate } from "@/utils/date/formatJsDate2IsoDate";

export const getTodayJsDate = (): Date => {
  const today = new Date();
  return today;
};

export const getTodayIsoDate = () => {
  let today = new Date();

  let isoToday = today.toISOString().split("T")[0];

  return isoToday;
};

export const useDeliveryDatePicker = ({ onChange, ref }: any) => {
  const [selected, setSelected] = useState<Date>(getTodayJsDate());
  const [placeholder, setPlaceholder] = useState<string>(getTodayIsoDate());

  const {
    open: isOpen,
    ref: dropDownRef,
    toggleOpen: toggleCalendar,
  } = useDropdown();

  const onSelect = (jsDate: any) => {
    if (jsDate instanceof Date) {
      setSelected(jsDate);

      const isoDate = formatJsDate2IsoDate(jsDate);

      setPlaceholder(isoDate);

      onChange(isoDate);

      toggleCalendar();

      return;
    }
    setSelected(getTodayJsDate());

    setPlaceholder(getTodayIsoDate());

    onChange(getTodayIsoDate());
  };

  useEffect(() => {
    if (selected) {
      const isoDate = formatJsDate2IsoDate(selected);

      setPlaceholder(isoDate);

      onChange(isoDate);
    }
    selected && onChange(formatJsDate2IsoDate(selected));
  }, [selected, onChange]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSelected(getTodayJsDate());
      setPlaceholder(getTodayIsoDate());
    },
  }));

  return {
    isOpen,
    selected,
    onSelect,
    placeholder,
    dropDownRef,
    toggleCalendar,
  };
};
