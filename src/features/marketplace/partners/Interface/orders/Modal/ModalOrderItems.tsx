import React from "react";
import { OrderItemWithRelations } from "../types/order";
import { X, Weight, DollarSign, ShoppingCart } from "lucide-react";

interface ModalOrderItemsProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItemWithRelations[];
  onUpdate?: (updatedItems: OrderItemWithRelations[]) => void;
}

const ModalOrderItems: React.FC<ModalOrderItemsProps> = ({
  isOpen,
  onClose,
  orderItems,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 
      ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div
        className={`relative w-10/12 max-w-2xl rounded-xl bg-white p-5 shadow-lg transition-all duration-300 
        ${isOpen ? "scale-100 transform" : "scale-95 transform opacity-0"}`}
      >
        <div className="mb-3 flex items-center justify-between border-b pb-2 transition-all duration-300">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 transition-all duration-300">
            <ShoppingCart className="h-5 w-5 text-green-600" /> Order Items
            Details
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 transition-all duration-300 hover:text-gray-800"
          >
            <X />
          </button>
        </div>

        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 max-h-56 overflow-y-auto rounded-md border bg-gray-50 p-2 shadow-inner transition-all duration-300">
          {orderItems.length > 0 ? (
            <ul className="space-y-3">
              {orderItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-1 rounded-md border bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="font-bold text-gray-900 transition-all duration-300">
                    SKU: {item.sku}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-700 transition-all duration-300">
                    <p>
                      <strong>Ordered:</strong> {item.qteOrdered}
                    </p>
                    <p>
                      <strong>Shipped:</strong> {item.qteShipped}
                    </p>
                    <p>
                      <strong>Refunded:</strong> {item.qteRefunded}
                    </p>
                    <p>
                      <strong>Canceled:</strong> {item.qteCanceled}
                    </p>
                    <p className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" /> Price:{" "}
                      {item.discountedPrice} DT
                    </p>
                    <p className="flex items-center gap-1">
                      Weight: {item.weight}{" "}
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
          className="mt-4 w-full rounded-md bg-gradient-to-r from-blue-500 to-blue-700 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalOrderItems;
