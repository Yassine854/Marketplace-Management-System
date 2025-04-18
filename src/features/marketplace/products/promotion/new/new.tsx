"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NewPromotionPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/marketplace/promotion/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          promoPrice: parseFloat(promoPrice),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create promotion");
      }

      setSuccess(" Promotion created successfully!");
      setStartDate("");
      setEndDate("");
      setPromoPrice("");

      setTimeout(() => {
        router.push("/promotion/all");
      }, 1500);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          New Promotion
        </h1>
        {error && (
          <p className="mb-4 rounded-lg bg-red-100 p-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 rounded-lg bg-green-100 p-2 text-sm text-green-600">
            {success}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="startDate"
              className="block font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start Date"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="End Date"
            />
          </div>

          <div>
            <input
              type="number"
              step="0.01"
              value={promoPrice}
              onChange={(e) => setPromoPrice(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter promo price"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/promotion/all")}
              className="w-1/2 rounded-lg bg-gray-300 px-4 py-3 font-medium text-gray-700 shadow-md transition hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex w-1/2 items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPromotionPage;
