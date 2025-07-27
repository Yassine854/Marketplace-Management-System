import TotalOrderAmountChart from "../charts/TotalOrderAmountChart";
import { useTotalOrderAmount } from "../hooks/useTotalOrderAmount";
import PartnerStatusChart from "../charts/PartnerStatusChart";
import { usePartnerStatusStats } from "../hooks/usePartnerStatusStats";
import ProductsAwaitingApprovalChart from "../charts/ProductsAwaitingApprovalChart";
import { useProductsAwaitingApproval } from "../hooks/useProductsAwaitingApproval";
import TotalCustomersChart from "../charts/TotalCustomersChart";
import { useTotalCustomers } from "../hooks/useTotalCustomers";
import TotalProductsChart from "../charts/TotalProductsChart";
import { useTotalProducts } from "../hooks/useTotalProducts";
import TotalCategoriesChart from "../charts/TotalCategoriesChart";
import { useTotalCategories } from "../hooks/useTotalCategories";
import TotalOrdersChart from "../charts/TotalOrdersChart";
import { useTotalOrders } from "../hooks/useTotalOrders";
import TotalManufacturersChart from "../charts/TotalManufacturersChart";
import { useTotalManufacturers } from "../hooks/useTotalManufacturers";

const Dashboard = () => {
  const {
    totalAmount,
    isLoading: isLoadingAmount,
    isError: isErrorAmount,
  } = useTotalOrderAmount();
  const {
    active,
    inactive,
    isLoading: isLoadingPartners,
    isError: isErrorPartners,
  } = usePartnerStatusStats();
  const {
    awaiting,
    isLoading: isLoadingProductsAwaiting,
    isError: isErrorProductsAwaiting,
  } = useProductsAwaitingApproval();
  const {
    total: totalCustomers,
    isLoading: isLoadingCustomers,
    isError: isErrorCustomers,
  } = useTotalCustomers();
  const {
    total: totalProducts,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useTotalProducts();
  const {
    total: totalCategories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useTotalCategories();
  const {
    total: totalOrders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
  } = useTotalOrders();
  const {
    total: totalManufacturers,
    isLoading: isLoadingManufacturers,
    isError: isErrorManufacturers,
  } = useTotalManufacturers();

  const isLoading =
    isLoadingAmount ||
    isLoadingPartners ||
    isLoadingProductsAwaiting ||
    isLoadingCustomers ||
    isLoadingProducts ||
    isLoadingCategories ||
    isLoadingOrders;
  isLoadingManufacturers;
  const isError =
    isErrorAmount ||
    isErrorPartners ||
    isErrorProductsAwaiting ||
    isErrorCustomers ||
    isErrorProducts ||
    isErrorCategories ||
    isErrorOrders;
  isErrorManufacturers;

  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      {isLoading && (
        <div className="flex min-h-[200px] w-full items-center justify-center">
          <svg
            className="h-10 w-10 animate-spin"
            style={{ color: "rgb(59 130 246 / var(--tw-text-opacity, 1))" }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
      {isError && <div>Error loading dashboard stats.</div>}
      {!isLoading && !isError && (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <TotalOrderAmountChart totalAmount={totalAmount} />
          <TotalOrdersChart total={totalOrders} />
          <PartnerStatusChart active={active} inactive={inactive} />
          <ProductsAwaitingApprovalChart awaiting={awaiting} />
          <TotalProductsChart total={totalProducts} />
          <TotalCustomersChart total={totalCustomers} />
          <TotalCategoriesChart total={totalCategories} />
          <TotalManufacturersChart total={totalManufacturers} />
          <div className="col-span-2 aspect-[4/3] w-full">
            <iframe
              className="h-full w-full"
              style={{
                background: "#FFFFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              src="https://charts.mongodb.com/charts-project-0-ionjeod/embed/charts?id=287ded69-41d8-48bf-94da-927f1e92befc&maxDataAge=14400&theme=light&autoRefresh=true"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-span-2 aspect-[4/3] w-full">
            <iframe
              className="h-full w-full"
              style={{
                background: "#FFFFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              src="https://charts.mongodb.com/charts-project-0-ionjeod/embed/charts?id=db3356f4-4bc7-4c74-830f-6278072ee2f3&maxDataAge=14400&theme=light&autoRefresh=true"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-span-2 aspect-[4/3] w-full">
            <iframe
              className="h-full w-full"
              style={{
                background: "#FFFFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              src="https://charts.mongodb.com/charts-project-0-ionjeod/embed/charts?id=3c6a5359-6b31-4312-8e8a-afb5cb1a8f38&maxDataAge=14400&theme=light&autoRefresh=true"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-span-2 aspect-[4/3] w-full">
            <iframe
              className="h-full w-full"
              style={{
                background: "#FFFFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              src="https://charts.mongodb.com/charts-project-0-ionjeod/embed/charts?id=8ea5ce81-3d6e-4c96-8298-bb67e9f7d963&maxDataAge=14400&theme=light&autoRefresh=true"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-span-2 aspect-[4/3] w-full">
            <iframe
              className="h-full w-full"
              style={{
                background: "#FFFFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              src="https://charts.mongodb.com/charts-project-0-ionjeod/embed/charts?id=64cb8e9c-9733-46f8-a96d-f46bc1398e8e&maxDataAge=14400&theme=light&autoRefresh=true"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-span-2 aspect-[4/3] w-full">
            <iframe
              className="h-full w-full"
              style={{
                background: "#FFFFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              src="https://charts.mongodb.com/charts-project-0-ionjeod/embed/charts?id=ee155459-cd7a-4736-850f-4dbafa6889f6&maxDataAge=14400&theme=light&autoRefresh=true"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-span-2 aspect-[4/3] w-full">
            <iframe
              className="h-full w-full"
              style={{
                background: "#FFFFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              src="https://charts.mongodb.com/charts-project-0-ionjeod/embed/charts?id=2c907aca-5444-4ed5-8660-bd804f836137&maxDataAge=14400&theme=light&autoRefresh=true"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-span-2 aspect-[4/3] w-full">
            <iframe
              className="h-full w-full"
              style={{
                background: "#FFFFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              src="https://charts.mongodb.com/charts-project-0-ionjeod/embed/charts?id=5a50f4aa-1959-4cfc-86b0-dfd0c99242dd&maxDataAge=14400&theme=light&autoRefresh=true"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-span-2 aspect-[4/3] w-full">
            <iframe
              className="h-full w-full"
              style={{
                background: "#FFFFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              src="https://charts.mongodb.com/charts-project-0-ionjeod/embed/charts?id=405f02cd-4bd1-4fea-a467-9c08bf8ef5c6&maxDataAge=14400&theme=light&autoRefresh=true"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-span-2 aspect-[4/3] w-full">
            <iframe
              className="h-full w-full"
              style={{
                background: "#FFFFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              src="https://charts.mongodb.com/charts-project-0-ionjeod/embed/charts?id=dcc30a52-c81f-4fb1-a1a0-d046e1e8a693&maxDataAge=14400&theme=light&autoRefresh=true"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
