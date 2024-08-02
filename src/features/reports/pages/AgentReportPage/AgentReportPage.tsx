import { useGetDeliveryAgents } from "@/features/shared/hooks/queries/useGetDeliveryAgents";
import AgentReportForm from "../../forms/AgentReportForm/AgentReportForm";

const AgentReportPage = () => {
  const { deliveryAgents, isLoading } = useGetDeliveryAgents();

  return (
    <div className="flex h-full flex-grow ">
      <div className=" h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <AgentReportForm
          deliveryAgents={deliveryAgents}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AgentReportPage;
