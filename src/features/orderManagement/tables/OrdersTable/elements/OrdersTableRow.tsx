import { IconPdf, IconTruck } from "@tabler/icons-react";
import Checkbox from "@/components/inputs/Checkbox";
import OrdersTableCell from "./OrdersTableCell";
import TableActions from "./TableActions";
import Loading from "@/components/elements/Loading";
import { useRef } from "react";

const unixTimeStampToStringDateYMD = (
  unixTimestamp: number | undefined,
): string => {
  if (unixTimestamp) {
    // Convert Unix timestamp to milliseconds
    const milliseconds = unixTimestamp * 1000;

    // Create a new Date object
    const date = new Date(milliseconds);

    // Get the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
    const day = String(date.getDate()).padStart(2, "0");

    // Form the date string in "YYYY-MM-DD" format
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  return "***";
};

const OrdersTableRow = ({
  onClick = () => console.log("Row clicked"),
  order,
  onSelectClick,
  onPDFIconClick,
  isGenerateSummaryPending,
  actionsList,
  isSomeActionPending,
}: any) => {
  const checkboxRef = useRef(null);

  const handleParentClick = (event: any) => {
    event.stopPropagation();
    //@ts-ignore
    checkboxRef.current?.click();
  };

  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n60 dark:even:bg-bg3"
      onClick={onClick}
    >
      <td onClick={handleParentClick}>
        <div className="flex h-full w-full items-center justify-center ">
          <Checkbox
            checkboxRef={checkboxRef}
            isChecked={order.isSelected}
            onClick={(isChecked: boolean) => {
              onSelectClick(isChecked, order.id);
            }}
          />
        </div>
      </td>
      <OrdersTableCell>
        <div className="flex h-full w-full pl-6">
          {/* <IconTruck color="green" />- */}
          {order?.kamiounId}
        </div>
      </OrdersTableCell>
      <OrdersTableCell>
        {order?.customerFirstname + " " + order?.customerLastname}
      </OrdersTableCell>
      <OrdersTableCell>{order?.total}</OrdersTableCell>
      <OrdersTableCell>
        {unixTimeStampToStringDateYMD(order?.deliveryDate)}
      </OrdersTableCell>
      <OrdersTableCell>{order?.deliveryAgentName || "***"}</OrdersTableCell>
      <OrdersTableCell>{order?.deliveryStatus || "***"}</OrdersTableCell>
      <OrdersTableCell>
        <div className=" flex justify-center">
          {isGenerateSummaryPending && (
            <div className="h-6 w-6">
              <Loading />
            </div>
          )}
          {!isGenerateSummaryPending && (
            <div
              className="rounded-full p-2 hover:bg-n10"
              onClick={(event: any) => {
                event.stopPropagation();
                onPDFIconClick(order.id);
              }}
            >
              <IconPdf />
            </div>
          )}
        </div>
      </OrdersTableCell>
      <td className="px-3 py-4">
        <div className=" flex justify-center">
          {isSomeActionPending && (
            <div className="h-6 w-6">
              <Loading />
            </div>
          )}
          {!isSomeActionPending && (
            <TableActions orderId={order.id} actionsList={actionsList} />
          )}
        </div>
      </td>
    </tr>
  );
};

export default OrdersTableRow;
