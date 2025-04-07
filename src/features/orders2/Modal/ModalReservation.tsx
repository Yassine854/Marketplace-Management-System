import React from "react";
import { OrderWithRelations } from "../types/order";
import {
  X,
  ShoppingCart,
  User,
  Package,
  CreditCard,
  Truck,
} from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation?: OrderWithRelations["reservation"];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, reservation }) => {
  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-10/12 max-w-2xl scale-100 transform rounded-xl bg-white p-5 shadow-lg transition-all hover:scale-[1.02]">
        <div className="mb-3 flex items-center justify-between border-b pb-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <ShoppingCart className="h-5 w-5 text-blue-600" /> Reservation
            Details
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 transition hover:text-gray-800"
          >
            <X />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
          <p>
            <strong className="text-gray-900">Amount Excl. Tax:</strong>{" "}
            {reservation.amountExclTaxe} DT
          </p>
          <p>
            <strong className="text-gray-900">Incl. Tax:</strong>{" "}
            {reservation.amountTTC} DT
          </p>
          <p>
            <strong className="text-gray-900">Before Discount:</strong>{" "}
            {reservation.amountBeforePromo} DT
          </p>
          <p>
            <strong className="text-gray-900">After Discount:</strong>{" "}
            {reservation.amountAfterPromo} DT
          </p>
          <p className="flex items-center gap-1">
            <Truck className="h-4 w-4 text-gray-900" />{" "}
            <strong>Shipping:</strong> {reservation.shippingMethod}
          </p>
          <p className="flex items-center gap-1">
            <User className="h-4 w-4 text-gray-900" />{" "}
            <strong>Customer:</strong>{" "}
            {reservation.customer
              ? `${reservation.customer.firstName} ${reservation.customer.lastName}`
              : "N/A"}
          </p>
          <p className="flex items-center gap-1">
            <CreditCard className="h-4 w-4 text-gray-900" />{" "}
            <strong>Payment:</strong>{" "}
            {reservation.paymentMethod ? reservation.paymentMethod.name : "N/A"}
          </p>
        </div>

        <h3 className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Package className="h-5 w-5 text-green-600" /> Reserved Items
        </h3>
        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 max-h-56 overflow-y-auto rounded-md border bg-gray-50 p-2 shadow-inner">
          {reservation?.reservationItems?.length > 0 ? (
            <ul className="space-y-3">
              {reservation.reservationItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-1 rounded-md border bg-white p-3 text-xs shadow-sm transition hover:shadow-md"
                >
                  <div className="font-bold text-gray-900">SKU: {item.sku}</div>
                  <div className="grid grid-cols-2 gap-1 text-gray-700">
                    <p>
                      <strong>Reserved:</strong> {item.qteReserved}
                    </p>
                    <p>
                      <strong>Price:</strong> {item.discountedPrice} DT
                    </p>
                    <p>
                      <strong>Weight:</strong> {item.weight}
                    </p>
                    <p>
                      <strong>Product:</strong> {item.product.name ?? "N/A"}
                    </p>
                    <p>
                      <strong>Tax:</strong> {item.tax.value ?? "N/A"} DT
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No items found.</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-md bg-gradient-to-r from-blue-500 to-blue-700 py-2 text-sm font-semibold text-white transition duration-300 hover:scale-105 hover:shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
