const TableRow = ({
  onClick = () => console.log("Row clicked"),
  cells = [
    { cell: <div className="m-2 w-14">test</div> },
    { cell: <p className="m-2 w-14">test</p> },
  ],
}: any) => {
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
      onClick={onClick}
    >
      {cells?.map(({ cell }: any, index: number) => (
        <td key={index}>
          <div className=" flex h-20 items-center  justify-center  ">
            {cell}
          </div>
        </td>
      ))}
    </tr>
  );
};
export default TableRow;
