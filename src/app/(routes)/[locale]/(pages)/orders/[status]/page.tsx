"use client";

import { useEffect, useState } from "react";

import AdvancedSearch from "@/components/blocks/AdvancedSearch";
import Box from "@/components/blocks/Box";
import OrdersTable from "@/components/blocks/OrdersTable";
import OrdersTable2 from "@/components/blocks/OrdersTable2";
import { useNavigation } from "@/hooks/useNavigation";

const OrdersPage = () => {
  const [isAdvanced, setAdvanced] = useState(true);
  const { status } = useNavigation();

  return (
    <>
      {(status === "open" || status === "valid" || status === "ready") && (
        <OrdersTable status={status} />
      )}
      {status !== "open" && isAdvanced && (
        <Box>
          <div className="flex h-full items-center justify-center">
            <AdvancedSearch
              onSearch={() => setAdvanced(false)}
              status={status}
            />
          </div>
        </Box>
      )}
      {status !== "valid" && isAdvanced && (
        <Box>
          <div className="flex h-full items-center justify-center">
            <AdvancedSearch
              onSearch={() => setAdvanced(false)}
              status={status}
            />
          </div>
        </Box>
      )}
      {status !== "ready" && isAdvanced && (
        <Box>
          <div className="flex h-full items-center justify-center">
            <AdvancedSearch
              onSearch={() => setAdvanced(false)}
              status={status}
            />
          </div>
        </Box>
      )}

      {status !== "open" &&
        status !== "valid" &&
        status !== "ready" &&
        !isAdvanced && (
          <OrdersTable2
            isAdvanced={isAdvanced}
            setAdvanced={setAdvanced}
            status={status}
          />
        )}
    </>
  );
};

export default OrdersPage;
