import { OrderWithRelations } from "../types/order";
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "../Modal/ModalReservation";
import ModalOrderItems from "../Modal/ModalOrderItems";
interface OrderTableRowProps {
  order: OrderWithRelations;
  onUpdate: (updatedOrder: OrderWithRelations) => void;
  onDelete: (id: string) => void;
  onEdit: (order: OrderWithRelations) => void;
  onDownload: (orderId: string) => void;
}

const OrderTableRow = ({
  order,
  onDelete,
  onEdit,
  onDownload,
}: OrderTableRowProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showOrderItemsModal, setShowOrderItemsModal] = useState(false);
  return (
    <>
      <tr>
        <td className="px-6 py-4">{order.id}</td>
        <td className="px-6 py-4">{order.amountExclTaxe}</td>
        <td className="px-6 py-4">{order.amountTTC}</td>
        <td className="px-6 py-4">{order.amountBeforePromo}</td>
        <td className="px-6 py-4">{order.amountAfterPromo}</td>
        <td className="px-6 py-4">{order.amountRefunded}</td>
        <td className="px-6 py-4">{order.amountCanceled}</td>
        <td className="px-6 py-4">{order.amountOrdered}</td>
        <td className="px-6 py-4">{order.amountShipped}</td>
        <td className="px-6 py-4">{order.shippingMethod}</td>
        <td className="px-6 py-4">{order.loyaltyPtsValue}</td>
        <td className="px-6 py-4">{order.isActive ? "Yes" : "No"}</td>
        <td className="px-6 py-4">{order.fromMobile ? "Yes" : "No"}</td>
        <td className="px-6 py-4">{order.weight}</td>
        <td className="px-6 py-4">
          {new Date(order.createdAt).toLocaleString()}
        </td>
        <td className="px-6 py-4">
          {new Date(order.updatedAt).toLocaleString()}
        </td>
        <td className="px-6 py-4">{order.status.name}</td>
        <td className="px-6 py-4">{order.state.name}</td>
        <td className="px-6 py-4">
          {order.customer.firstName} {order.customer.lastName}
        </td>
        <td className="px-6 py-4">
          {order.agent
            ? `${order.agent.firstName} ${order.agent.lastName}`
            : "N/A"}
        </td>
        <td className="px-6 py-4">
          {order.reservation ? (
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setShowModal(true)}
            >
              View Reservation ({order.reservation.reservationItems.length})
            </button>
          ) : (
            "No Reservation"
          )}
        </td>
        <td className="px-6 py-4">
          {order.partner.firstName} {order.partner.lastName}
        </td>
        <td className="px-6 py-4">
          {order.orderItems.length > 0 ? (
            <button
              className="flex items-center gap-1 text-green-600 hover:underline"
              onClick={() => setShowOrderItemsModal(true)}
            >
              View Order Items ({order.orderItems.length})
            </button>
          ) : (
            "No Items"
          )}
        </td>{" "}
        <td className="px-6 py-4">{order.paymentMethod.name}</td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(order)}
              className="text-gray-500 hover:text-blue-600"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(order.id)}
              className="text-gray-500 hover:text-red-600"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDownload(order.id)}
              className="text-gray-500 hover:text-green-600"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>

      {order.reservation && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          reservation={order.reservation}
        />
      )}
      {order.orderItems.length > 0 && (
        <ModalOrderItems
          isOpen={showOrderItemsModal}
          onClose={() => setShowOrderItemsModal(false)}
          orderItems={order.orderItems}
        />
      )}
    </>
  );
};

export default OrderTableRow;
