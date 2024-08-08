import NumberOfOrdersChart from "../../widgets/NumberOfOrdersChart";
import NumberOfUniqueCustomer from "../../widgets/NumberOfUniqueCustomer";
import GrossMerchandiseValueChart from "../../widgets/GrossMerchandiseValueChart";

const Dashboard = () => {
  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      <div className="flex h-[1500px] flex-col justify-between">
        {/* <GrossMerchandiseValueChart /> */}
        <NumberOfOrdersChart />
        {/*  <NumberOfUniqueCustomer /> */}
      </div>
    </div>
  );
};

export default Dashboard;
