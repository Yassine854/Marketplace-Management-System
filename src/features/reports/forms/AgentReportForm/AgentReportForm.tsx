import Loading from "@/features/shared/elements/Loading";
import DatePicker from "@/features/shared/inputs/DatePicker";
import TriangleSkeleton from "../../widgets/TriangleSkeleton";
import ButtonSkeleton from "../../widgets/ButtonSkeleton/ButtonSkeleton";
import DeliveryAgentSelector from "@/features/shared/inputs/DeliveryAgentSelector";
import { useGetDeliveryAgents } from "@/features/shared/hooks/queries/useGetDeliveryAgents";
import { useEffect } from "react";
import DateRangePicker from "@/features/shared/inputs/DateRangePicker";

const AgentReportForm = () => {
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
    <div className="grid h-full w-full items-center justify-center gap-4  xxxl:gap-6 ">
      {isLoading}
      <div className="box w-full min-w-[800px]  xl:p-8">
        <div className="bb-dashed mb-6 flex items-center  pb-6">
          <p className="ml-4 text-xl font-bold">Download Agent Report</p>
        </div>
        {!isLoading && (
          <div className="box mb-6   flex  justify-evenly bg-primary/5 dark:bg-bg3">
            <DeliveryAgentSelector
              deliveryAgents={deliveryAgents}
              onChange={(a: any) => {
                console.log("🚀 ~ AgentReportForm ~ a:", a);
              }}
            />
            <DateRangePicker />
          </div>
        )}
        {isLoading && <TriangleSkeleton />}
        <div className="mt-6">
          <div className="mt-7 flex justify-end gap-4  lg:mt-10">
            {isLoading && <ButtonSkeleton />}

            {!isLoading && !isPending && (
              <button type="submit" className="btn px-4 hover:shadow-none">
                Download
              </button>
            )}
            {!isLoading && isPending && <Loading />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentReportForm;
