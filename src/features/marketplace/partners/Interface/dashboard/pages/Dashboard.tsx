"use client";
import { useGrowthBook } from "@growthbook/growthbook-react";
import { useEffect, useState } from "react";
import TotalOrderAmountChart from "../charts/TotalOrderAmountChart";
import { useTotalOrderAmount } from "../hooks/useTotalOrderAmount";
import TotalCustomersChart from "../charts/TotalCustomersChart";
import { useTotalCustomers } from "../hooks/useTotalCustomers";
import TotalProductsChart from "../charts/TotalProductsChart";
import { useTotalProducts } from "../hooks/useTotalProducts";
import TotalOrdersChart from "../charts/TotalOrdersChart";
import { useTotalOrders } from "../hooks/useTotalOrders";
import TotalOrdersMonth from "../charts/TotalOrdersMonth";
import OrderCountMonth from "../charts/OrderCountMonth";
import StockLevelsSource from "../charts/StockLevelsSource";
import MostOrderedProducts from "../charts/MostOrderedProducts";
import MostRefundedProducts from "../charts/MostRefundedProducts";
import OrderCountStatus from "../charts/OrderCountStatus";
import CustomerTypeDistribution from "../charts/CustomerTypeDistribution";
import TotalOrdersSource from "../charts/TotalOrdersSource";

const Dashboard = () => {
  const gb = useGrowthBook();
  const experiment = gb?.run({
    key: "dashboard-variant",
    variations: [0, 1], // 0: original, 1: new variant
  });
  const variant = experiment?.value ?? 0;

  const {
    totalAmount,
    isLoading: isLoadingAmount,
    isError: isErrorAmount,
  } = useTotalOrderAmount();

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
    total: totalOrders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
  } = useTotalOrders();

  const [interactionCount, setInteractionCount] = useState(0);
  const [hasEngaged, setHasEngaged] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState<number | null>(
    null,
  );

  const isLoading =
    isLoadingAmount ||
    isLoadingCustomers ||
    isLoadingProducts ||
    isLoadingOrders;

  const isError =
    isErrorAmount || isErrorCustomers || isErrorProducts || isErrorOrders;

  // Track meaningful interactions for both variants
  useEffect(() => {
    if (isLoading) return;

    const handleChartInteraction = () => {
      const now = Date.now();
      // Only count interactions that are at least 5 seconds apart
      if (!lastInteractionTime || now - lastInteractionTime > 5000) {
        setInteractionCount((prev) => prev + 1);
        setLastInteractionTime(now);

        // Log engagement if user interacts with 3+ different charts
        if (interactionCount >= 2 && !hasEngaged) {
          setHasEngaged(true);
          logExperimentGoal("meaningful_engagement");
        }
      }
    };

    // Add event listeners to all charts
    const charts = document.querySelectorAll(".chart-container");
    charts.forEach((chart) => {
      chart.addEventListener("click", handleChartInteraction);
      chart.addEventListener("mouseenter", handleChartInteraction);
    });

    return () => {
      charts.forEach((chart) => {
        chart.removeEventListener("click", handleChartInteraction);
        chart.removeEventListener("mouseenter", handleChartInteraction);
      });
    };
  }, [isLoading, interactionCount, lastInteractionTime, hasEngaged]);

  // Track time spent on dashboard
  useEffect(() => {
    if (isLoading) return;

    let timer: NodeJS.Timeout;

    // Log time spent after 30 seconds
    timer = setTimeout(() => {
      logExperimentGoal("time_spent_30s");
    }, 30000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  const logExperimentGoal = async (goalName: string) => {
    try {
      await fetch("/api/marketplace/experimentLogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: "dashboard-variant",
          variationId: variant,
          goalName,
        }),
      });
    } catch (error) {
      console.error("Error logging experiment goal:", error);
    }
  };

  if (isLoading) {
    return (
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
    );
  }

  if (isError) {
    return (
      <div className="mt-[4.8rem] p-4">Error loading dashboard stats.</div>
    );
  }

  // Variant 1 - New organized dashboard layout (without individual chart titles)
  if (variant === 1) {
    return (
      <div className="mt-[4.8rem] w-full bg-n20 p-4">
        <h1 className="mb-6 text-2xl font-bold">Dashboard Overview</h1>

        <div className="grid grid-cols-1 gap-6">
          {/* Top row - Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="chart-container">
              <TotalOrderAmountChart totalAmount={totalAmount} />
            </div>
            <div className="chart-container">
              <TotalOrdersChart total={totalOrders} />
            </div>
            <div className="chart-container">
              <TotalProductsChart total={totalProducts} />
            </div>
            <div className="chart-container">
              <TotalCustomersChart total={totalCustomers} />
            </div>
          </div>

          {/* Middle row - Main charts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="box chart-container p-4">
              <TotalOrdersMonth />
            </div>
            <div className="box chart-container p-4">
              <OrderCountMonth />
            </div>
          </div>

          {/* Bottom row - Additional insights */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="box chart-container p-4">
              <TotalOrdersSource />
            </div>
            <div className="box chart-container p-4">
              <CustomerTypeDistribution />
            </div>
            <div className="box chart-container p-4">
              <OrderCountStatus />
            </div>
            <div className="box chart-container p-4">
              <MostOrderedProducts />
            </div>
            <div className="box chart-container p-4">
              <MostRefundedProducts />
            </div>
            <div className="box chart-container p-4">
              <StockLevelsSource />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variant 0 - Original dashboard layout with 2 charts per row starting from TotalOrdersMonth
  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {/* First row - 4 summary cards */}
        <div className="chart-container">
          <TotalOrderAmountChart totalAmount={totalAmount} />
        </div>
        <div className="chart-container">
          <TotalOrdersChart total={totalOrders} />
        </div>
        <div className="chart-container">
          <TotalProductsChart total={totalProducts} />
        </div>
        <div className="chart-container">
          <TotalCustomersChart total={totalCustomers} />
        </div>
      </div>

      {/* Subsequent rows - 2 charts per row */}
      <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="chart-container">
          <TotalOrdersMonth />
        </div>
        <div className="chart-container">
          <OrderCountMonth />
        </div>
        <div className="chart-container">
          <TotalOrdersSource />
        </div>
        <div className="chart-container">
          <CustomerTypeDistribution />
        </div>
        <div className="chart-container">
          <OrderCountStatus />
        </div>
        <div className="chart-container">
          <MostOrderedProducts />
        </div>
        <div className="chart-container">
          <MostRefundedProducts />
        </div>
        <div className="chart-container">
          <StockLevelsSource />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
