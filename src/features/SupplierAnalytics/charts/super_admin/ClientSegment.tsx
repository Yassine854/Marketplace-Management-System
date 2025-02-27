import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const newColors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#6EE7B7",
  "#FDE68A",
  "#FCA5A5",
  "#94A3B8",
];

interface Customer {
  id: number;
  retailer_profile: string;
}

interface Order {
  entity_id: number;
  customer_id?: number;
  created_at: string;
  state: string;
}

const GeneralClientSegment: React.FC<{
  startDate?: Date | null;
  endDate?: Date | null;
}> = ({ startDate: propStartDate, endDate: propEndDate }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(
    propStartDate || null,
  );
  const [endDate, setEndDate] = useState<Date | null>(propEndDate || null);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [segmentDetails, setSegmentDetails] = useState<
    { label: string; count: number }[]
  >([]);

  useEffect(() => {
    setStartDate(propStartDate || null);
    setEndDate(propEndDate || null);
  }, [propStartDate, propEndDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, customersResponse] = await Promise.all([
          fetch("http://localhost:3000/api/orders"),
          fetch("http://localhost:3000/api/customers"),
        ]);

        const orders: Order[] = await ordersResponse.json();
        const customers: Customer[] = await customersResponse.json();

        // Create customer profile map
        const customerProfileMap = customers.reduce(
          (acc: Record<number, string>, customer) => {
            acc[customer.id] =
              customer.retailer_profile === "0" || !customer.retailer_profile
                ? "Inconnue"
                : customer.retailer_profile;
            return acc;
          },
          {},
        );

        // Date filtering
        const startUTC = startDate ? startDate.getTime() : null;
        const endUTC = endDate ? endDate.getTime() : null;

        // Filter valid orders
        const filteredOrders = orders.filter((order) => {
          const orderTime = new Date(order.created_at).getTime();
          return (
            order.state !== "canceled" &&
            (!startUTC || orderTime >= startUTC) &&
            (!endUTC || orderTime <= endUTC)
          );
        });

        // Track unique customers per profile
        const profileDistribution: Record<string, Set<number>> = {};
        const allCustomers = new Set<number>();

        filteredOrders.forEach((order) => {
          if (order.customer_id && customerProfileMap[order.customer_id]) {
            const profile = customerProfileMap[order.customer_id];

            if (!profileDistribution[profile]) {
              profileDistribution[profile] = new Set();
            }

            if (!allCustomers.has(order.customer_id)) {
              profileDistribution[profile].add(order.customer_id);
              allCustomers.add(order.customer_id);
            }
          }
        });

        // Prepare visualization data
        const segments = Object.entries(profileDistribution)
          .map(([label, customers]) => ({
            label,
            count: customers.size,
          }))
          .sort((a, b) => b.count - a.count);

        setTotalCustomers(allCustomers.size);
        setSegmentDetails(segments);

        setChartData({
          series: segments.map((item) => item.count),
          options: {
            chart: {
              type: "pie",
              height: 400,
              events: {
                dataPointSelection: (
                  event: any,
                  chartContext: any,
                  config: any,
                ) => {
                  console.log(
                    "Selected profile:",
                    segments[config.dataPointIndex].label,
                  );
                },
              },
            },
            colors: newColors,
            labels: segments.map((item) => item.label),
            dataLabels: {
              enabled: true,
              formatter: (val: number) => `${val.toFixed(1)}%`,
            },
            legend: { show: false },
            tooltip: {
              y: { formatter: (value: number) => `${value} customers` },
            },
            title: {
              text: `Répartition des Clients – Clients uniques : ${allCustomers.size}`,
              align: "center",
              style: {
                fontSize: "16px",
                fontWeight: "bold",
              },
            },
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm font-medium">Période:</label>
        <div className="flex gap-3">
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            placeholderText="Date Début"
            className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="MMM d, yyyy"
            isClearable
          />
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            placeholderText="Date Fin"
            className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="MMM d, yyyy"
            isClearable
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-inner">
        {chartData ? (
          <ApexCharts
            options={chartData.options}
            series={chartData.series}
            type="pie"
            height={350}
          />
        ) : (
          <p className="text-center text-gray-500">
            Chargement des profils clients...
          </p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {segmentDetails.map((segment, index) => (
          <div
            key={segment.label}
            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className="mt-1 h-5 w-5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: newColors[index % newColors.length] }}
            />
            <div className="flex-1">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">
                  {segment.label}
                </span>
                <span className="mt-1 text-lg font-semibold text-gray-900">
                  {segment.count}
                </span>
                <span className="text-sm text-gray-500">
                  {((segment.count / totalCustomers) * 100).toFixed(1)}% du
                  total
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralClientSegment;
