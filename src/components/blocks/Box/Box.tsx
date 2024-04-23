const Box = ({ children }: any) => {
  return (
    <div className=" relative w-full  overflow-y-scroll rounded-2xl border border-n30 bg-n0 px-8 pb-8  dark:border-n500 dark:bg-bg4  ">
      {children}
    </div>
  );
};

export default Box;
