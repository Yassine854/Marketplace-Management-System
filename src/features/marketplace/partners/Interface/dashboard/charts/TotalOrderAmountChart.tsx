import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";

export interface TotalOrderAmountChartProps {
  totalAmount: number;
}

const TotalOrderAmountChart: React.FC<TotalOrderAmountChartProps> = ({
  totalAmount,
}) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0 text-4xl">
          <FaMoneyBillWave className="text-green-500" />
        </div>
        {/* Title & Data */}
        <div className="ml-2 flex-grow">
          <h4 className="text-lg font-semibold text-gray-700">Sales Revenue</h4>
          <p className="text-xl font-bold text-gray-800">
            {totalAmount.toLocaleString("fr-TN", {
              style: "currency",
              currency: "TND",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalOrderAmountChart;
