import { useGetDeliveryAgents } from "@/features/shared/hooks/queries/useGetDeliveryAgents";
import AgentReportForm from "../../forms/AgentReportForm/AgentReportForm";
import { useEffect } from "react";

const AgentReportPage = () => {
  const { deliveryAgents, isLoading } = useGetDeliveryAgents();
  // console.log("🚀 ~ AgentReportPage ~ deliveryAgents:", deliveryAgents);

  useEffect(() => {
    console.log("🚀 ~ AgentReportPage ~ deliveryAgents:", deliveryAgents);
  }, [deliveryAgents]);

  useEffect(() => {
    console.log("🚀 ~ AgentReportPage ~ isLoading:", isLoading);
  }, [isLoading]);

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
