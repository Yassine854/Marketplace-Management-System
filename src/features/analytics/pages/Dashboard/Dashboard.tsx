import NumberOfOrdersChart from "../../charts/NumberOfOrdersChart";
import NumberOfUniqueCustomer from "../../widgets/NumberOfUniqueCustomer";
import GrossMerchandiseValueChart from "../../charts/GrossMerchandiseValueChart";

const Dashboard = () => {
  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      <div className="flex flex-col justify-between">
        <GrossMerchandiseValueChart />
        <NumberOfOrdersChart />
        {/* <NumberOfUniqueCustomer /> */}
      </div>
    </div>
  );
};

export default Dashboard;
