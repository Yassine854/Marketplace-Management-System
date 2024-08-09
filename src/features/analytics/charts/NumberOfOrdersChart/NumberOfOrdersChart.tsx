import dynamic from "next/dynamic";
import MonthPicker from "../../widgets/MonthPicker";
import { useEffect, useState } from "react";
import Loading from "@/features/shared/elements/Loading";
import { useGetNooByMonth } from "../../hooks/useGetNooByMonth";
import { useGetNooLifetime } from "../../hooks/useGetNooLifetime";
import ChartFilterSelector from "../../widgets/ChartFilterSelector";
import YearPicker from "../../widgets/YearPicker";
import { useGetNooByYear } from "../../hooks/useGetNooByYear";

export const options = [
  { name: "By Month", key: "month" },
  { name: "By Year", key: "year" },
  { name: "Lifetime", key: "lifetime" },
];

const NumberOfOrdersChart = () => {
  // const { theme } = useTheme();
  // const [month, setMonth] = useState(`${new Date().getFullYear()}-01-01`);
  const [date, setDate] = useState(`${new Date().getFullYear()}-01-01`);
  const [year, month, day] = date.split("-").map(Number);
  const [selected, setSelected] = useState(options[0]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedYear, setSelectedYear] = useState<any>(2024);

  const [data, setData] = useState();
  const { data: monthData, isLoading: isByMonthLoading } = useGetNooByMonth(
    year,
    month,
  );
  const { data: lifeTimeData, isLoading: isLifetimeLoading } =
    useGetNooLifetime();

  const { data: yearData, isLoading: isYearLoading } =
    useGetNooByYear(selectedYear);

  const [xAxis, setXaxis] = useState([]);
  const [yAxis, setYaxis] = useState([]);

  const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  });

  const chartOptions = {
    xaxis: {
      categories: xAxis,
    },
  };

  const series = [
    {
      name: "Number of Orders ",
      data: yAxis,
    },
  ];

  useEffect(() => {
    if (selected.key === "month" && monthData) {
      const yAxis = monthData?.map((item: any) =>
        parseInt(item.numberOfOrders),
      );
      setYaxis(yAxis);
      const xAxis = monthData?.map((item: any) => item.day);
      setXaxis(xAxis);
    }
  }, [monthData, selected]);

  useEffect(() => {
    if (selected.key === "lifetime" && lifeTimeData) {
      const yAxis = lifeTimeData?.map((item: any) =>
        parseInt(item.numberOfOrders),
      );
      setYaxis(yAxis);
      const xAxis = lifeTimeData?.map((item: any) => item.date);
      setXaxis(xAxis);
    }
  }, [lifeTimeData, selected]);

  useEffect(() => {
    if (selected.key === "year" && yearData) {
      const yAxis = yearData?.map((item: any) => parseInt(item.numberOfOrders));
      setYaxis(yAxis);
      const xAxis = yearData?.map((item: any) => item.date);
      setXaxis(xAxis);
    }
  }, [yearData, selected]);

  useEffect(() => {
    if (isByMonthLoading || isLifetimeLoading || isYearLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isByMonthLoading, isLifetimeLoading, isYearLoading]);

  useEffect(() => {
    if (selected.key === "month" && monthData) setData(monthData);
    if (selected.key === "lifetime" && lifeTimeData) setData(lifeTimeData);
  }, [monthData, lifeTimeData, selected]);

  return (
    <div className="box min-h-92 col-span-12 w-full overflow-x-hidden shadow-xl lg:col-span-6">
      <div className=" bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <div className="flex items-center justify-center ">
          <div className=" mx-4 h-8 w-8 items-center justify-center ">
            {isLoading && <Loading />}
          </div>
          <p className="text-2xl font-bold">Number of Orders Chart</p>
        </div>
        <div className="flex">
          {selected.key === "month" && (
            <MonthPicker onMonthChange={(date: string) => setDate(date)} />
          )}

          {selected.key === "year" && (
            <YearPicker
              onYearChange={(date: string) => setSelectedYear(date)}
            />
          )}

          <ChartFilterSelector
            selected={selected}
            onSelect={setSelected}
            items={options}
          />
        </div>
      </div>
      <div className="h-[320px]">
        {data && (
          <ReactApexChart
            height="100%"
            width={"100%"}
            series={series}
            options={chartOptions}
            type={selected.key == "month" ? "bar" : "line"}
          />
        )}
      </div>
    </div>
  );
};

export default NumberOfOrdersChart;
