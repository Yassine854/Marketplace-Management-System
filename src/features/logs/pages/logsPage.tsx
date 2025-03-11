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
    const validLogs = logs.filter((log) => {
      try {
        if (log.context) JSON.parse(JSON.stringify(log.context));
        if (log.dataBefore) JSON.parse(JSON.stringify(log.dataBefore));
        if (log.dataAfter) JSON.parse(JSON.stringify(log.dataAfter));
        return true;
      } catch {
        return false;
      }
    });

    if (validLogs.length > 0) {
      setIsSidebarOpen(false);
    }
  }, [logs]);

  useEffect(() => {
    if (logs.length > 0) {
      setIsSidebarOpen(false);
    }
  }, [logs]);

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
      className={`min-h-screen bg-gray-50 p-6 pt-24 transition-all duration-300 ${
        isSidebarOpen
          ? "ml-[260px] w-[calc(100%-260px)]"
          : "ml-[60px] w-[calc(100%-60px)]"
      }`}
    >
      <div className="mb-6 flex flex-col gap-4">
        {/* Barre de recherche */}
        <div className="relative w-1/3">
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

        <div className="tab flex gap-2 border-b pb-2">
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
