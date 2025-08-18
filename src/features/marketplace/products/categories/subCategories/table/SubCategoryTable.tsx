// components/SubCategoryTable.tsx
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { SubCategory } from "@/types/subCategory";
import Swal from "sweetalert2";

interface SubCategoryTableProps {
  subcategories: SubCategory[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  onEdit: (subcategory: SubCategory) => void;
  onDelete: (id: string) => Promise<void>;
}

const columnHelper = createColumnHelper<SubCategory>();

export default function SubCategoryTable({
  subcategories,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
}: SubCategoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<SubCategory, any>[]>(
    () => [
      columnHelper.accessor("image", {
        header: "Image",
        cell: (info) => (
          <div className="flex justify-center">
            {info.getValue() ? (
              <img
                src={info.getValue()}
                alt={info.row.original.name}
                className="h-12 w-12 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/100x100?text=Error";
                }}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            )}
          </div>
        ),
        enableSorting: false,
        size: 100,
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div className="max-w-xs">
            <span className="text-sm text-gray-900">{info.getValue()}</span>
          </div>
        ),
        size: 200,
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: (info) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              info.getValue()
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {info.getValue() ? "Active" : "Inactive"}
          </span>
        ),
        size: 120,
      }),

      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: (info) => {
          const date = info.getValue();
          return (
            <span className="text-sm text-gray-600">
              {date ? new Date(date).toLocaleDateString() : "-"}
            </span>
          );
        },
        size: 120,
      }),
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(row.original)}
              className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
              title="Edit Subcategory"
            >
              <FaEdit className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!",
                  cancelButtonText: "Cancel",
                }).then((result) => {
                  if (result.isConfirmed) {
                    onDelete(row.original.id);
                  }
                });
              }}
              className="rounded p-1.5 text-red-600 hover:bg-red-50"
              title="Delete Subcategory"
            >
              <FaTrash className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
        enableSorting: false,
        size: 100,
      },
    ],
    [onEdit, onDelete],
  );

  const table = useReactTable({
    data: subcategories,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false,
  });

  if (error) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-red-200 bg-red-50">
        <div className="text-center">
          <p className="font-medium text-red-800">
            Error loading subcategories
          </p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Search and Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <input
            placeholder="Search subcategories..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-9 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {(table.getColumn("name")?.getFilterValue() as string) && (
            <button
              onClick={() => table.getColumn("name")?.setFilterValue("")}
              className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Page Size */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-700">Show:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none hover:text-gray-700"
                              : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {{
                                asc: <FaSortUp className="h-3 w-3" />,
                                desc: <FaSortDown className="h-3 w-3" />,
                              }[header.column.getIsSorted() as string] ?? (
                                <FaSort className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                      <span className="text-gray-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center"
                  >
                    <div className="text-gray-500">
                      <div className="mb-2 text-2xl">📂</div>
                      <p className="font-medium">No subcategories found</p>
                      <p className="text-sm">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="rounded px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ««
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ‹
            </button>

            {(() => {
              const currentPage = table.getState().pagination.pageIndex + 1;
              const totalPages = table.getPageCount();
              const pages = [];

              const startPage = Math.max(1, currentPage - 2);
              const endPage = Math.min(totalPages, currentPage + 2);

              for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
              }

              return pages.map((page) => (
                <button
                  key={page}
                  onClick={() => table.setPageIndex(page - 1)}
                  className={`rounded px-3 py-1 text-sm font-medium ${
                    page === currentPage
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ));
            })()}

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ›
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="rounded px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              »»
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
