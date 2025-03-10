"use client";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: any;
  children?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, content }: ModalProps) {
  if (!isOpen) return null;

  const renderContent = () => {
    if (typeof content === "object" && !Array.isArray(content)) {
      // Afficher un tableau structuré pour un objet
      return (
        <div className="space-y-4">
          {Object.entries(content).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow-md"
            >
              <span className="font-semibold text-gray-800">{key}</span>
              <span className="text-gray-600">{String(value)}</span>
            </div>
          ))}
        </div>
      );
    } else if (Array.isArray(content)) {
      // Si c'est un tableau, on le présente de manière lisible
      return (
        <div className="space-y-2">
          {content.map((item, index) => (
            <div key={index} className="rounded-lg bg-gray-100 p-4 shadow-sm">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {JSON.stringify(item, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      );
    } else {
      // Sinon, afficher directement la donnée
      return (
        <div className="rounded-lg bg-gray-100 p-4 shadow-sm">
          <p className="text-gray-700">{String(content)}</p>
        </div>
      );
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="w-96 overflow-hidden rounded-lg bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b bg-blue-500 p-4 text-white">
          <h2 className="text-xl font-semibold">{title || "Détails"}</h2>
          <button className="text-white hover:text-gray-300" onClick={onClose}>
            ✖
          </button>
        </div>
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
}
