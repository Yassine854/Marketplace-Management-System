import { useState, useEffect } from "react";
import AnimateHeight from "react-animate-height";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import SidebarButton from "../SidebarButton";
import SidebarSubMenuItem from "../SidebarSubMenuItem";
import { IconDeviceAnalytics } from "@tabler/icons-react";
import { useRouter } from "@/libs/next-intl/i18nNavigation";

const SidebarSuppliersSubMenu = ({
  isActive = false,
  items = [],
  selectedSupplierStatus,
  onSubMenuItemClick = () => {},
}: any) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const [searchTerm, setSearchTerm] = useState("");
  const [allSuppliers, setAllSuppliers] = useState<any[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

  // Fetch all suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/suppliers");
        const data = await response.json();
        setAllSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isDropdownVisible) {
      fetchSuppliers();
    }
  }, [isDropdownVisible]);

  // Filter suppliers locally
  useEffect(() => {
    const filterSuppliers = () => {
      if (!searchTerm) {
        setFilteredSuppliers([]);
        return;
      }

      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = allSuppliers.filter((supplier) => {
        const idMatch = supplier.manufacturer_id
          .toString()
          .includes(lowerSearchTerm);
        const nameMatch = supplier.company_name
          .toLowerCase()
          .includes(lowerSearchTerm);
        return idMatch || nameMatch;
      });

      setFilteredSuppliers(filtered);
    };

    const debounceTimer = setTimeout(filterSuppliers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, allSuppliers]);

  const handleShowDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
    setSearchTerm("");
    setFilteredSuppliers([]);
  };

  const handleSupplierSelect = (supplier: any) => {
    setSelectedSupplier(supplier);
    router.push(`/supplierDashboard?supplierId=${supplier.manufacturer_id}`);
    setIsDropdownVisible(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative rounded-xl duration-300 ${
          isActive && "bg-primary/5 dark:bg-bg3"
        }`}
      >
        <SidebarButton
          onClick={handleShowDropdown}
          isActive={isActive}
          withSubMenu
          isOpen={isOpen}
          name="Suppliers"
          icon={<IconDeviceAnalytics />}
        />

        <AnimateHeight height={isDropdownVisible ? "auto" : 0}>
          <ul className="px-3 py-3 4xl:px-5">
            <SidebarSubMenuItem
              key="all-suppliers"
              name="All Suppliers"
              onClick={() => router.push("/suppliers")}
              isActive={selectedSupplierStatus === "all"}
            />

            {items.map(({ name, status }: any) => (
              <SidebarSubMenuItem
                key={name}
                name={name}
                onClick={() => onSubMenuItemClick(status)}
                isActive={selectedSupplierStatus === status}
              />
            ))}

            <Divider />

            {isDropdownVisible && (
              <div className="relative flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by ID or name..."
                    className="w-full rounded-md border p-2 pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  {isLoading && (
                    <div className="absolute right-3 top-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
                    </div>
                  )}
                </div>

                {!isLoading && filteredSuppliers.length > 0 && (
                  <div className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                    {filteredSuppliers.map((supplier) => (
                      <div
                        key={supplier._id}
                        className="cursor-pointer p-2 hover:bg-gray-100"
                        onClick={() => handleSupplierSelect(supplier)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            ID: {supplier.manufacturer_id}
                          </span>
                          <span className="text-sm text-gray-500">
                            {supplier.code}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          {supplier.company_name}
                        </div>
                        <div className="text-sm text-gray-400">
                          Contact: {supplier.contact_name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isLoading && filteredSuppliers.length === 0 && searchTerm && (
                  <div className="p-2 text-gray-500">
                    No matching suppliers found
                  </div>
                )}
              </div>
            )}
          </ul>
        </AnimateHeight>
      </div>
    </div>
  );
};

export default SidebarSuppliersSubMenu;
