import dynamic from "next/dynamic";
import MonthPicker from "../MonthPicker";
import { useEffect, useState } from "react";
import Loading from "@/features/shared/elements/Loading";
import { useGetNooByMonth } from "../../hooks/useGetNooByMonth";
import { useGetNooLifetime } from "../../hooks/useGetNooLifetime";

const NumberOfOrdersChart = () => {
  // const { theme } = useTheme();
  // const [month, setMonth] = useState(`${new Date().getFullYear()}-01-01`);
  const [date, setDate] = useState(`${new Date().getFullYear()}-01-01`);
  const [year, month, day] = date.split("-").map(Number);

  const { data, isLoading } = useGetNooByMonth(year, month);
  // const { data, isLoading } = useGetNooLifetime();
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
    if (data) {
      const yAxis = data?.map((item: any) => parseInt(item.numberOfOrders));
      setYaxis(yAxis);
      const xAxis = data?.map((item: any) => item.day);
      setXaxis(xAxis);
    }
  }, [data]);

  return (
    <div className="box min-h-92 col-span-12 w-full overflow-x-hidden shadow-xl lg:col-span-6">
      <div className=" bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <div className="flex items-center justify-center ">
          <div className=" mx-4 h-8 w-8 items-center justify-center ">
            {isLoading && <Loading />}
          </div>
          <p className="text-2xl font-bold">Number of Orders Chart</p>
        </div>
        <MonthPicker onMonthChange={(date: string) => setDate(date)} />
      </div>
      <div className="h-[320px]">
        {data && (
          <ReactApexChart
            height="100%"
            width={"100%"}
            series={series}
            options={chartOptions}
            type="bar"
          />
        )}
      </div>
    </div>
  );
};

export default NumberOfOrdersChart;
