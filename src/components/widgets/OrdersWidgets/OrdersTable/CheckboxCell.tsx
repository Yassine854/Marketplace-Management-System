import Checkbox from "@/components/elements/sharedElements/Checkbox";

const CheckboxCell = () => {
  return (
    <td>
      <div className="flex h-20 w-20 items-center justify-center border ">
        <Checkbox key="checkbox" />
      </div>
    </td>
  );
};

export default CheckboxCell;
