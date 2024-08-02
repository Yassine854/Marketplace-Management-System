import { useGetDeliveryAgents } from "@/features/shared/hooks/queries/useGetDeliveryAgents";
import AgentReportForm from "../../forms/AgentReportForm/AgentReportForm";
import { useEffect } from "react";

const AgentReportPage = () => {
  const { deliveryAgents, isLoading } = useGetDeliveryAgents();

  useEffect(() => {
    console.log("🚀 ~ AgentReportPage ~ deliveryAgents:", deliveryAgents);
  }, [deliveryAgents]);

  const isPending = false;

  return (
    <div className="flex h-full flex-grow ">
      <div className=" h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <AgentReportForm
          deliveryAgents={deliveryAgents}
          isLoading={isLoading}
          isPending={isPending}
        />
      </div>
    </div>
  );
};

export default AgentReportPage;
