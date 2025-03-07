"use client";

import LogTable from "../Table/LogTable";
import { useGetAllLogs } from "../getLogs/useGetAllLogs";
import { useMemo, useState } from "react";

export default function LogsPage() {
  const { logs, isLoading, error, refetch } = useGetAllLogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState<
    "all" | "error" | "warning" | "info"
  >("all");
  const [sortLog, setSortLog] = useState<"newest" | "oldest">("newest");

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const searchContent = `${log.type} ${log.message} ${log.timestamp} ${
          log.context ? JSON.stringify(log.context) : ""
        } ${log.dataBefore ? JSON.stringify(log.dataBefore) : ""} ${
          log.dataAfter ? JSON.stringify(log.dataAfter) : ""
        }`.toLowerCase();
        return searchContent.includes(searchTerm.toLowerCase());
      })
      .sort((a, b) =>
        sortLog === "newest"
          ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
  }, [logs, searchTerm, sortLog]);

  return (
    <div
      className={`min-h-screen bg-gray-50 p-6 pt-24 transition-all duration-300 ${
        isSidebarOpen
          ? "ml-[260px] w-[calc(100%-260px)]"
          : "ml-[60px] w-[calc(100%-60px)]"
      }`}
    >
      <div className={`mb-6 flex items-center justify-between`}>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Rechercher des logs..."
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

        <div className="flex gap-2">
          <select
            value={sortLog}
            onChange={(e) => setSortLog(e.target.value as "newest" | "oldest")}
            className="rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      <LogTable
        logs={filteredLogs}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        isSidebarOpen={isSidebarOpen}
      />
    </div>
  );
}
