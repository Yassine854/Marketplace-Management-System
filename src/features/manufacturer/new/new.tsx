"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NewManufacturerPage = () => {
  const [manufacturerId, setManufacturerId] = useState<number | string>("");
  const [code, setCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [capital, setCapital] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/marketplace/category/getAll");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch categories");
        }

        setCategories(data.categories);
        console.log("catgories", data.categories);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      }
    };

    fetchCategories();
  }, []);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedCategories(selectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const parsedManufacturerId = parseInt(manufacturerId as string, 10);
    if (isNaN(parsedManufacturerId)) {
      setError("Manufacturer ID must be a valid number.");
      setLoading(false);
      return;
    }
    if (!code || !companyName) {
      setError("Code and Company Name are required.");
      setLoading(false);
      return;
    }
    console.log("Selected categories:", selectedCategories);

    try {
      const response = await fetch("/api/marketplace/supplier/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manufacturerId: parsedManufacturerId,
          code,
          companyName,
          contactName,
          phoneNumber,
          email,
          address,
          city,
          country,
          capital,
          categories: selectedCategories,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create manufacturer");
      }

      setSuccess("Manufacturer created successfully!");
      setManufacturerId("");
      setCode("");
      setCompanyName("");
      setContactName("");
      setPhoneNumber("");
      setEmail("");
      setAddress("");
      setCity("");
      setCountry("");
      setCapital("");
      setSelectedCategories([]);

      setTimeout(() => {
        router.push("/manufacturer/all");
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
    <div className="mt-20 flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-6">
      <div className="mt-36 w-full max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          New Manufacturer
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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="manufacturerId"
                className="block font-medium text-gray-700"
              >
                Manufacturer ID
              </label>
              <input
                type="number"
                value={manufacturerId}
                onChange={(e) => setManufacturerId(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Manufacturer ID"
              />
            </div>

            <div>
              <label htmlFor="code" className="block font-medium text-gray-700">
                Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Code"
              />
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="block font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label
                htmlFor="contactName"
                className="block font-medium text-gray-700"
              >
                Contact Name
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contact Name"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone Number"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Address"
              />
            </div>

            <div>
              <label htmlFor="city" className="block font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City"
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="block font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Country"
              />
            </div>

            <div>
              <label
                htmlFor="capital"
                className="block font-medium text-gray-700"
              >
                Capital
              </label>
              <input
                type="text"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Capital"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block font-medium text-gray-700"
              >
                Categories
              </label>
              <select
                id="category"
                multiple
                value={selectedCategories}
                onChange={handleCategoryChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Categories</option>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map(
                    (category: { id: string; nameCategory: string }) => (
                      <option key={category.id} value={category.id}>
                        {category.nameCategory}
                      </option>
                    ),
                  )
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/manufacturer/all")}
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

export default NewManufacturerPage;
