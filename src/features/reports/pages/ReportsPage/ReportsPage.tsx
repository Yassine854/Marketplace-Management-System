import ReportsForm from "../forms/ReportsForm/ReportsForm";

const ReportsPage = () => {
  return (
    <div className="flex h-full flex-grow ">
      <div className=" h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <ReportsForm />
      </div>
    </div>
  );
};

export default ReportsPage;
