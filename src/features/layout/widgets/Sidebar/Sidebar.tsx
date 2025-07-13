import {
  IconX,
  IconBell,
  IconMap2,
  IconUsers,
  IconReport,
  IconDashboard,
  IconList,
  IconShoppingCart,
  IconDeviceAnalytics,
  IconCurrencyDollar,
  IconDiscount,
  IconBuildingFactory2,
  IconClipboardCheck,
  IconPackage,
  IconBox,
  IconCreditCard,
  IconUser,
  IconTruck,
  IconPhoto,
  IconSettings,
  IconDatabase,
  IconBuildingStore,
  IconUserCheck,
  IconShield,
  IconCalendarEvent,
  IconCategory,
} from "@tabler/icons-react";
import { FaBoxOpen } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { statuses } from "./statuses";
import { useSidebar } from "./useSidebar";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import SidebarButton from "@/features/shared/elements/SidebarElements/SidebarButton";
import SidebarSubMenu from "@/features/shared/elements/SidebarElements/SidebarSubMenu";
import SidebarOrdersSubMenu from "@/features/shared/elements/SidebarElements/SidebarOrdersSubMenu";
import path from "path";
import SidebarSuppliersSubMenu from "@/features/shared/elements/SidebarElements/SidebarSuppliersSubMenu";
import { useState, useEffect } from "react";
import { useAuth } from "../../../shared/hooks/useAuth";

