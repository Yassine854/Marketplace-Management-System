import React, { useState, useEffect } from "react";
import CardDataStats from "../charts/CardDataStats";
import {
  FaClipboardList,
  FaMoneyBillWave,
  FaUsers,
  FaUndo,
} from "react-icons/fa";
import axios from "axios";
import orderData from "../../../../data_test.json";
import ProductRevenueLossChart from "../charts/ProductRevenueLossChart";
import TopArticlesOrdered from "../charts/TopArticlesOrdered";
import SupplierAreaChart from "../charts/SupplierAreaChart";
import RegionsOrders from "../charts/RegionsOrders";
import AvailableProducts from "../charts/AvailableProducts";
import DatePicker from "react-datepicker";
import ClientSegment from "../charts/ClientSegment";
import SupplierQuarterlyMetrics from "../charts/SupplierQuarterlyMetrics";
import SupplierCategoryPieChart from "../charts/SupplierCategoryPieChart";
import SupplierTopProductsChart from "../charts/SupplierTopProductsChart";
import InventoryTrendChart from "../charts/InventoryTrendChart";
import EmailFormPopup from "./email";
import "react-datepicker/dist/react-datepicker.css";

const supplierId = "27"; // Example supplier ID (e.g., Technofood)

const SupplierDashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null); // Default to null
  const [endDate, setEndDate] = useState<Date | null>(null); // Default to null
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/categories",
        );
        setCategories(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/orders");
        setOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchProducts();
    fetchOrders();
    fetchCategories();
  }, []);

  //Total orders
  const supplierProducts = products.filter(
    (p) => p.manufacturer === supplierId,
  );
  const supplierProductIds = new Set(supplierProducts.map((p) => p.product_id));

  const totalValidOrders = orders.filter(
    (order) =>
      order.state != "canceled" &&
      (!startDate || new Date(order.created_at) >= startDate) &&
      (!endDate || new Date(order.created_at) <= endDate) &&
      order.items.some((item: { product_id: number }) =>
        supplierProductIds.has(item.product_id),
      ),
  ).length;

  //Total unique customers
  const uniqueCustomers = new Set<number>();
  orders.forEach((order) => {
    if (
      order.state != "canceled" &&
      (!startDate || new Date(order.created_at) >= startDate) &&
      (!endDate || new Date(order.created_at) <= endDate) &&
      order.items.some((item: { product_id: number }) =>
        supplierProductIds.has(item.product_id),
      )
    ) {
      if (order.customer_id) {
        uniqueCustomers.add(order.customer_id);
      }
    }
  });
  const totalUniqueCustomers = uniqueCustomers.size;

  //Total returned products
  const totalReturns = orders
    .filter(
      (order) =>
        order.state !== "canceled" &&
        (!startDate || new Date(order.created_at) >= startDate) &&
        (!endDate || new Date(order.created_at) <= endDate),
    )
    .flatMap((order) => order.items)
    .filter(
      (item) =>
        supplierProductIds.has(item.product_id) && item.qty_refunded > 0,
    )
    .reduce((sum, item) => sum + item.qty_refunded, 0);

  //Chiffre d'affaires
  const totalTurnover = orders
    .filter(
      (order) =>
        order.state !== "canceled" &&
        (!startDate || new Date(order.created_at) >= startDate) &&
        (!endDate || new Date(order.created_at) <= endDate),
    )
    .flatMap((order) => order.items)
    .filter((item) => supplierProductIds.has(item.product_id))
    .reduce((sum, item) => {
      const product = products.find((p) => p.product_id === item.product_id);
      return sum + item.qty_invoiced * (product?.cost || 0);
    }, 0);

  const supplierDetails = orderData.products.find(
    (p) => p.product.supplier?.manufacturer_id === supplierId,
  )?.product.supplier;

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  // Filter orders based on the selected date range
  // const filteredOrders = orderData.orders.filter(({ order }) => {
  //   const orderDate = new Date(order.createdAt * 1000);
  //   return (
  //     (!startDate || orderDate >= startDate) &&
  //     (!endDate || orderDate <= endDate)
  //   );
  // });

  // const supplierStats = filteredOrders.reduce(
  //   (acc, { order }) => {
  //     const uniqueOrders = new Set();
  //     const uniqueCustomers = new Set(acc.uniqueCustomers);
  //     let orderProcessed = false;

  //     if (order.items) {
  //       order.items.forEach((item) => {
  //         if (
  //           "supplier" in item &&
  //           item.supplier?.manufacturer_id === supplierId
  //         ) {
  //           if (!orderProcessed) {
  //             if (order.state === "delivered" && order.status === "valid") {
  //               acc.deliveredOrders += 1;
  //             }
  //             orderProcessed = true;
  //           }

  //           if (!uniqueOrders.has(order.orderId)) {
  //             uniqueOrders.add(order.orderId);
  //             acc.totalOrders += 1;
  //           }

  //           if (order.state === "delivered" && order.status === "valid") {
  //             uniqueCustomers.add(order.customerId);
  //           }

  //           if (order.state === "canceled" && order.status === "invalid") {
  //             acc.totalReturns += parseInt(item.quantity);
  //           }
  //         }
  //       });
  //     }

  //     acc.totalCustomers = uniqueCustomers.size;
  //     acc.uniqueCustomers = uniqueCustomers;

  //     return acc;
  //   },
  //   {
  //     totalOrders: 0,
  //     totalTurnover: calculateTurnover(),
  //     deliveredOrders: 0,
  //     totalCustomers: 0,
  //     totalReturns: 0,
  //     uniqueCustomers: new Set(),
  //   },
  // );

  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-6">
      {/* Modified Date Pickers */}
      <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
        <div className="flex flex-col md:mr-4">
          <label htmlFor="startDate" className="text-lg">
            Date Début:
          </label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="yyyy/MM/dd"
            className="rounded border p-2 text-lg"
            isClearable
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-lg">
            Date Fin:
          </label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="yyyy/MM/dd"
            className="rounded border p-2 text-lg"
            isClearable
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <CardDataStats
          title="Chiffre d'affaires"
          total={`${totalTurnover.toFixed(2)} TND`}
        >
          <FaMoneyBillWave className="text-green-500" />
        </CardDataStats>

        <CardDataStats
          title="Totale des commandes"
          total={totalValidOrders.toString()}
        >
          <FaClipboardList className="text-blue-500" />
        </CardDataStats>

        <CardDataStats
          title="Clients Uniques"
          total={totalUniqueCustomers.toString()}
        >
          <FaUsers className="text-orange-500" />
        </CardDataStats>

        <CardDataStats
          title="Produits retournés"
          total={totalReturns.toString()}
        >
          <FaUndo className="text-red-500" />
        </CardDataStats>

        {/*   

        

        <CardDataStats
          title="Unique Paying Customers"
          total={supplierStats.totalCustomers.toString()}
        >
          <FaUsers className="text-orange-500" />
        </CardDataStats>

        */}
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <SupplierAreaChart supplierId={supplierId} />
        </div>
        <div className="mt-6">
          <SupplierQuarterlyMetrics supplierId={supplierId} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ProductRevenueLossChart supplierId={supplierId} />
        </div>
        <div>
          <AvailableProducts supplierId={supplierId} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-1">
        <div>
          <TopArticlesOrdered
            supplierId={supplierId}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <SupplierCategoryPieChart
            supplierId={supplierId}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div>
          <ClientSegment
            supplierId={supplierId}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <RegionsOrders supplierId={supplierId} />
        </div>
        <div>
          <SupplierTopProductsChart
            supplierId={supplierId}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div>
          <InventoryTrendChart supplierId={supplierId} />
        </div>
      </div>

      <button
        onClick={() => setShowEmailForm(true)}
        className="fixed bottom-10 right-10 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all hover:bg-blue-600 hover:shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
        </svg>
      </button>

      {/* Email Form Popup */}
      {showEmailForm && supplierDetails && (
        <EmailFormPopup
          onClose={() => setShowEmailForm(false)}
          supplierDetails={{
            company_name: supplierDetails.company_name,
            contact_name: supplierDetails.contact_name,
            phone_number: supplierDetails.phone_number,
            email: supplierDetails.email,
            address: `${supplierDetails.postal_code} ${supplierDetails.city}, ${supplierDetails.country}`,
          }}
        />
      )}
    </div>
  );
};

export default SupplierDashboard;
