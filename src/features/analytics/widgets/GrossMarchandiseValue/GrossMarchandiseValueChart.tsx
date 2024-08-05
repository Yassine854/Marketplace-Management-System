import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useGetGmvByYearAnalytics } from "../../hooks/useGetGmvByYearAnalytics";
import Loading from "@/features/shared/elements/Loading";
import YearPicker from "../YearPicker";
import Dropdown from "@/features/orders/widgets/Dropdown";
import { options } from "@/public/data/timesDropdown";

const GrossMarchandiseValueChart = () => {
  const [date, setDate] = useState(`${new Date().getFullYear()}-01-01`);
  const [selected, setSelected] = useState(options[0]);
  const year = Number(date);
  const { data, isLoading } = useGetGmvByYearAnalytics(year);
  const [chartData, setChartData] = useState<number[]>([]);
  useEffect(() => {
    if (data) {
      const newList = data.map((gmvNumber: number) => {
        const numberString = gmvNumber.toString();
        const dotPosition = numberString.indexOf(".");
        const decimalPart =
          dotPosition !== -1 ? numberString.substring(0, dotPosition) : "";
        return Number(decimalPart);
      });
      setChartData(newList);
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
      name: "Gross Marchandise Value",
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
          <p className="text-2xl font-bold">Gross Marchandise Value</p>
        </div>
        <div className="flex flex-row">
          <Dropdown
            selected={selected}
            onSelect={setSelected}
            items={options}
          />
          <YearPicker onYearChange={(date: string) => setDate(date)} />
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
