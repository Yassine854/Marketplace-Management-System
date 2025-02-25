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
  const [supplierId, setSupplierId] = useState(""); // For holding the supplier ID input value
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // To toggle the visibility of dropdown & input field
  const router = useRouter();

  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

  const handleShowDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible); // Toggle dropdown visibility
  };

  const handleSupplierSelection = (selectedSupplierId: string) => {
    if (selectedSupplierId.trim()) {
      router.push(`/supplierDashboard?supplierId=${selectedSupplierId}`);
    }
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
          {" "}
          {/* Toggle dropdown visibility based on state */}
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
            {/* If the dropdown is visible, show the input and supplier selection */}
            {isDropdownVisible && (
              <div className="flex flex-col gap-3">
                {/* Supplier ID Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter Supplier ID"
                    className="w-full rounded-md border p-2"
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                  />
                  <button
                    className="rounded-md bg-blue-500 p-2 text-white"
                    onClick={() => handleSupplierSelection(supplierId)}
                  >
                    Go
                  </button>
                </div>
              </div>
            )}
          </ul>
        </AnimateHeight>
      </div>
    </div>
  );
};

export default SidebarSuppliersSubMenu;
