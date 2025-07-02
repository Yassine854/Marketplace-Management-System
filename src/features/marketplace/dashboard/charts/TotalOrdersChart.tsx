import React from "react";
import { FaClipboardList } from "react-icons/fa";

export interface TotalOrdersChartProps {
  total: number;
}

const TotalOrdersChart: React.FC<TotalOrdersChartProps> = ({ total }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-shrink-0 text-4xl">
          <FaClipboardList className="text-blue-500" />
        </div>
        <div className="ml-2 flex-grow">
          <h4 className="text-lg font-semibold text-gray-700">Total Orders</h4>
          <p className="text-xl font-bold text-gray-800">{total}</p>
        </div>
      </div>
    </div>
  );
};

export default TotalOrdersChart;
