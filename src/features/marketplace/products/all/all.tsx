import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "@/libs/next-intl/i18nNavigation";
import { jsPDF } from "jspdf";

type Product = {
  id: string;
  sku: string;
  skuPartner?: string;
  name: string;
  description: string;
  price: number;
  cost?: number;
  stock: number | null;
  promo?: boolean;
  minimumQte?: number;
  maximumQte?: number;
  sealableAlertQte?: number;
  pcb?: string;
  weight?: number;
  supplier: {
    companyName: string;
  } | null;
  productStatus: {
    name: string;
    actif: boolean;
  } | null;
  images: Array<{ url: string }>;
  createdAt: string;
  updatedAt: string;
  productSubCategories: Array<{
    subcategory: {
      name: string;
    };
  }>;
  typePcbId?: string;
  productTypeId?: string;
  productStatusId?: string;
  supplierId?: string;
  taxId?: string;
  promotionId?: string;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Product>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/marketplace/products/getAll");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products);
      setCurrentPage(1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredData = products.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.sku.toLowerCase().includes(searchLower) ||
      item.id.toLowerCase().includes(searchLower)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    const strA = String(aValue ?? "").toLowerCase();
    const strB = String(bValue ?? "").toLowerCase();

    return sortOrder === "asc"
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (field: keyof Product) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleEdit = (id: string) => {
    router.push(`/marketplace/products/edit/${id}`);
  };

  const handleDownloadProductPDF = async (product: Product) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    let yPosition = 35;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text("Product Details", 15, 20);

    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated: ${date}`, 15, 28);

    // Product Information Table
    const columns = ["Field", "Value"];
    const rows = [
      ["Product ID", product.id],
      ["Name", product.name],
      ["SKU", product.sku],
      ["Price", `${product.price.toFixed(2)} DT`],
      ["Stock", product.stock ?? "N/A"],
      ["Supplier", product.supplier?.companyName ?? "N/A"],
      ["Status", product.productStatus?.name ?? "N/A"],
      [
        "Categories",
        product.productSubCategories
          .map((sc) => sc.subcategory.name)
          .join(", ") || "N/A",
      ],
      ["PCB", product.pcb || "N/A"],
      ["Weight", product.weight ? `${product.weight} kg` : "N/A"],
      ["Description", product.description || "N/A"],
    ];

    (doc as any).autoTable({
      startY: yPosition,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 12 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 120 },
      },
    });

    // Add images (smaller size)
    if (product.images.length > 0) {
      yPosition = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setTextColor(40, 53, 147);
      doc.text("Product Images", 15, yPosition);
      yPosition += 10;

      const imgWidth = 50; // Reduced width
      const imgHeight = 40; // Reduced height
      let xPosition = 15;
      let pageHeight = doc.internal.pageSize.height;

      for (const image of product.images) {
        try {
          const img = await loadImage(image.url);

          // Add image
          doc.addImage(img, "JPEG", xPosition, yPosition, imgWidth, imgHeight);

          // Update positions
          xPosition += imgWidth + 5;

          // Wrap to next line if needed
          if (xPosition + imgWidth > 190) {
            xPosition = 15;
            yPosition += imgHeight + 5;

            // Add new page if required
            if (yPosition + imgHeight > pageHeight - 20) {
              doc.addPage();
              yPosition = 15;
              pageHeight = doc.internal.pageSize.height;
            }
          }
        } catch (error) {
          console.error("Error loading image:", error);
        }
      }
    }

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 50,
        doc.internal.pageSize.height - 10,
      );
    }

    // Save PDF
    doc.save(`product-details-${product.sku}-${date}.pdf`);
  };

  // Helper function to load images
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/marketplace/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((item) => item.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Deletion failed");
    }
  };

  const handleCreate = () => {
    router.push("/marketplace/products/new");
  };

  return (
    <div className="mt-12 w-full px-3 py-6 duration-300 sm:px-4 lg:py-8 xxxl:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 lg:mb-8">
        <h2 className="h2">Products</h2>
        <div className="flex gap-4">
          <button
            onClick={handleCreate}
            className="btn hover:bg-primary-dark bg-primary text-white"
          >
            Add New
          </button>
        </div>
      </div>

      <div className="box">
        <div className="bb-dashed mb-6 flex flex-wrap items-center justify-between gap-3 pb-6">
          <p className="font-medium">Product List View</p>
          <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
            <form className="hidden w-full max-w-[250px] items-center justify-between gap-3 rounded-[30px] border border-transparent bg-primary/5 px-3 focus-within:border-primary dark:bg-bg3 md:flex xxl:px-5">
              <input
                placeholder="Search"
                className="w-full bg-transparent py-2 text-sm focus:outline-none"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button">{/* Search icon */}</button>
            </form>

            <div className="flex shrink-0 items-center gap-2">
              <p className="text-xs sm:text-sm">Sort By : </p>
              <div className="relative">
                <div
                  className="flex min-w-max cursor-pointer select-none items-center justify-between gap-2 rounded-[30px] border border-n30 bg-primary/5 px-3 py-1.5 text-xs dark:border-n500 dark:bg-bg3 sm:min-w-[140px] sm:px-4 sm:py-2"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  {sortBy === "name"
                    ? "Name"
                    : sortBy === "price"
                    ? "Price"
                    : sortBy === "stock"
                    ? "Stock"
                    : "SKU"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6l6 -6"></path>
                  </svg>
                </div>
                {isSortDropdownOpen && (
                  <ul className="absolute right-0 top-full z-20 min-w-max flex-col rounded-md border border-n30 bg-n0 p-1 shadow-md duration-300 dark:border-n500 dark:bg-bg4 sm:min-w-[140px]">
                    {["id", "name", "sku", "price", "stock"].map((field) => (
                      <li
                        key={field}
                        className="cursor-pointer rounded-md px-4 py-2 text-xs duration-300 hover:text-primary"
                        onClick={() => {
                          handleSort(field as keyof Product);
                          setIsSortDropdownOpen(false);
                        }}
                      >
                        {field === "name"
                          ? "Name"
                          : field === "sku"
                          ? "SKU"
                          : field === "price"
                          ? "Price"
                          : field === "stock"
                          ? "Stock"
                          : "ID"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bb-dashed mb-6 overflow-x-auto pb-6">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-primary/5 font-semibold dark:bg-bg3">
                <td className="p-5 pl-6">ID</td>
                <td className="p-5">Image</td>
                <td className="p-5">Name</td>
                <td className="p-5">Price</td>
                <td className="p-5">Stock</td>
                <td className="p-5">SKU</td>
                <td className="p-5">Supplier</td>
                <td className="p-5">Status</td>
                <td className="p-5 text-center">Action</td>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center">
                    No products found
                  </td>
                </tr>
              ) : (
                currentItems.map((product) => (
                  <tr
                    key={product.id}
                    className="even:bg-primary/5 even:dark:bg-bg3"
                  >
                    <td className="px-3 py-2 pl-6">{product.id}</td>
                    <td className="px-3 py-2">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-16 w-16 rounded object-cover"
                        />
                      ) : (
                        <span>No image</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{product.name}</td>
                    <td className="px-3 py-2">{product.price.toFixed(2)}DT</td>
                    <td className="px-3 py-2">{product.stock ?? "N/A"}</td>
                    <td className="px-3 py-2">{product.sku}</td>
                    <td className="px-3 py-2">
                      {product.supplier?.companyName ?? "N/A"}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`badge ${
                          product.productStatus?.actif
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {product.productStatus?.name ?? "N/A"}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex justify-center">
                        <div className="relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="cursor-pointer"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === product.id ? null : product.id,
                              )
                            }
                          >
                            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                            <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                            <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          </svg>

                          {openMenuId === product.id && (
                            <ul className="absolute right-0 top-full z-30 min-w-max rounded-md border border-n30 bg-white p-1.5 shadow-md dark:border-n500 dark:bg-bg4">
                              <li>
                                <button
                                  className="block w-full rounded-md px-3 py-1.5 text-left duration-300 hover:bg-primary hover:text-white"
                                  onClick={() => handleEdit(product.id)}
                                >
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="block w-full rounded-md px-3 py-1.5 text-left duration-300 hover:bg-blue-500 hover:text-white"
                                  onClick={() =>
                                    handleDownloadProductPDF(product)
                                  }
                                >
                                  Download PDF
                                </button>
                              </li>
                              <li>
                                <button
                                  className="block w-full rounded-md px-3 py-1.5 text-left duration-300 hover:bg-red-500 hover:text-white"
                                  onClick={() => {
                                    handleDelete(product.id);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  Delete
                                </button>
                              </li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="col-span-12 flex flex-wrap items-center justify-center gap-4 sm:justify-between">
          <p>
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredData.length)} of{" "}
            {filteredData.length} entries
          </p>
          <ul className="flex flex-wrap items-center gap-2 md:gap-3 md:font-semibold">
            <li>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary md:h-10 md:w-10 rtl:rotate-180"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 6l-6 6l6 6"></path>
                </svg>
              </button>
            </li>

            {[...Array(totalPages)].map((_, idx) => (
              <li key={idx}>
                <button
                  onClick={() => paginate(idx + 1)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-primary duration-300 hover:bg-primary hover:text-n0 md:h-10 md:w-10 ${
                    currentPage === idx + 1
                      ? "bg-primary text-n0"
                      : "border-primary"
                  }`}
                >
                  {idx + 1}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary md:h-10 md:w-10 rtl:rotate-180"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6l-6 6"></path>
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
