"use client";
import { useState, useEffect } from "react";
import { getAllLogs } from "../../../services/logs/getAllLogs"; // Importing the function

interface Log {
  id: string;
  type: "info" | "warning" | "error" | "order";
  message: string;
  timestamp: string;
  context:
    | { userId: string; username?: string; storeId: string }
    | string
    | null;
  dataBefore: string | null;
  dataAfter: string | null;
}

export default function Page() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [loading, setLoading] = useState(true);

  // Fetch logs from the getAllLogs function
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const logs = await getAllLogs(); // Use the getAllLogs function to fetch the logs
      setLogs(logs || []);
    } catch (error) {
      setError("Error fetching logs");
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logs
  const filteredLogs = Array.isArray(logs)
    ? logs.filter((log) =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) =>
    sortBy === "newest"
      ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  // Format context
  const formatContext = (context: any) => {
    if (typeof context === "object" && context !== null) {
      const { userId, username, storeId } = context;
      return `UserID: ${userId}, Username: ${username}, StoreID: ${storeId}`;
    }
    return context || "N/A";
  };

  // Extract status from dataBefore and dataAfter
  const extractStatus = (data: string | null) => {
    if (!data) return "N/A";
    try {
      const parsedData = JSON.parse(data);
      return parsedData.status || "N/A"; // Assuming the status is in the parsed object
    } catch {
      return "Invalid data format";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-6">
      <h1 className="mb-4 text-2xl font-bold">Logs: {logs.length}</h1>

      {/* Search and sort */}
      <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full rounded-lg border px-4 py-2 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search logs"
          />
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            className="rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Logs table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-900">
                ID
              </th>
              <th className="p-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-900">
                Type
              </th>
              <th className="p-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-900">
                Message
              </th>
              <th className="p-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-900">
                Context
              </th>
              <th className="p-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-900">
                Timestamp
              </th>
              <th className="p-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-900">
                Data Before (Status)
              </th>
              <th className="p-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-900">
                Data After (Status)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : sortedLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No matching logs found
                </td>
              </tr>
            ) : (
              sortedLogs.map((log) => (
                <tr key={log.id}>
                  <td className="p-3 font-mono text-sm text-gray-600">
                    {log.id}
                  </td>
                  <td className="p-3">{log.type}</td>
                  <td className="p-3 text-sm text-gray-900">{log.message}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {formatContext(log.context)}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {extractStatus(log.dataBefore)}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {extractStatus(log.dataAfter)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
