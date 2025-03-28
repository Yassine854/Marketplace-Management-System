import { useState } from "react";
import { OrderItemWithRelations } from "../types/order";

const EditOrderItemsForm = ({
  orderItems,
  onClose,
  onUpdate,
  isOpen,
}: {
  orderItems: OrderItemWithRelations[];
  onClose: () => void;
  onUpdate: (updatedItems: OrderItemWithRelations[]) => void;
  isOpen: boolean;
}) => {
  const [updatedOrderItems, setUpdatedOrderItems] = useState<
    OrderItemWithRelations[]
  >([...orderItems]);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleOrderItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...updatedOrderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setUpdatedOrderItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      updatedOrderItems.some(
        (item) => item.qteOrdered < 0 || item.discountedPrice < 0,
      )
    ) {
      setError("Quantities and prices must be non-negative.");
      return;
    }

    setError("");

    try {
      for (const item of updatedOrderItems) {
        const updatedItem = {
          qteOrdered: item.qteOrdered,
          qteRefunded: item.qteRefunded,
          qteShipped: item.qteShipped,
          qteCanceled: item.qteCanceled,
          discountedPrice: item.discountedPrice,
          weight: item.weight,
          sku: item.sku,
        };

        const response = await fetch(
          `/api/marketplace/order_items/${item.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedItem),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to update item with ID ${item.id}`);
        }
      }

      onUpdate(updatedOrderItems);
      onClose();
    } catch (error) {
      setError(`An error occurred: ${(error as Error).message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6 backdrop-blur-md transition-opacity duration-300">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[80vh] w-full max-w-3xl transform space-y-6 overflow-y-auto rounded-lg bg-white p-10 shadow-lg transition-all hover:scale-105"
      >
        <h2 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
          Edit Order Items
        </h2>

        <div className="space-y-8">
          {updatedOrderItems.map((item, index) => (
            <div key={item.id} className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-800">
                Item {index + 1}
              </h4>
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={item.sku}
                    onChange={(e) =>
                      handleOrderItemChange(index, "sku", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter SKU"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity Ordered
                  </label>
                  <input
                    type="number"
                    value={item.qteOrdered}
                    onChange={(e) =>
                      handleOrderItemChange(
                        index,
                        "qteOrdered",
                        Number(e.target.value),
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Quantity Ordered"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity Refunded
                  </label>
                  <input
                    type="number"
                    value={item.qteRefunded}
                    onChange={(e) =>
                      handleOrderItemChange(
                        index,
                        "qteRefunded",
                        Number(e.target.value),
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Quantity Refunded"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity Shipped
                  </label>
                  <input
                    type="number"
                    value={item.qteShipped}
                    onChange={(e) =>
                      handleOrderItemChange(
                        index,
                        "qteShipped",
                        Number(e.target.value),
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Quantity Shipped"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity Canceled
                  </label>
                  <input
                    type="number"
                    value={item.qteCanceled}
                    onChange={(e) =>
                      handleOrderItemChange(
                        index,
                        "qteCanceled",
                        Number(e.target.value),
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Quantity Canceled"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    value={item.discountedPrice}
                    onChange={(e) =>
                      handleOrderItemChange(
                        index,
                        "discountedPrice",
                        Number(e.target.value),
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Discounted Price"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Weight
                  </label>
                  <input
                    type="number"
                    value={item.weight}
                    onChange={(e) =>
                      handleOrderItemChange(
                        index,
                        "weight",
                        Number(e.target.value),
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Weight"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-6">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-8 py-3 text-lg font-semibold text-gray-700 shadow-md transition-all hover:bg-gray-300 focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrderItemsForm;
