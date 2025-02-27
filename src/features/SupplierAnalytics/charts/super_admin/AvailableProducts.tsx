import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import axios from "axios";

interface Product {
  product_id: number;
  name: string;
  sku: string;
  manufacturer: string;
  stock_item?: {
    qty: number;
    is_in_stock: boolean;
  };
}

const AvailableProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "sku" | "id">("name");
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        setProducts(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Échec du chargement des produits");
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Reset to first page when search criteria changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchBy]);

  const filteredProducts = products.filter((product) => {
    // First filter out products not in stock
    if (!product.stock_item?.is_in_stock) return false;

    // Then apply search filters
    if (!searchTerm) return true;

    const searchValue = searchTerm.toLowerCase();
    switch (searchBy) {
      case "name":
        return product.name.toLowerCase().includes(searchValue);
      case "sku":
        return product.sku.toLowerCase().includes(searchValue);
      case "id":
        return product.product_id.toString().includes(searchValue);
      default:
        return true;
    }
  });

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  if (isLoading) return <div>Chargement des produits...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Produits disponibles</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={searchBy}
            onChange={(e) =>
              setSearchBy(e.target.value as "name" | "sku" | "id")
            }
            className="rounded-md border p-2 text-sm"
          >
            <option value="name">Nom</option>
            <option value="sku">SKU</option>
            <option value="id">ID</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder={`Rechercher ...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border p-2 pl-8 text-sm"
            />
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm font-medium text-gray-600">
        Produits en stock: {totalProducts}
      </p>

      <div className="space-y-2">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product.product_id}
              className="rounded-lg border bg-white p-3 shadow-md transition duration-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="text-xs text-gray-500">
                    ID: {product.product_id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-sm text-gray-500">
                    SKU: {product.sku}
                  </span>
                  <span className="block text-sm text-gray-500">
                    Stock: {product.stock_item?.qty || 0}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            {searchTerm ? "Aucun résultat trouvé" : "Aucun produit en stock"}
          </div>
        )}
      </div>

      {totalProducts > productsPerPage && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="rounded-full bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
          >
            <FaArrowLeft />
          </button>

          <p className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
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
