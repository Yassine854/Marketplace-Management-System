const fakeItems = [
  {
    id: 1,
    sku: "SKU1",
    name: "John Doe",
    shipped: "Technology",
    pcb: "Active",
    quantity: "Software Engineer",
    total: "JavaScript",
  },
  {
    id: 2,
    sku: "SKU2",
    name: "Jane Smith",
    shipped: "Healthcare",
    pcb: "Inactive",
    quantity: "Doctor",
    total: "Python",
  },
  {
    id: 3,
    sku: "SKU3",
    name: "Emily Davis",
    shipped: "Finance",
    pcb: "Active",
    quantity: "Accountant",
    total: "Excel",
  },
  {
    id: 4,
    sku: "SKU4",
    name: "Michael Brown",
    shipped: "Education",
    pcb: "Inactive",
    quantity: "Teacher",
    total: "Math",
  },
  {
    id: 5,
    sku: "SKU5",
    name: "Jessica Williams",
    shipped: "Retail",
    pcb: "Active",
    quantity: "Manager",
    total: "Sales",
  },
  {
    id: 6,
    sku: "SKU6",
    name: "David Jones",
    shipped: "Technology",
    pcb: "Inactive",
    quantity: "Developer",
    total: "Java",
  },
  {
    id: 7,
    sku: "SKU7",
    name: "Sarah Miller",
    shipped: "Healthcare",
    pcb: "Active",
    quantity: "Nurse",
    total: "Nursing",
  },
  {
    id: 8,
    sku: "SKU8",
    name: "Chris Wilson",
    shipped: "Finance",
    pcb: "Inactive",
    quantity: "Analyst",
    total: "Statistics",
  },
  {
    id: 9,
    sku: "SKU9",
    name: "Anna Moore",
    shipped: "Education",
    pcb: "Active",
    quantity: "Professor",
    total: "History",
  },
  {
    id: 10,
    sku: "SKU10",
    name: "James Taylor",
    shipped: "Retail",
    pcb: "Inactive",
    quantity: "Clerk",
    total: "Inventory",
  },
  {
    id: 11,
    sku: "SKU11",
    name: "Patricia Anderson",
    shipped: "Technology",
    pcb: "Active",
    quantity: "SysAdmin",
    total: "Networks",
  },
  {
    id: 12,
    sku: "SKU12",
    name: "Robert Thomas",
    shipped: "Healthcare",
    pcb: "Inactive",
    quantity: "Therapist",
    total: "Psychology",
  },
  {
    id: 13,
    sku: "SKU13",
    name: "Mary Jackson",
    shipped: "Finance",
    pcb: "Active",
    quantity: "Auditor",
    total: "Auditing",
  },
  {
    id: 14,
    sku: "SKU14",
    name: "Charles White",
    shipped: "Education",
    pcb: "Inactive",
    quantity: "Instructor",
    total: "Science",
  },
  {
    id: 15,
    sku: "SKU15",
    name: "Susan Harris",
    shipped: "Retail",
    pcb: "Active",
    quantity: "Salesperson",
    total: "Marketing",
  },
  {
    id: 16,
    sku: "SKU16",
    name: "Joseph Martin",
    shipped: "Technology",
    pcb: "Inactive",
    quantity: "Engineer",
    total: "C++",
  },
  {
    id: 17,
    sku: "SKU17",
    name: "Karen Thompson",
    shipped: "Healthcare",
    pcb: "Active",
    quantity: "Lab Technician",
    total: "Biology",
  },
  {
    id: 18,
    sku: "SKU18",
    name: "Thomas Garcia",
    shipped: "Finance",
    pcb: "Inactive",
    quantity: "Trader",
    total: "Economics",
  },
  {
    id: 19,
    sku: "SKU19",
    name: "Linda Martinez",
    shipped: "Education",
    pcb: "Active",
    quantity: "Lecturer",
    total: "English",
  },
  {
    id: 20,
    sku: "SKU20",
    name: "Daniel Robinson",
    shipped: "Retail",
    pcb: "Inactive",
    quantity: "Assistant",
    total: "Support",
  },
  {
    id: 21,
    sku: "SKU21",
    name: "Barbara Clark",
    shipped: "Technology",
    pcb: "Active",
    quantity: "Product Manager",
    total: "Agile",
  },
  {
    id: 22,
    sku: "SKU22",
    name: "Matthew Rodriguez",
    shipped: "Healthcare",
    pcb: "Inactive",
    quantity: "Pharmacist",
    total: "Chemistry",
  },
  {
    id: 23,
    sku: "SKU23",
    name: "Lisa Lewis",
    shipped: "Finance",
    pcb: "Active",
    quantity: "Consultant",
    total: "Consulting",
  },
  {
    id: 24,
    sku: "SKU24",
    name: "Steven Lee",
    shipped: "Education",
    pcb: "Inactive",
    quantity: "Dean",
    total: "Administration",
  },
  {
    id: 25,
    sku: "SKU25",
    name: "Michelle Walker",
    shipped: "Retail",
    pcb: "Active",
    quantity: "Cashier",
    total: "Transactions",
  },
];

import Head from "./OrderItemsTableHead";

import { useCounter } from "@uidotdev/usehooks";

import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
const ShippedCounter = () => {
  const min = 0;
  const max = 10;
  const [count, { increment, decrement, set, reset }] = useCounter(5, {
    min,
    max,
  });

  return (
    <div className="flex">
      <Button
        onClick={() => {
          if (count === max) {
            toast.error("You can't add more ");
          }

          increment();
        }}
        size="sm"
      >
        <p className="text-xl font-bold">+</p>
      </Button>
      <p className="flex w-12 justify-center text-2xl font-semibold">{count}</p>
      <Button
        className="link"
        onClick={() => {
          if (count === min) {
            toast.error("You can't remove more");
          }
          decrement();
        }}
        size="sm"
      >
        <p className="text-xl font-bold">-</p>
      </Button>
    </div>
  );
};

const OrderItemsTable = ({ items = fakeItems }: any) => {
  return (
    <div className="mb-6 w-full ">
      <table className="w-full whitespace-nowrap">
        <Head />
        <tbody>
          {items?.map(
            ({
              id,
              sku,
              productName,
              totalPrice,
              shipped,
              pcb,
              quantity,
            }: any) => (
              <tr key={id} className="even:bg-primary/5 dark:even:bg-bg3">
                <td className="px-3 py-2 text-center">{sku || "*****"}</td>
                <td className="px-3 py-1">
                  <div className="mr-6 flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="mb-1 inline-block font-medium">
                        {productName || "*****"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <ShippedCounter />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    {pcb || "*****"}
                  </div>
                </td>
                <td className="px-3 py-2">{quantity || "*****"}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">{totalPrice || "*****"} </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderItemsTable;
