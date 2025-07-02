import React from "react";
import { FaClipboardList } from "react-icons/fa";

export interface ProductsAwaitingApprovalChartProps {
  awaiting: number;
}

const ProductsAwaitingApprovalChart: React.FC<
  ProductsAwaitingApprovalChartProps
> = ({ awaiting }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0 text-4xl">
          <FaClipboardList className="text-blue-500" />
        </div>
        {/* Title & Data */}
        <div className="ml-2 flex-grow">
          <h4 className="text-lg font-semibold text-gray-700">
            Pending Products
          </h4>
          <p className="text-xl font-bold text-gray-800">{awaiting}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsAwaitingApprovalChart;
