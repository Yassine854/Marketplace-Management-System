import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useGetNumberOfOrdersByMonthAnalytics } from "../../hooks/useGetNumberOfOrdersByMonthAnalytics";
import Loading from "@/features/shared/elements/Loading";
import MonthPicker from "../MonthPicker";

const NumberOfUniqueCustomerChart = () => {
  const [date, setDate] = useState(`${new Date().getFullYear()}-01-01`);
  const year = date.split("-")[0];
  // const { data, isLoading } = useGetNumberOfOrdersByMonthAnalytics(2024, "03");
  const [chartData, setChartData] = useState<number[]>([]);

  const fetchNumberOfUniqueCustomerByYear = async () => {
    const response = await fetch(
      `http://localhost:3000/api/analytics/numberOfUniqueCustomer/byYear?year=${year}`,
    );
    const dataJson = await response.json();
    const data = dataJson.data;
    const list: number[] = [];
    data.map((item: any) => {
      list.push(item.NumberOfUniqueCustomer);
    });
    setChartData(list);
  };

  useEffect(() => {
    fetchNumberOfUniqueCustomerByYear();
  }, [chartData, date]);

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
            {/* {isLoading && <Loading />} */}
          </div>
          <p className="text-2xl font-bold">Number of Unique Customer </p>
        </div>
        <MonthPicker onMonthChange={(date: string) => setDate(date)} />
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
