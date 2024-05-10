const TableRow = ({
  onClick = () => console.log("Row clicked"),
  cells,
}: any) => {
  return (
    <tr
      className="cursor-pointer even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3"
      onClick={onClick}
    >
      {cells?.map(({ cell }: any, index: number) => (
        <td key={index}>{cell}</td>
      ))}
    </tr>
  );
};
export default TableRow;
