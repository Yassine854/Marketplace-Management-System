"use client";

import { IconArrowUpRight, IconPlus } from "@tabler/icons-react";

import { ApexOptions } from "apexcharts";
import Banner from "@/components/blocks/Banner";
import Dropdown from "@/components/elements/sharedElements/Dropdown";
import { IconSelector } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { faker } from "@faker-js/faker";
import { options } from "@/public/data/timesDropdown";
import { useLayout } from "@/utils/LayoutContext";
import { useState } from "react";
import useTable from "@/hooks/useTable";
import { useTheme } from "next-themes";
import { useWindowSize } from "@/hooks/useWindowSize";

const ShowcaseInfo = () => {
  const [selected, setSelected] = useState(options[0]);
  const { theme } = useTheme();
  const { windowSize } = useWindowSize();
  const { dir } = useLayout();

  const chartData: ApexOptions = {
    series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
    chart: {
      height: 355,
      type: "polarArea",
    },
    colors: [
      "#5D69F4",
      "#00998B",
      "#FFC861",
      "#FF6161",
      "#8169D3",
      "#5D69F4",
      "#00998B",
      "#FFC861",
      "#FF6161",
    ],
    labels: [
      "Application",
      "Widgets",
      "Input Forms",
      "Components",
      "Pages",
      "Earning List",
      "Total Sale",
      "Revenue",
      "Ads Spent",
    ],
    stroke: {
      colors: theme == "dark" ? ["#343E56"] : ["#EBECEF"],
      width: 2,
    },
    fill: {
      opacity: 1,
    },
    responsive: [
      {
        breakpoint: 1600,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 320,
        options: {
          chart: {
            height: 500,
          },
        },
      },
    ],
    dataLabels: {
      enabled: true,
      style: {
        colors: theme != "dark" ? ["#343E56"] : ["#EBECEF"],
      },
      textAnchor: "start",
      distributed: false,
      background: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 1,
          strokeColor: theme == "dark" ? "#343E56" : "#EBECEF",
        },
        spokes: {
          strokeWidth: 1,
          connectorColors: theme == "dark" ? "#343E56" : "#EBECEF",
        },
      },
    },
    legend: {
      offsetX: 10,
      offsetY: windowSize! > 1600 ? 40 : 10,
      itemMargin: {
        vertical: 3,
      },
      position: windowSize! > 580 ? "right" : "bottom",
      horizontalAlign: "center",
      labels: {
        colors: theme == "light" ? "#404A60" : "#EBECEF",
      },
      markers: {
        width: 5,
        height: 5,
        offsetX: dir == "ltr" ? -6 : 3,
      },
    },
  };
  return (
    <div className="box col-span-12 lg:col-span-6">
      <div className="bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium">Showcase Info</p>
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm">Sort By : </p>
          <Dropdown
            selected={selected}
            setSelected={setSelected}
            items={options}
          />
        </div>
      </div>
      <ReactApexChart
        height={450}
        width={"100%"}
        series={chartData.series}
        options={chartData}
        type="polarArea"
      />
    </div>
  );
};

const RevenueOverview = () => {
  const [selected, setSelected] = useState(options[0]);
  const { theme } = useTheme();
  const chartData: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    colors: ["#5D69F4"],
    stroke: {
      width: 5,
    },
    xaxis: {
      type: "category",
      labels: {
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
      },
      categories: [
        "11 Feb",
        "13 Feb",
        "15 Feb",
        "19 Feb",
        "21 Feb",
        "23 Feb",
        "25 Feb",
        "27 Feb",
        "01 Mar",
        "11 Mar",
        "13 Mar",
        "15 Mar",
        "19 Mar",
        "21 Mar",
        "23 Mar",
        "25 Mar",
        "27 Mar",
        "28 Mar",
        "30 Mar",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        color: theme == "dark" ? "#404A60" : "#EBECEF",
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 2,
      labels: {
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
      },
    },

    markers: {
      width: 8,
      height: 8,
      radius: 50,
      shape: "circle",
      size: 8,
      strokeColors: "#FFC861",
      hover: {
        size: 12,
      },
    },
    grid: {
      borderColor: theme == "dark" ? "#404A60" : "#EBECEF",
    },
  };

  let series = [
    {
      name: "Total Sales",
      data: [
        2, 40, 48, 22, 26, 19, 59, 40, 43, 21, 15, 51, 57, 34, 30, 28, 24, 27,
        18, 51,
      ],
    },
  ];
  return (
    <div className="box col-span-12 overflow-x-hidden lg:col-span-6">
      <div className="bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium">Revenue Overview</p>
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm">Sort By : </p>
          <Dropdown
            selected={selected}
            setSelected={setSelected}
            items={options}
          />
        </div>
      </div>
      <ReactApexChart
        height={250}
        width={"100%"}
        series={series}
        options={chartData}
        type="line"
      />
    </div>
  );
};

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ProgressChart = ({
  labels,
  series,
  bg = "#5D69F4",
}: {
  labels: string;
  series: number;
  bg?: string;
}) => {
  const { theme } = useTheme();
  const chartOptions: ApexOptions = {
    chart: {
      type: "radialBar",
      sparkline: {
        enabled: false,
      },
    },
    series: [series],
    legend: {
      show: false,
    },
    stroke: {
      lineCap: "round",
    },
    colors: [bg],
    plotOptions: {
      radialBar: {
        track: {
          background: theme == "light" ? "#EBECEF" : "#343E56",
        },
        dataLabels: {
          value: {
            show: false,
          },
          name: {
            offsetY: 5,
          },
        },
        hollow: {
          size: "55%",
        },
      },
    },
    labels: [labels],
  };
  return (
    <ReactApexChart
      options={chartOptions}
      series={chartOptions.series}
      width={"55%"}
      height={140}
      type="radialBar"
    />
  );
};

