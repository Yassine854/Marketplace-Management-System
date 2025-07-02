import React from "react";
import { FaUsers } from "react-icons/fa";

export interface PartnerStatusChartProps {
  active: number;
  inactive: number;
}

const PartnerStatusChart: React.FC<PartnerStatusChartProps> = ({
  active,
  inactive,
}) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0 text-4xl">
          <FaUsers className="text-blue-500" />
        </div>
        {/* Title & Data */}
        <div className="ml-2 flex-grow">
          <h4 className="text-lg font-semibold text-gray-700">Partners</h4>
          <div className="mt-1 flex items-center gap-4">
            <span className="text-lg font-bold text-green-600">
              Act: {active}
            </span>
            <span className="text-lg font-bold text-gray-400">
              Inact: {inactive}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerStatusChart;
