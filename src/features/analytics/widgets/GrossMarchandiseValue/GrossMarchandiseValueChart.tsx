import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useGetGmvByYearAnalytics } from "../../hooks/useGetGmvByYearAnalytics";
import Loading from "@/features/shared/elements/Loading";
import YearPicker from "../YearPicker";
import Dropdown from "@/features/orders/widgets/Dropdown";
import { options } from "@/public/data/timesDropdown";
import MonthPicker from "../MonthPicker";
import { useGetGmvByMonthAnalytics } from "../../hooks/useGetGmvByMonthAnalytics";

const GrossMarchandiseValueChart = () => {
  const [date, setDate] = useState(`${new Date().getFullYear()}-01-01`);

  const [selected, setSelected] = useState(options[0]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [xAxis, setXAxis] = useState<string[]>([]);
  const { dataMonth, isLoadingMonth } = useGetGmvByMonthAnalytics(2024, 7);
  const { dataYear, isLoadingYear } = useGetGmvByYearAnalytics(2024);
  useEffect(() => {
    if (selected.name === "Month") {
      const days = dataMonth.Days;
      setXAxis(days);
      setChartData(dataMonth.gmv);
    } else {
      setChartData(dataYear);
    }
  }, [selected]);

  const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  });

  const chartOptions = {
    xaxis: {
      categories:
        selected.name === "Month"
          ? xAxis
          : [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
    },
  };

  const series = [
    {
      name: "Gross Marchandise Value",
      data: chartData,
    },
  ];

  return (
    <div className="box min-h-92 col-span-12 w-full overflow-x-hidden shadow-xl lg:col-span-6">
      <div className=" bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <div className="flex items-center justify-center ">
          <div className=" mx-4 h-8 w-8 items-center justify-center ">
            <Loading />
          </div>
          <p className="text-2xl font-bold">Gross Marchandise Value</p>
        </div>
        <div className="flex flex-row">
          <Dropdown
            selected={selected}
            onSelect={setSelected}
            items={options}
          />
          {selected.name === "Year" ? (
            <YearPicker onYearChange={(date: string) => setDate(date)} />
          ) : (
            <MonthPicker onYearChange={(date: string) => setDate(date)} />
          )}
        </div>
      </div>
      <div className="h-[320px]">
        <ReactApexChart
          height="100%"
          width={"100%"}
          series={series}
          options={chartOptions}
          type="line"
        />
      </div>
    </div>
  );
};

export default GrossMarchandiseValueChart;
