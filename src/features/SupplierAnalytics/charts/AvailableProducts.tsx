import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import React Icons

import supplierData from "../../../../data_test.json"; // Ensure the path is correct

const AvailableProducts: React.FC<{ supplierId: string }> = ({
  supplierId,
}) => {
  // Filter available products based on the supplier ID and stock status
  const availableProducts = (supplierData as any).products.filter(
    (product: any) =>
      product.product.supplier.manufacturer_id === supplierId &&
      product.product.is_in_stock === "1",
  );

  // Get the total count of available products
  const totalAvailableProducts = availableProducts.length;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const totalPages = Math.ceil(totalAvailableProducts / productsPerPage);

  // Get the current products to display based on the current page
  const currentProducts = availableProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  // Handlers for pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
      {" "}
      {/* White background added here */}
      <h2 className="mb-3 text-xl font-semibold">Name of Available Products</h2>
      {/* Display the total count of available products */}
      <p className="mb-4 text-sm font-medium text-gray-600">
        Total Available Products: {totalAvailableProducts}
      </p>
      {/* List of Products */}
      <div className="space-y-2">
        {totalAvailableProducts > 0 ? (
          currentProducts.map((product: any) => (
            <div
              key={product.product.productId}
              className="rounded-lg border bg-white p-3 shadow-md transition duration-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  {product.product.productName}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No available products in stock for this supplier.
          </div>
        )}
      </div>
      {/* Pagination controls */}
      {totalAvailableProducts > productsPerPage && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="rounded-full bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
          >
            <FaArrowLeft />
          </button>

          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="rounded-full bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailableProducts;
