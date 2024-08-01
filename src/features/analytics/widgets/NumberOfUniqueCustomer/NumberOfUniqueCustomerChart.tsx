import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useGetNumberOfUniqueCustomerByYearAnalytics } from "../../hooks/useGetNumberOfUniqueCustomerByYearAnalytics";
import Loading from "@/features/shared/elements/Loading";
import YearPicker from "../YearPicker";

const NumberOfUniqueCustomerChart = () => {
  const [date, setDate] = useState(`${new Date().getFullYear()}-01-01`);
  const year = Number(date);
  const { data, isLoading } = useGetNumberOfUniqueCustomerByYearAnalytics(year);
  const [chartData, setChartData] = useState<number[]>([]);
  useEffect(() => {
    if (data) {
      setChartData(data);
    }
  }, [data]);

  const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  });

  const chartOptions = {
    xaxis: {
      categories: [
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
      name: "Number of Unique Customer",
      data: chartData,
    },
  ];

  return (
    <div className="box min-h-92 col-span-12 w-full overflow-x-hidden shadow-xl lg:col-span-6">
      <div className=" bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <div className="flex items-center justify-center ">
          <div className=" mx-4 h-8 w-8 items-center justify-center ">
            {isLoading && <Loading />}
          </div>
          <p className="text-2xl font-bold">Number of Unique Customer </p>
        </div>
        <YearPicker onYearChange={(date: string) => setDate(date)} />
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

export default NumberOfUniqueCustomerChart;
