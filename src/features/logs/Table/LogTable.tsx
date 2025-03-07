"use client";
import { useState } from "react";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const openModal = (content: any) => {
    setModalContent(
      typeof content === "object"
        ? JSON.stringify(content, null, 2)
        : String(content),
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent("");
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
    <div
      className={`min-w-0 flex-1 overflow-auto rounded-lg border bg-white shadow-md ${
        isSidebarOpen
          ? "ml-64 w-[calc(100%-260px)]"
          : "ml-10 w-[calc(100%-60px)]"
      } `}
    >
      <table className="w-full min-w-[1400px] divide-y divide-gray-200 ">
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
                    className="break-words px-4 py-2 text-sm text-gray-500"
                    onClick={() => openModal(context)}
                  >
                    <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                      {context?.username || "N/A"}
                    </pre>
                  </td>
                  <td
                    className="break-words px-4 py-2 text-sm text-gray-500"
                    onClick={() => openModal(dataBefore)}
                  >
                    <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                      {dataBefore?.status || String(dataBefore) || "N/A"}
                    </pre>
                  </td>
                  <td
                    className="break-words px-4 py-2 text-sm text-gray-500"
                    onClick={() => openModal(dataAfter)}
                  >
                    <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                      {dataAfter?.status || String(dataAfter) || "N/A"}
                    </pre>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[70vh] w-96 flex-col overflow-y-auto rounded-lg bg-white p-6 shadow-lg  sm:w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Détails</h2>
            <pre className="whitespace-pre-wrap break-words">
              {modalContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
