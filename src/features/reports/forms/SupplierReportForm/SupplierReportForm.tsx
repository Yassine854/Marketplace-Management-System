import { useState } from "react";
import Loading from "@/features/shared/elements/Loading";
import TriangleSkeleton from "../../widgets/TriangleSkeleton";
import SupplierSelector from "../../widgets/SupplierSelector";
import DateRangePicker from "@/features/shared/inputs/DateRangePicker";
import ButtonSkeleton from "../../widgets/ButtonSkeleton/ButtonSkeleton";
import { useGetAllSuppliers } from "../../hooks/queries/useGetAllSuppliers";

const SuppliersReportForm = () => {
  const [supplierId, setSupplierId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { isLoading, suppliers } = useGetAllSuppliers();
  const isPending = false;

  return (
    <div className="grid h-full w-full items-center justify-center gap-4  xxxl:gap-6 ">
      {isLoading}
      <div className="box w-full min-w-[800px]  xl:p-8">
        <div className="bb-dashed mb-6 flex items-center  pb-6">
          <p className="ml-4 text-xl font-bold">Download Supplier Report</p>
        </div>
        {!isLoading && (
          <div className="box mb-6   flex  justify-evenly bg-primary/5 dark:bg-bg3">
            <SupplierSelector
              suppliers={suppliers}
              onChange={(supplier: any) => {
                setSupplierId(supplier?.id);
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

export default SuppliersReportForm;
