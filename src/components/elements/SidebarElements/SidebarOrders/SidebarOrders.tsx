import SidebarButton from "../SidebarButton";
import SidebarSubMenuItem from "../SidebarSubMenuItem";
import { orderStatus } from "./orderStatus";
import { useRouter } from "next/navigation";

const SidebarOrders = ({ isActive, onClick }: any) => {
  const { push } = useRouter();
  return (
    <ul className=" flex flex-col gap-2 ">
      <li
        className={`relative rounded-xl duration-300 ${
          isActive && "bg-primary/5 dark:bg-bg3 "
        }`}
      >
        <SidebarButton
          isActive={isActive}
          onClick={() => {
            push("/dashboard/orders/open");
          }}
        />

        <ul className={`px-3 py-3 4xl:px-5`}>
          <li>
            {orderStatus.map((item, index: number) => (
              <SidebarSubMenuItem
                isActive={false}
                key={index}
                onClick={() => {
                  push(item.path);
                }}
                name={item.name}
              />
            ))}
          </li>
        </ul>
      </li>
    </ul>
  );
};

SidebarOrders.defaultProps = {
  isActive: false,
};
export default SidebarOrders;
