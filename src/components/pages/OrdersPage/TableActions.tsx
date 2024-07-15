"use client";
import { useDropdown } from "@/hooks/useDropdown";
import { IconDotsVertical } from "@tabler/icons-react";

import Swal from "sweetalert2";

const TableActions = ({
  fromBottom,
  onDelete,
}: {
  fromBottom?: boolean;
  onDelete: () => void;
}) => {
  const { open, ref, toggleOpen } = useDropdown();
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5D69F4",
      cancelButtonColor: "#FF6161",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // toast.success("Item Deleted Successfully", {
        //   position: "top-center",
        //   autoClose: 2000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // });
        onDelete();
      }
    });
  };

  return (
    <>
      <div className="relative top-0 " ref={ref}>
        <IconDotsVertical onClick={toggleOpen} className="cursor-pointer" />
        <ul
          className={`${
            open
              ? "visible scale-100 opacity-100"
              : "invisible scale-0 opacity-0"
          } absolute ${
            fromBottom ? "bottom-0" : "top-0"
          } z-30 min-w-max rounded-md border bg-n0 p-1.5 dark:border-n500 dark:bg-bg4 ltr:right-5 rtl:left-5`}
        >
          <li>
            <button className="block rounded-md px-3 py-1.5 duration-300 hover:bg-primary hover:text-n30">
              Edit
            </button>
          </li>
          <li>
            <button
              onClick={handleDelete}
              className="block rounded-md px-3 py-1.5 duration-300 hover:bg-primary hover:text-n30"
            >
              Delete
            </button>
          </li>
          <li>
            <button className="block rounded-md px-3 py-1.5 duration-300 hover:bg-primary hover:text-n30">
              Block
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TableActions;
