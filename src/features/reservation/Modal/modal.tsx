import React from "react";
import { ReservationItem } from "../types/reservation";
import { X, Package, Scale, Tag, Box, Percent, Info } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ReservationItem[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-items-modal"
    >
      <div
        className={`w-[95%] max-w-2xl transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 ease-out sm:w-[90%] md:p-8 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-indigo-600" />
            <h2
              id="reservation-items-modal"
              className="text-xl font-bold text-gray-800 md:text-2xl"
            >
              Reservation Items
              <span className="ml-2 text-sm font-medium text-gray-500">
                ({items.length} items)
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 mt-6 max-h-[60vh] overflow-y-auto pr-2">
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Box className="h-8 w-8" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.productName ?? "Unknown Product"}
                      </h3>
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                        {item.sku}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                      <div className="flex items-center text-gray-600">
                        <Tag className="mr-2 h-4 w-4 text-indigo-500" />
                        <span>
                          <span className="font-medium">Price:</span>{" "}
                          {item.discountedPrice} DT
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Percent className="mr-2 h-4 w-4 text-indigo-500" />
                        <span>
                          <span className="font-medium">Reserved:</span>{" "}
                          {item.qteReserved}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Scale className="mr-2 h-4 w-4 text-indigo-500" />
                        <span>
                          <span className="font-medium">Weight:</span>{" "}
                          {item.weight}
                        </span>
                      </div>
                      {item.taxValue && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-2 h-4 w-4 text-indigo-500">
                            %
                          </span>
                          <span>
                            <span className="font-medium">Tax:</span>{" "}
                            {item.taxValue} DT
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex justify-end border-t pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
