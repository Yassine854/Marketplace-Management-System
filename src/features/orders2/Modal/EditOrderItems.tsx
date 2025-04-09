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
    const invalidItemIndex = updatedOrderItems.findIndex(
      (item) =>
        item.qteCanceled + item.qteRefunded + item.qteShipped > item.qteOrdered,
    );

    if (invalidItemIndex !== -1) {
      setError(
        `Item ${
          invalidItemIndex + 1
        }: The sum of Canceled, Refunded and Shipped quantities cannot exceed Ordered quantity.`,
      );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div className="space-y-2 border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Order Items</h2>
          <p className="text-sm text-gray-500">
            Update quantities and prices for order items
          </p>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="space-y-8">
            {updatedOrderItems.map((item, index) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Item {index + 1}
                  </h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    SKU: {item.sku}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Quantity Ordered
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.qteOrdered}
                      onChange={(e) =>
                        handleOrderItemChange(
                          index,
                          "qteOrdered",
                          Number(e.target.value),
                        )
                      }
                      className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Quantity Shipped
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.qteShipped}
                      onChange={(e) =>
                        handleOrderItemChange(
                          index,
                          "qteShipped",
                          Number(e.target.value),
                        )
                      }
                      className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Quantity Refunded
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.qteRefunded}
                      onChange={(e) =>
                        handleOrderItemChange(
                          index,
                          "qteRefunded",
                          Number(e.target.value),
                        )
                      }
                      className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Quantity Canceled
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.qteCanceled}
                      onChange={(e) =>
                        handleOrderItemChange(
                          index,
                          "qteCanceled",
                          Number(e.target.value),
                        )
                      }
                      className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Discounted Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        DT
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discountedPrice}
                        onChange={(e) =>
                          handleOrderItemChange(
                            index,
                            "discountedPrice",
                            Number(e.target.value),
                          )
                        }
                        className="block w-full rounded-lg border border-gray-300 p-2.5 pl-8 text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Weight
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={item.weight}
                      onChange={(e) =>
                        handleOrderItemChange(
                          index,
                          "weight",
                          Number(e.target.value),
                        )
                      }
                      className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrderItemsForm;
