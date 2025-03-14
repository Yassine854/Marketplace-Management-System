"use client";

import LogTable from "../Table/LogTable";
import { useGetAllLogs } from "../getLogs/useGetAllLogs";
import { useMemo, useState, useEffect } from "react";

export default function LogsPage() {
  const { logs, isLoading, error, refetch } = useGetAllLogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "error" | "warning" | "info" | "order" | "milk run"
  >("all");
  const [sortLog, setSortLog] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    console.log("Sidebar state:", isSidebarOpen);
  }, [isSidebarOpen]);

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const searchContent = `${log.type} ${log.message} ${log.timestamp} ${
          log.context ? JSON.stringify(log.context) : ""
        } ${log.dataBefore ? JSON.stringify(log.dataBefore) : ""} ${
          log.dataAfter ? JSON.stringify(log.dataAfter) : ""
        }`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesTab =
          activeTab === "all" ? true : log.type.toLowerCase() === activeTab;

        return searchContent && matchesTab;
      })
      .sort((a, b) =>
        sortLog === "newest"
          ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
  }, [logs, searchTerm, sortLog, activeTab]);

  return (
    <div
      style={{
        width: "100%",
        padding: "100px 16px",
        boxSizing: "border-box",
        margin: 0,
      }}
    >
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Rechercher des logs..."
              className="w-full rounded-lg border p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              🔍
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by :
            </label>
            <select
              id="sort"
              className="rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortLog}
              onChange={(e) =>
                setSortLog(e.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="tab flex flex-wrap gap-2 border-b pb-2">
          {["all", "error", "order", "milk run"].map((tab) => (
            <button
              key={tab}
              className={`rounded-t-lg px-4 py-2 ${
                activeTab === tab
                  ? "bg-gray-300 font-bold"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() =>
                setActiveTab(tab as "all" | "error" | "order" | "milk run")
              }
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <LogTable
          logs={filteredLogs}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </div>
  );
}
