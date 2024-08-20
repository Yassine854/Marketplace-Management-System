export const tailwind = {
  container: "relative  w-36 ",
  main: "flex min-w-max cursor-pointer  select-none items-center justify-between gap-2 rounded-[30px] border border-n30 bg-primary/5 px-3 py-1.5 text-xs  dark:border-n500 dark:bg-bg3 sm:min-w-[140px] sm:px-4 sm:py-2",
  list(open: boolean): string {
    return `
        lef-16  absolute bottom-full  right-24 z-40 max-h-40  min-w-max origin-top
        flex-col overflow-y-auto rounded-md  border border-n30 bg-n0 p-1 shadow-md duration-300 dark:border-n500 dark:bg-bg4 sm:min-w-[140px] ltr:right-0 rtl:left-0 
        ${
          open
            ? "visible flex scale-100 opacity-100"
            : "invisible scale-0 opacity-0"
        }`;
  },
  listItem(selected: number, item: number): string {
    return `cursor-pointer rounded-md px-4 py-2 text-xs duration-300 hover:text-primary 
            ${selected == item && "bg-primary text-n0 hover:!text-n0"}`;
  },
};
