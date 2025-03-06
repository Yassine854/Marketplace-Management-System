"use client";

import { useGetAllLogs } from "../getLogs/useGetAllLogs";
import { useMemo, useState } from "react";

export default function LogTable({
  isSidebarOpen,
}: {
  isSidebarOpen: boolean;
}) {
  const { logs, isLoading, error, refetch } = useGetAllLogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "error" | "warning" | "info"
  >("all");

  // Filter and search logs
  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        // Filter by type
        if (filterType !== "all" && log.type !== filterType) return false;

        // Search by keyword
        const searchContent = `${log.type} ${log.message} ${log.timestamp} ${
          log.context ? JSON.stringify(log.context) : ""
        } ${log.dataBefore ? JSON.stringify(log.dataBefore) : ""} ${
          log.dataAfter ? JSON.stringify(log.dataAfter) : ""
        }`.toLowerCase();
        return searchContent.includes(searchTerm.toLowerCase());
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ); // Sort by newest first
  }, [logs, searchTerm, filterType]);

  return (
    <div
      className={`flex h-screen flex-col p-6 transition-all duration-300 ${
        isSidebarOpen ? "ml-64" : "ml-16"
      } z-10 w-full`}
    >
      {" "}
      {/* Add z-10 here */}
      {/* Search and Filter Controls */}
      <div className="mb-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full rounded-lg border p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
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
          </span>
        </div>

        {/* Filter by Type */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`rounded-lg px-4 py-2 transition-colors ${
              filterType === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("error")}
            className={`rounded-lg px-4 py-2 transition-colors ${
              filterType === "error"
                ? "bg-red-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Errors
          </button>
          <button
            onClick={() => setFilterType("warning")}
            className={`rounded-lg px-4 py-2 transition-colors ${
              filterType === "warning"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Warnings
          </button>
          <button
            onClick={() => setFilterType("info")}
            className={`rounded-lg px-4 py-2 transition-colors ${
              filterType === "info"
                ? "bg-green-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Info
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="flex-1 overflow-auto rounded-lg border bg-white shadow-md">
        <table className="w-full divide-y divide-gray-200">
          <thead className="sticky top-0 bg-gradient-to-r from-blue-50 to-gray-50 shadow-sm">
            <tr>
              {[
                "Type",
                "Message",
                "Timestamp",
                "Context",
                "Data Before",
                "Data After",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Loading State */}
            {isLoading && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-600" colSpan={6}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2">Loading logs...</p>
                  </div>
                </td>
              </tr>
            )}

            {/* Error State */}
            {error && (
              <tr>
                <td className="px-6 py-6 text-center text-red-600" colSpan={6}>
                  <div className="flex flex-col items-center gap-2">
                    <p>{error}</p>
                    <button
                      onClick={refetch}
                      className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                      Retry Loading
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredLogs.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500" colSpan={6}>
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>No logs match your search criteria</p>
                  </div>
                </td>
              </tr>
            )}

            {/* Log Rows */}
            {!isLoading &&
              !error &&
              filteredLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } transition-colors hover:bg-gray-100`}
                >
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        log.type === "error"
                          ? "bg-red-100 text-red-800"
                          : log.type === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {log.type}
                    </span>
                  </td>
                  <td className="break-words px-6 py-4 text-sm text-gray-900">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="break-words px-6 py-4 text-sm text-gray-500">
                    <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                      {JSON.stringify(log.context, null, 2)}
                    </pre>
                  </td>
                  <td className="break-words px-6 py-4 text-sm text-gray-500">
                    <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                      {JSON.stringify(log.dataBefore, null, 2)}
                    </pre>
                  </td>
                  <td className="break-words px-6 py-4 text-sm text-gray-500">
                    <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                      {JSON.stringify(log.dataAfter, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
