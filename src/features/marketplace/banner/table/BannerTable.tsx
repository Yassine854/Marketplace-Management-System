import { FaEdit, FaTrash } from "react-icons/fa";
import { useBannerActions } from "../hooks/useBannerActions";
import { Banner } from "@/types/banner";

interface BannerTableProps {
  banners: Banner[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function BannerTable({
  banners,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
}: BannerTableProps) {
  const { deleteBanner } = useBannerActions();

  const handleDelete = (id: string) => {
    deleteBanner(id).then(() => refetch());
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        className="box flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-0 dark:bg-bg3"
        style={{ maxHeight: "600px" }}
      >
        <table className="w-full">
          <thead className="border-b border-gray-100 bg-primary">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                Image
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                Alt Text
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && !error && banners.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center">
                  No banners found
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              banners.map((banner) => (
                <tr
                  key={banner.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-center">
                    <img
                      src={banner.url}
                      alt={banner.altText || "Banner image"}
                      className="mx-auto h-16 w-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150?text=Image+Error";
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-900">
                    {banner.altText || "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => onEdit(banner)}
                      className="mx-2 text-blue-500 hover:text-blue-700"
                      title="Edit Banner"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="mx-2 text-red-500 hover:text-red-700"
                      title="Delete Banner"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
