import NumberOfOrdersChart from "../../widgets/NumberOfOrdersChart";
import NumberOfUniqueCustomer from "../../widgets/NumberOfUniqueCustomer";

const Dashboard = () => {
  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      <NumberOfOrdersChart />
      <div className="mt-10">
        <NumberOfUniqueCustomer />
      </div>
    </div>
  );
};

export default Dashboard;
