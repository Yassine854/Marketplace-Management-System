import Loading from "@/features/shared/elements/Loading";
import DatePicker from "@/features/shared/inputs/DatePicker";
import DeliveryAgentSelector from "@/features/shared/inputs/DeliveryAgentSelector";

const AgentReportForm = ({ deliveryAgents, isLoading }: any) => {
  return (
    <div className="grid h-full w-full items-center justify-center gap-4  xxxl:gap-6 ">
      <div className="box w-full min-w-[800px]  xl:p-8">
        <div className="bb-dashed mb-6 flex items-center  pb-6">
          <p className="ml-4 text-xl font-bold">Download Agent Report</p>
        </div>
        <div className="box mb-6 grid grid-cols-2 gap-4 bg-primary/5 dark:bg-bg3 md:p-4 xl:p-6 xxxl:gap-6">
          <DeliveryAgentSelector
            deliveryAgents={deliveryAgents}
            onChange={(a: any) => {
              console.log("🚀 ~ AgentReportForm ~ a:", a);
            }}
          />

          <DatePicker />
        </div>

        <div className="mt-6">
          <div className="mt-7 flex justify-end gap-4  lg:mt-10">
            {!isLoading && (
              <button type="submit" className="btn px-4 hover:shadow-none">
                Download
              </button>
            )}
            {isLoading && <Loading />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentReportForm;
