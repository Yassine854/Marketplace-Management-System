import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
type PurchaseOrderStatus = "IN_PROGRESS" | "READY" | "DELIVERED" | "COMPLETED";

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  manufacturer: {
    companyName: string;
  } | null;
  warehouse: {
    name: string;
  } | null;
  deliveryDate: Date;
  totalAmount: number;
  status: PurchaseOrderStatus;
  payments: {
    paymentMethod: string;
    amount: number;
  }[];
}
const paymentMethodColors: Record<string, string> = {
  CHEQUE: "bg-indigo-100 text-indigo-800",

  TRAITE: "bg-cyan-100 text-cyan-800",

  ESPECES: "bg-emerald-100 text-emerald-800",
};
const statusStyles: Record<
  PurchaseOrderStatus,
  { bg: string; text: string; icon: any }
> = {
  IN_PROGRESS: {
    bg: "bg-blue-50",

    text: "text-blue-700",

    icon: ClockIcon,
  },

  READY: {
    bg: "bg-amber-50",

    text: "text-amber-700",

    icon: ArchiveBoxIcon,
  },

  DELIVERED: {
    bg: "bg-green-50",

    text: "text-green-700",

    icon: TruckIcon,
  },

  COMPLETED: {
    bg: "bg-purple-50",

    text: "text-purple-700",

    icon: CheckCircleIcon,
  },
};

const PurchaseTableRow = ({ order }: { order: PurchaseOrder }) => {
  const StatusIcon = statusStyles[order.status].icon;

  return (
    <tr className="transition-colors duration-150 hover:bg-gray-50">
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
        <span className="font-mono">#{order.orderNumber}</span>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">
          {order.manufacturer?.companyName || "N/A"}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">
          {order.warehouse?.name || "N/A"}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">
          {format(new Date(order.deliveryDate), "dd MMM yyyy", { locale: fr })}
        </div>
      </td>

      <td className="px-6 py-4">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
            statusStyles[order.status].bg
          } ${statusStyles[order.status].text}`}
        >
          <StatusIcon className="h-4 w-4" />

          <span className="text-xs font-medium capitalize">
            {order.status.replace(/_/g, " ").toLowerCase()}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-gray-900">
          {order.totalAmount.toFixed(2)} DT
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {order.payments.map((payment, index) => (
            <span
              key={index}
              className={`rounded-full px-2.5 py-1 text-xs ${
                paymentMethodColors[payment.paymentMethod]
              }`}
            >
              {payment.paymentMethod.replace(/_/g, " ").toLowerCase()}
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
};

export default PurchaseTableRow;
