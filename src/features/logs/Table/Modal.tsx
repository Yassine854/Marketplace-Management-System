"use client";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: any;
}

export default function Modal({ isOpen, onClose, title, content }: ModalProps) {
  if (!isOpen) return null;

  const renderContent = () => {
    if (typeof content === "object" && !Array.isArray(content)) {
      return (
        <div className="space-y-2 p-2">
          {Object.entries(content).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center border-b border-gray-300 py-2"
            >
              <span className="w-1/2 text-sm font-medium text-gray-700">
                {key}
              </span>
              <span className="w-1/2 text-base text-gray-900">
                {value as React.ReactNode}
              </span>
            </div>
          ))}
        </div>
      );
    } else if (Array.isArray(content)) {
      return (
        <div className="space-y-2 p-2">
          {content.map((item, index) => (
            <div key={index} className="border-b border-gray-300 py-2">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <span className="w-1/2 text-sm font-medium text-gray-700">
                    {key}
                  </span>
                  <span className="w-1/2 text-base text-gray-900">
                    {value as React.ReactNode}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="border-b border-gray-300 py-2">
          <p className="text-base text-gray-900">{content}</p>
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
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-800 p-4 text-white">
          <h2 className="text-lg font-semibold">{title || "Détails"}</h2>
          <button
            className="text-white transition hover:text-gray-400"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        {/* Contenu */}
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
}
