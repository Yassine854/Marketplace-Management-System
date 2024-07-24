import dynamic from "next/dynamic";
//import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useGetNumberOfOrdersByMonthAnalytics } from "../../hooks/useGetNumberOfOrdersByMonthAnalytics";
import Loading from "@/features/shared/elements/Loading";
import MonthPicker from "../MonthPicker";

const NumberOfOrdersChart = () => {
  // const { theme } = useTheme();

  const [month, setMonth] = useState(`${new Date().getFullYear()}-01-01`);

  const { data, isLoading } = useGetNumberOfOrdersByMonthAnalytics(
    `2024-${month}`,
  );
  const [xAxis, setXaxis] = useState([]);
  const [yAxis, setYaxis] = useState([]);

  useEffect(() => {
    if (data) {
      const yAxis = data?.map((item: any) => parseInt(item.numberOfOrders));
      setYaxis(yAxis);
      const xAxis = data?.map((item: any) => item.day);
      setXaxis(xAxis);
    }
  }, [data]);

  const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  });

  const chartOptions = {
    // chart: {
    //   height: 350,
    //   type: "line",
    //   toolbar: {
    //     show: false,
    //   },
    // },
    // colors: ["#5D69F4"],
    // stroke: {
    //   width: 5,
    // },
    xaxis: {
      // type: "category",
      // labels: {
      //   style: {
      //     colors: theme == "light" ? "#404A60" : "#EBECEF",
      //   },
      // },
      categories: xAxis,

      // axisBorder: {
      //   show: false,
      // },
      // axisTicks: {
      //   color: theme == "dark" ? "#404A60" : "#EBECEF",
      // },
    },
    // yaxis: {
    //   labels: {
    //     style: {
    //       colors: theme == "light" ? "#404A60" : "#EBECEF",
    //     },
    //   },
    // },
    // markers: {
    //   width: 8,
    //   height: 8,
    //   radius: 50,
    //   shape: "circle",
    //   size: 8,
    //   strokeColors: "#FFC861",
    //   hover: {
    //     size: 12,
    //   },
    // },
    // grid: {
    //   borderColor: theme == "dark" ? "#404A60" : "#EBECEF",
    // },
  };

  const series = [
    {
      name: "Number of Orders ",
      data: yAxis,
    },
  ];

  return (
    <div className="box min-h-92 col-span-12 w-full overflow-x-hidden shadow-xl lg:col-span-6">
      <div className=" bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <div className="flex items-center justify-center ">
          <div className=" mx-4 h-8 w-8 items-center justify-center ">
            {isLoading && <Loading />}
          </div>
          <p className="text-2xl font-bold">Number of Orders Chart </p>
        </div>
        <MonthPicker onMonthChange={(month: any) => setMonth(month?.key)} />
      </div>
      <div className="h-[320px]">
        <ReactApexChart
          height="100%"
          width={"100%"}
          series={series}
          options={chartOptions}
          type="bar"
        />
      </div>
    </div>
  );
};

export default NumberOfOrdersChart;
