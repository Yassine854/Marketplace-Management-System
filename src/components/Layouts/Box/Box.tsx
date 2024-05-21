const Box = ({ children }: any) => {
  return (
    <div className=" relative flex h-full w-full  flex-col overflow-hidden rounded-2xl border border-n30  bg-n0 p-2 dark:border-n500 dark:bg-bg4 ">
      {children}
    </div>
  );
};

export default Box;
