import React from "react";
import { ReservationItem } from "../types/reservation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ReservationItem[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      role="dialog"
      aria-labelledby="reservation-items-modal"
      aria-hidden={!isOpen}
    >
      <div
        className="w-11/12 max-w-3xl transform rounded-lg bg-white p-8 shadow-xl transition-all duration-300 md:w-1/2 lg:w-2/3 xl:w-1/3"
        aria-labelledby="reservation-items-modal"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="reservation-items-modal"
            className="text-2xl font-semibold text-gray-800"
          >
            Reservation Items
          </h2>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="text-3xl text-gray-500 transition duration-200 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border bg-gray-50 p-4 shadow-sm transition-all duration-200 hover:bg-gray-100"
              >
                <div className="mb-2 font-semibold text-gray-900">
                  SKU: {item.sku}
                </div>
                <div className="space-y-3 text-sm text-gray-700">
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
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-3 text-lg text-white transition duration-300 hover:bg-gradient-to-l focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
