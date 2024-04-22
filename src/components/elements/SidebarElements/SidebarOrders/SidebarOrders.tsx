import { usePathname, useRouter } from "@/libs/i18nNavigation";

import SidebarButton from "../SidebarButton";
import SidebarSubMenuItem from "../SidebarSubMenuItem";
import { orderStatus } from "./orderStatus";

const SidebarOrders = ({ isActive = false, onClick }: any) => {
  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <div className=" flex flex-col gap-2 ">
      <div
        className={`relative rounded-xl duration-300 ${
          isActive && "bg-primary/5 dark:bg-bg3 "
        }`}
      >
        <SidebarButton
          isActive={isActive}
          onClick={() => {
            push("/orders/open");
          }}
        />

        <ul className={`px-3 py-3 4xl:px-5`}>
          <li>
            {orderStatus.map((item, index: number) => (
              <SidebarSubMenuItem
                isActive={pathname?.includes(item.path)}
                key={index}
                onClick={() => {
                  push(item.path);
                }}
                name={item.name}
              />
            ))}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarOrders;
