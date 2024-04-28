const Box = ({ children, title }: any) => {
  return (
    <div className=" relative flex h-full  w-full flex-col overflow-hidden rounded-2xl border  border-n30 bg-n0 dark:border-n500 dark:bg-bg4 ">
      {/* <>
        {!!title && (
          <div className="bb-dashed sticky top-0   z-10 flex h-16 items-center justify-between bg-n0">
            <p className="text-3xl font-bold">{title}</p>
          </div>
        )}
      </> */}
      {children}
    </div>
  );
};

export default Box;
