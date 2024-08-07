import NumberOfOrdersChart from "../../widgets/NumberOfOrdersChart";
import NumberOfUniqueCustomer from "../../widgets/NumberOfUniqueCustomer";
import { useEffect } from "react";
import GrossMarchandiseValue from "../../widgets/GrossMarchandiseValue";

const Dashboard = () => {
  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      <div className="flex h-[1500px] flex-col justify-between">
        <NumberOfOrdersChart />
        <NumberOfUniqueCustomer />
        <GrossMarchandiseValue />
      </div>
    </div>
  );
};

export default Dashboard;