const Sidebar = ({
  isAdmin,
  setSidebar,
  isNoEditUser,
  sidebarIsOpen,
  onOrderStatusClick,
}: any) => {
  const {
    push,
    pathname,
    sidebarRef,
    selectedStatus,
    openOrdersCount,
    validOrdersCount,
    readyOrdersCount,
  } = useSidebar(setSidebar);

  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState<any[]>([]);
  const [isPartner, setIsPartner] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch(
          "/api/marketplace/role_permissions/getAll",
        );
        const data = await response.json();

        if (data.rolePermissions) {
          const myPermissions = data.rolePermissions.filter(
            (rp: any) => rp.roleId === user?.mRoleId,
          );
          setUserPermissions(myPermissions);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    if (user?.mRoleId) {
      fetchPermissions();
    }
  }, [user?.mRoleId]);

  useEffect(() => {
    // Check if user is a partner based on userType
    if (user) {
      setIsPartner(user.userType === "partner");
    }
  }, [user]);

  const hasPermission = (resource: string) => {
    if (isAdmin) return true;

    return userPermissions.some(
      (rp) =>
        rp.permission?.resource === resource && rp.actions.includes("read"),
    );
  };

  return (
    <aside
      className={`z-[21] w-[280px] shadow-sm xxxl:w-[336px] ${
        sidebarIsOpen
          ? "visible translate-x-0"
          : "invisible ltr:-translate-x-full rtl:translate-x-full"
      } sidebar fixed top-0 h-full bg-n0 duration-300 dark:bg-bg4 ltr:left-0 rtl:right-0`}
      ref={sidebarRef}
    >
      <div className={`p-5`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <Image
              src="/uploads/logo.png"
              alt="Logo"
              width={50}
              height={5}
              className="mx-auto h-auto"
              priority
            />
          </div>
          <button
            onClick={() => setSidebar(false)}
            className="rounded-full p-2 transition-colors hover:bg-primary/10"
          >
            <IconX />
          </button>
        </div>
      </div>
      <div className="fixed left-0 right-0 h-full overflow-y-auto pb-12">
        <div className="min-h-[70%] px-4 pb-24 xxl:px-6 xxxl:px-8">
          <Divider />

          {/* Dashboard - show based on user type */}
          {isAdmin && (
            <>
              <SidebarSubMenu
                onClick={() => push("/marketplace/dashboard")}
                name={"Dashboard"}
                icon={<IconDashboard />}
                isActive={pathname === "/marketplace/dashboard"}
                items={[
                  { name: "All", path: "/marketplace/dashboard" },
                  {
                    name: "Client Segmentation",
                    path: "/marketplace/dashboard/client-segments",
                  },
                ].filter(Boolean)}
              />
              <Divider />
            </>
          )}
          {isPartner && (
            <>
              <SidebarButton
                onClick={() => push("/marketplace/partners/dashboard")}
                name={"Dashboard"}
                icon={<IconDashboard />}
                isActive={pathname === "/marketplace/partners/dashboard"}
              />
              <Divider />
            </>
          )}

          {/* Suppliers Analytics */}
          {/* {hasPermission("Supplier Dashboard") && (
            <>
              <SidebarSuppliersSubMenu
                name={"Supplier Dashboard"}
                icon={<IconDeviceAnalytics />}
                isActive={pathname?.includes("supplierDashboard")}
              />
              <Divider />
            </>
          )} */}

          {/* Products */}
          {isAdmin && hasPermission("Product") && (
            <>
              <SidebarSubMenu
                icon={<IconPackage />}
                name="Products"
                onClick={() => push("/marketplace/products")}
                isActive={pathname?.includes("products")}
                items={[
                  { name: "All", path: "/marketplace/products" },
                  {
                    name: "Pending",
                    path: "/marketplace/products/PendingProducts",
                  },
                  ...(hasPermission("Category")
                    ? [
                        {
                          name: "Categories",
                          path: "/marketplace/products/categories",
                        },
                      ]
                    : []),
                  ...(hasPermission("Brand")
                    ? [
                        {
                          name: "Brands",
                          path: "/marketplace/products/brands",
                        },
                      ]
                    : []),
                  ...(hasPermission("Manufacturers")
                    ? [
                        {
                          name: "Manufacturers",
                          path: "/marketplace/products/suppliers",
                        },
                      ]
                    : []),
                  ...(hasPermission("Tax")
                    ? [
                        {
                          name: "Taxes",
                          path: "/marketplace/products/tax",
                        },
                      ]
                    : []),
                  // ...(hasPermission("Promotion")
                  //   ? [
                  //       {
                  //         name: "Promotions",
                  //         path: "/marketplace/products/promotion/all",
                  //       },
                  //     ]
                  //   : []),
                  ...(hasPermission("Product Type")
                    ? [
                        {
                          name: "Product Types",
                          path: "/marketplace/products/ProductTypes",
                        },
                      ]
                    : []),
                  ...(hasPermission("Product Statuses")
                    ? [
                        {
                          name: "Product Status",
                          path: "/marketplace/products/ProductStatus",
                        },
                      ]
                    : []),
                  ...(hasPermission("Type PCB")
                    ? [
                        {
                          name: "Type PCBs",
                          path: "/marketplace/products/ProductPCBType",
                        },
                      ]
                    : []),
                ].filter(Boolean)}
              />
              <Divider />
            </>
          )}

          {/* Partner Interface */}
          {isPartner && hasPermission("Product") && (
            <>
              <SidebarSubMenu
                icon={<IconPackage />}
                name="Products"
                onClick={() => push("/marketplace/partners/products")}
                isActive={pathname?.includes("products")}
                items={[
                  { name: "All", path: "/marketplace/partners/products" },
                ].filter(Boolean)}
              />
              <Divider />
            </>
          )}

          {/* Partner Interface */}
          {isPartner && (
            <>
              <SidebarSubMenu
                icon={<IconDatabase />}
                name=" Sources"
                onClick={() => push("/marketplace/source")}
                isActive={pathname?.includes("source")}
                items={[{ name: "All Sources", path: "/marketplace/source" }]}
              />
              <Divider />
            </>
          )}

          {/* Admin Interface */}
          {isAdmin && hasPermission("Partner") && (
            <>
              <SidebarSubMenu
                icon={<IconBuildingStore />}
                name=" Partners"
                onClick={() => push("/marketplace/partners")}
                isActive={
                  pathname === "/marketplace/partners" ||
                  pathname === "/marketplace/settings" ||
                  pathname === "/marketplace/partners/type_partners"
                }
                items={[
                  { name: "All partners", path: "/marketplace/partners" },
                  {
                    name: "Partner Settings",
                    path: "/marketplace/settings",
                  },
                  {
                    name: "Partner Types",
                    path: "/marketplace/partners/type_partners",
                  },
                ]}
              />
              <Divider />
            </>
          )}

          {/* Orders */}
          {/* {isAdmin && (
            <>
              <SidebarOrdersSubMenu
                onClick={() => push("/orders")}
                items={statuses}
                isAdmin={isAdmin}
                selectedStatus={selectedStatus}
                openOrdersCount={openOrdersCount}
                readyOrdersCount={readyOrdersCount}
                validOrdersCount={validOrdersCount}
                onSubMenuItemClick={onOrderStatusClick}
                isActive={
                  pathname?.includes("order") &&
                  !pathname?.includes("audit-trail")
                }
              />
              <Divider />
            </>
          )} */}

          {/* Milk Run */}
          {/* {hasPermission("Milk Run") && (
            <>
              <SidebarSubMenu
                icon={<IconMap2 />}
                name={"Milk Run"}
                onClick={() => push("/milk-run")}
                isActive={pathname?.includes("milk-run")}
                items={
                  isNoEditUser
                    ? [{ name: "History", path: "/milk-run-history" }]
                    : [
                        { name: "Main", path: "/milk-run" },
                        { name: "History", path: "/milk-run-history" },
                      ]
                }
              />
              <Divider />
            </>
          )} */}

          {/* Purchase order */}
          {/* {isAdmin && (
            <>
              <SidebarSubMenu
                icon={<IconShoppingCart />}
                name="Purchase order"
                onClick={() => push("/suppliers/all")}
                isActive={pathname?.includes("suppliers")}
                items={[
                  { name: "All", path: "/suppliers/all" },
                  { name: "In Progress", path: "/suppliers/inProg" },
                  { name: "Ready", path: "/suppliers/readyState" },
                  { name: "Delivered", path: "/suppliers/deliveredState" },
                  { name: "Completed", path: "/suppliers/completedState" },
                ]}
              />
              <Divider />
            </>
          )} */}

          {/* Admin Interface */}
          {isAdmin && hasPermission("Reservation") && (
            <>
              <SidebarSubMenu
                icon={<IconCalendarEvent />}
                name="Reservations"
                onClick={() => push("/marketplace/reservations")}
                isActive={pathname?.includes("reservation")}
                items={[{ name: "All", path: "/marketplace/reservations" }]}
              />
              <Divider />
            </>
          )}

          {/* Partner Interface */}
          {isPartner && hasPermission("Reservation") && (
            <>
              <SidebarSubMenu
                icon={<IconCalendarEvent />}
                name="Reservations"
                onClick={() => push("/marketplace/partners/reservations")}
                isActive={pathname?.includes("reservation")}
                items={[
                  { name: "All", path: "/marketplace/partners/reservations" },
                ]}
              />
              <Divider />
            </>
          )}

          {/* Admin Interface */}
          {isAdmin && hasPermission("Order") && (
            <>
              <SidebarSubMenu
                icon={<IconBox />}
                name=" Orders"
                onClick={() => push("/marketplace/order")}
                isActive={
                  pathname?.toLowerCase().includes("order") ||
                  pathname?.toLowerCase().includes("payment method")
                }
                items={[
                  { name: "All", path: "/marketplace/order" },
                  { name: "State", path: "/marketplace/order/state" },
                  { name: "Status", path: "/marketplace/order/status" },
                  {
                    name: "payment methods",
                    path: "/marketplace/PaymentMethod",
                  },
                ]}
              />
              <Divider />
            </>
          )}

          {/* Partner Interface */}
          {isPartner && hasPermission("Order") && (
            <>
              <SidebarSubMenu
                icon={<IconBox />}
                name=" Orders"
                onClick={() => push("/marketplace/partners/orders")}
                isActive={pathname?.toLowerCase().includes("orders")}
                items={[
                  { name: "All", path: "/marketplace/partners/orders" },
                  { name: "Open", path: "/marketplace/partners/orders/Open" },
                  { name: "Valid", path: "/marketplace/partners/orders/Valid" },
                  {
                    name: "ReadyToShip",
                    path: "/marketplace/partners/orders/ReadyToShip",
                  },
                  {
                    name: "Shipped",
                    path: "/marketplace/partners/orders/Shipped",
                  },
                  {
                    name: "Delivered",
                    path: "/marketplace/partners/orders/Delivered",
                  },
                  {
                    name: "Canceled",
                    path: "/marketplace/partners/orders/Canceled",
                  },
                  {
                    name: "Unpaid",
                    path: "/marketplace/partners/orders/Unpaid",
                  },
                  {
                    name: "Archived",
                    path: "/marketplace/partners/orders/Archived",
                  },
                ]}
              />
              <Divider />
            </>
          )}

          {/* Reports */}
          {/* {hasPermission("Reports") && (
            <>
              <SidebarSubMenu
                icon={<IconReport />}
                name="Reports"
                onClick={() => push("/reports/agent")}
                isActive={pathname?.includes("reports")}
                items={[
                  { name: "Agent", path: "/reports/agent" },
                  { name: "Supplier", path: "/reports/supplier" },
                ]}
              />
              <Divider />
            </>
          )} */}

          {/* Notifications */}
          {/* {isAdmin && (
            <>
              <SidebarButton
                name={"Notifications"}
                icon={<IconBell />}
                onClick={() => push("/notifications")}
                isActive={pathname?.includes("notifications")}
              />

              <Divider />
            </>
          )} */}
          {/* Banner */}

          {isAdmin && hasPermission("Banner") && (
            <>
              <SidebarButton
                name="Banners"
                icon={<IconPhoto />}
                onClick={() => push("/marketplace/banner")}
                isActive={pathname?.includes("/marketplace/banner")}
              />
              <Divider />
            </>
          )}

          {/* Delivery Agent */}
          {isPartner && hasPermission("Delivery Agent") && (
            <>
              <SidebarButton
                name="Delivery Agents"
                icon={<IconTruck />}
                onClick={() => push("/marketplace/deliveryAgent")}
                isActive={pathname?.includes("deliveryAgent")}
              />
              <Divider />
            </>
          )}

          {/* Customer */}
          {isAdmin && hasPermission("Customer") && (
            <>
              <SidebarButton
                name="Customers"
                icon={<IconUser />}
                onClick={() => push("/marketplace/customer")}
                isActive={pathname?.includes("customer")}
              />
              <Divider />
            </>
          )}

          {/* Access Control - Admin only */}
          {isAdmin && (
            <>
              <SidebarSubMenu
                icon={<IconShield />}
                name="Access Control"
                onClick={() => push("/access/users")}
                isActive={
                  pathname?.includes("access") ||
                  pathname?.includes("users") ||
                  pathname?.includes("roles") ||
                  pathname?.includes("permissions") ||
                  pathname?.includes("RBAC")
                }
                items={[
                  { name: "Kamioun Agents", path: "/access/users" },
                  { name: "Roles", path: "/marketplace/roles" },
                  { name: "Permissions", path: "/marketplace/permissions" },
                  { name: "RBAC ", path: "/access/RBAC" },
                  // { name: "Logs", path: "/access/logs" },
                ]}
              />
              <p className="mb-2 mt-2 border-t-2 border-dashed border-primary/20 text-xs font-semibold " />
            </>
          )}

          {/* Audit Trail - Admin only */}
          {/* {isAdmin && (
            <>
              <SidebarSubMenu
                icon={<IconList />}
                name={"Audit Trail"}
                onClick={() => push("/audit-trail/orders-audit-trail")}
                isActive={pathname?.includes("audit-trail")}
                items={[
                  { name: "Orders", path: "/audit-trail/orders-audit-trail" },
                  {
                    name: "Milk Run",
                    path: "/audit-trail/milkrun-audit-trail",
                  },
                ]}
              />
              <p className="mb-2 mt-2 border-t-2 border-dashed border-primary/20 text-xs font-semibold " />
            </>
          )} */}

          {/* Screen - Admin only */}
          {/* {isAdmin && (
            <>
              <SidebarSubMenu
                icon={<IconList />}
                name={"screen"}
                onClick={() => {
                  push("/screen");
                }}
                isActive={pathname?.includes("screen")}
                items={[{ name: "screen", path: "" }]}
              />
              <p className="mb-2 mt-2 border-t-2 border-dashed border-primary/20 text-xs font-semibold " />
            </>
          )} */}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
