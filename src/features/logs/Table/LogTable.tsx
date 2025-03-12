"use client";
import { useState } from "react";
import ContextModal from "../components/ContextModal";
import { MilkRunUpdatedModal } from "../components/MilkRunUpdated";
import { OrderEditedModal } from "../components/OrderEditedModal";
import { OrderStatusChangedModal } from "../components/OrderStatusChangedModal";

interface LogTableProps {
  logs: any[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isSidebarOpen: boolean;
}

export default function LogTable({
  logs,
  isLoading,
  error,
  refetch,
  isSidebarOpen,
}: LogTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContext, setSelectedContext] = useState<any>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState<
    "context" | "statusChanged" | "edited" | "milkRunUpdated" | null
  >(null);

  const handleDataClick = (data: any, message: string) => {
    setSelectedData(data);

    if (message.includes("Order Status Changed")) {
      setModalType("statusChanged");
    } else if (message.includes("Order edited")) {
      setModalType("edited");
    } else if (message.includes("milk run updated for order")) {
      setModalType("milkRunUpdated");
    } else {
      return;
    }

    setIsModalOpen(true);
  };

  const handleContextClick = (context: any) => {
    setSelectedContext(context);
    setModalType("context");
    setIsModalOpen(true);
  };
  const safeDataDisplay = (data: any) => {
    if (data === "error") {
      return "error";
    }

    if (typeof data === "object" && data !== null) {
      return Object.keys(data).length > 0 ? JSON.stringify(data, null, 2) : "";
    }

    return data && data !== "" ? data : "";
  };

  const parseJsonSafely = (data: any) => {
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch (error) {
      console.error("Erreur de parsing JSON :", error);
      return data;
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{ width: "100%" }}
      >
        <thead className="sticky top-0 bg-gradient-to-r from-blue-50 to-gray-50 shadow-sm">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Type
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Message
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Timestamp
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Context
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Data Before
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Data After
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading && (
            <tr>
              <td className="px-4 py-4 text-center text-gray-600" colSpan={6}>
                <div className="flex items-center justify-center gap-2">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2">Chargement des logs...</p>
                </div>
              </td>
            </tr>
          )}

          {error && (
            <tr>
              <td className="px-4 py-4 text-center text-red-600" colSpan={6}>
                <div className="flex flex-col items-center gap-2">
                  <p>{error}</p>
                  <button
                    onClick={refetch}
                    className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  >
                    Réessayer
                  </button>
                </div>
              </td>
            </tr>
          )}

          {!isLoading && !error && logs.length === 0 && (
            <tr>
              <td className="px-4 py-4 text-center text-gray-500" colSpan={6}>
                <p>Aucun log ne correspond à vos critères de recherche.</p>
              </td>
            </tr>
          )}

          {!isLoading &&
            !error &&
            logs.map((log, index) => {
              const context = parseJsonSafely(log.context);
              const dataBefore = parseJsonSafely(log.dataBefore);
              const dataAfter = parseJsonSafely(log.dataAfter);

              return (
                <tr
                  key={log.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } transition-colors hover:bg-gray-100`}
                >
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        log.type === "error"
                          ? "bg-red-100 text-red-800"
                          : log.type === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : log.type === "info"
                          ? "bg-blue-100 text-blue-800"
                          : log.type === "Order"
                          ? "bg-purple-100 text-purple-800"
                          : log.type === "milk run"
                          ? "bg-teal-100 text-teal-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {log.type}
                    </span>
                  </td>
                  <td className="break-words px-4 py-2 text-sm text-gray-900">
                    {log.message}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString("fr-FR")}
                  </td>
                  <td
                    className="cursor-pointer break-words px-4 py-2 text-sm text-gray-500"
                    onClick={() => handleContextClick(context)}
                  >
                    <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                      {context?.username || " "}
                    </pre>
                  </td>
                  <td
                    className="cursor-pointer break-words px-4 py-2 text-sm text-gray-500"
                    onClick={() => handleDataClick(dataBefore, log.message)}
                  >
                    <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                      {safeDataDisplay(dataBefore.status)}
                    </pre>
                  </td>
                  <td
                    className="cursor-pointer break-words px-4 py-2 text-sm text-gray-500"
                    onClick={() => handleDataClick(dataAfter, log.message)}
                  >
                    <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                      {dataAfter?.status || String(dataAfter) || ""}
                    </pre>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {isModalOpen && modalType === "context" && (
        <ContextModal
          data={selectedContext}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isModalOpen && modalType === "statusChanged" && (
        <OrderStatusChangedModal
          data={selectedData}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isModalOpen && modalType === "edited" && (
        <OrderEditedModal
          data={selectedData}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isModalOpen && modalType === "milkRunUpdated" && (
        <MilkRunUpdatedModal
          data={selectedData}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