const statesData = [
  {
    title: "All Earnings",
    amount: "$65,110",
    percent: 40.7,
    series: 35.5,
  },
  {
    title: "Total Users",
    amount: "32.7k",
    percent: 66.7,
    series: 78.5,
  },
  {
    title: "Session",
    amount: "29.4%",
    percent: 10.7,
    series: 55.5,
  },
  {
    title: "Monthly Sales",
    amount: "$33,110",
    percent: 50.7,
    series: 83.5,
  },
];
const States = () => {
  return (
    <>
      {statesData.map(({ amount, percent, series, title }) => (
        <div
          key={title}
          className="box col-span-12 bg-n0 dark:bg-n800 min-[650px]:col-span-6 xxxl:col-span-3"
        >
          <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
            <span className="font-medium">{title}</span>
            <div className="flex">
              <Image
                src="/images/user-2.png"
                width={32}
                height={32}
                className="-mr-4 rounded-full border border-n0 dark:border-n500"
                alt="img"
              />
              <Image
                src="/images/user-3.png"
                width={32}
                height={32}
                className="-mr-4 rounded-full border border-n0 dark:border-n500"
                alt="img"
              />
              <Image
                src="/images/user-4.png"
                width={32}
                height={32}
                className="-mr-4 rounded-full border border-n0 dark:border-n500"
                alt="img"
              />
              <Image
                src="/images/user-5.png"
                width={32}
                height={32}
                className="-mr-4 rounded-full border border-n0 dark:border-n500"
                alt="img"
              />
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-n0 bg-primary text-n0 dark:border-n500">
                <IconPlus size={22} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="h4 mb-4">{amount}</h4>
              <span className="flex items-center gap-1 whitespace-nowrap text-primary">
                <IconArrowUpRight /> {percent}%
              </span>
            </div>
            <div className="-my-3 shrink-0 ltr:translate-x-3 ltr:xl:translate-x-7 ltr:xxxl:translate-x-2 ltr:4xl:translate-x-9 rtl:-translate-x-3 rtl:xl:-translate-x-7 rtl:xxxl:-translate-x-2 rtl:4xl:-translate-x-9">
              <ProgressChart labels={series + "%"} series={series} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

type ProjectType = {
  title: string;
  percent: number;
  lead: {
    name: string;
    img: string;
  };
  status: string;
};

const projects: ProjectType[] = Array.from({ length: 4 }).map((_, i) => {
  return {
    title: faker.lorem.word(),
    percent: faker.number.int({ max: 100, min: 10 }),
    lead: {
      name: faker.person.firstName(),
      img: `/images/user-${i + 1}.png`,
    },
    status: faker.helpers.arrayElement(["Complete", "Inprogress", "Pending"]),
  };
});

const ProjectsOverview = () => {
  const [selected, setSelected] = useState(options[0]);

  const { tableData, sortData } = useTable(projects);

  return (
    <div className="box col-span-12 lg:col-span-6">
      <div className="bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium">Projects Overview</p>
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm">Sort By : </p>
          <Dropdown
            items={options}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-primary/5 text-n500 dark:bg-bg3 dark:text-n30">
              <th
                onClick={() => sortData("title")}
                className="px-4 py-3 text-start font-semibold"
              >
                <div className="flex cursor-pointer select-none items-center gap-1">
                  Project Name <IconSelector size={18} />
                </div>
              </th>
              <th
                onClick={() => sortData("lead.name" as keyof ProjectType)}
                className="px-4 py-3 text-start font-semibold"
              >
                <div className="flex cursor-pointer select-none items-center gap-1">
                  Project Lead <IconSelector size={18} />
                </div>
              </th>
              <th
                onClick={() => sortData("percent")}
                className="px-4 py-3 text-start font-semibold"
              >
                <div className="flex cursor-pointer select-none items-center gap-1">
                  Progress <IconSelector size={18} />
                </div>
              </th>
              <th
                onClick={() => sortData("status")}
                className="px-4 py-3 text-start font-semibold"
              >
                <div className="flex cursor-pointer select-none items-center gap-1">
                  Status <IconSelector size={18} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(({ lead, percent, status, title }) => (
              <tr key={title}>
                <td className="px-4 py-2">{title}</td>
                <td className="px-4 py-2">
                  <span className="flex items-center gap-3">
                    <Image
                      className="rounded-full"
                      src={lead.img}
                      width={32}
                      height={32}
                      alt="lead img"
                    />{" "}
                    {lead.name}{" "}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="flex items-center gap-2">
                    {percent}%{" "}
                    <span className="block h-1 w-20 rounded-sm bg-primary/10">
                      <span
                        style={{ width: `${percent}%` }}
                        className="block h-1 rounded-sm bg-primary"
                      ></span>
                    </span>
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`block w-28 rounded-[30px] border border-n30 py-2 text-center text-xs dark:border-n500 xxl:w-36 ${
                      status == "Complete" &&
                      "bg-primary/10 text-primary dark:bg-bg3"
                    } ${
                      status == "Inprogress" &&
                      "bg-secondary1/10 text-secondary1 dark:bg-bg3"
                    } ${
                      status == "Pending" &&
                      "bg-secondary2/10 text-secondary2 dark:bg-bg3"
                    }`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

let series = [
  {
    name: "Total Sales",
    data: [10, 80, 70, 65, 40, 88, 60, 99, 105],
  },
  {
    name: "Total Expense",
    data: [13, 61, 70, 88, 68, 30, 100, 70, 98],
  },
  {
    name: "Total Profit",
    data: [9, 38, 35, 52, 49, 70, 38, 22, 148],
  },
];

const SalesStatistics = () => {
  const [selected, setSelected] = useState(options[0]);
  const { theme } = useTheme();
  const { dir } = useLayout();
  const chartData: ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    forecastDataPoints: {
      count: 3,
    },
    colors: ["#FFC861", "#00998B", "#5D69F4"],
    stroke: {
      width: 3,
    },
    xaxis: {
      type: "category",
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
      ],
      tickAmount: 9,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 150,
      tickAmount: 6,
      labels: {
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
        offsetX: dir == "rtl" ? -30 : 0,
      },
    },
    dataLabels: {
      enabled: false,
      enabledOnSeries: undefined,
      textAnchor: "middle",
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#fff",
        opacity: 0.9,
      },
    },
    legend: {
      offsetY: 8,
      markers: {
        height: 4,
        width: 4,
        offsetX: dir == "rtl" ? 5 : -5,
      },
      itemMargin: {
        horizontal: 20,
      },
      labels: {
        colors: theme == "light" ? "#404A60" : "#EBECEF",
      },
    },
    grid: {
      borderColor: theme == "dark" ? "#404A60" : "#EBECEF",
      padding: {
        bottom: 16,
      },
    },
  };

  return (
    <div className="box col-span-12 overflow-x-hidden lg:col-span-6">
      <div className="bb-dashed mb-4 flex flex-wrap items-center justify-between gap-3 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium">Sales Statistics</p>
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm">Sort By : </p>
          <Dropdown
            selected={selected}
            setSelected={setSelected}
            items={options}
          />
        </div>
      </div>
      <ReactApexChart
        height={400}
        width={"100%"}
        series={series}
        options={chartData}
        type="line"
      />
    </div>
  );
};

const Dashboard = () => {
  return (
    <>
      <Banner
        title="Analytics "
        links={
          <div className="flex gap-4 xl:gap-6">
            {/* <Link href="#" className="btn-outline">
              View Reports
            </Link>
            <Link href="#" className="btn">
              Transactions
            </Link> */}
          </div>
        }
      />
      <div className="grid grid-cols-12 gap-4 xxxl:gap-6">
        <States />
        <SalesStatistics />
        <ShowcaseInfo />
        <ProjectsOverview />
        <RevenueOverview />
      </div>
    </>
  );
};

export default Dashboard;
