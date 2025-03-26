import React from "react";
import { ReservationItem } from "../types/reservation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ReservationItem[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;
  console.log(items);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="w-11/12 max-w-3xl rounded-lg bg-white p-6 shadow-lg md:w-1/2 lg:w-2/3 xl:w-1/3">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Reservation Items
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="border-b border-gray-200 pb-4">
                <div className="mb-2 font-semibold text-gray-900">
                  SKU: {item.sku}
                </div>
                <div className="text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Reserved Quantity:</span>{" "}
                    {item.qteReserved}
                  </div>
                  <div>
                    <span className="font-medium">Canceled Quantity:</span>{" "}
                    {item.qteCanceled}
                  </div>
                  <div>
                    <span className="font-medium">Discounted Price:</span>{" "}
                    {item.discountedPrice} DT
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span> {item.weight}{" "}
                    kg
                  </div>
                  <div>
                    <span className="font-medium">Product Name:</span>{" "}
                    {item.productName ?? "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Tax Value:</span>{" "}
                    {item.taxValue ?? "N/A"} DT
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-blue-600 py-2 text-white transition duration-200 hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
