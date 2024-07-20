import ProjectsOverview from "./ProjectOverview";
import RevenueOverview from "./RevenueOverview";
import SalesStatistics from "./SalesStatistics";
import ShowcaseInfo from "./ShowcaseInfo";
import States from "./States";
//import Banner from "../../elements/Banner";
import Link from "next/link";

const SalesPage = () => {
  return (
    <div className="m-16 mt-24  flex w-full flex-col">
      {/* <Banner
        title="Kamioun dashboard"
        links={
          <div className="flex gap-4 xl:gap-6">
            <Link href="#" className="btn-outline">
              View Reports
            </Link>
            <Link href="#" className="btn">
              Transactions
            </Link>
          </div>
        }
      /> */}
      <div className="grid grid-cols-12 gap-4 overflow-x-hidden xxxl:gap-6">
        <States />
        <SalesStatistics />
        <ShowcaseInfo />
        <ProjectsOverview />
        <RevenueOverview />
      </div>
    </div>
  );
};

export default SalesPage;
