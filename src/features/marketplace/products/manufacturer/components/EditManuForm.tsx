"use client";
import { useState } from "react";
import { Manufacturer, Category } from "../types/manufacturer";

const EditManuForm = ({
  manufacturer,
  categories = [],
  onClose,
  onUpdate,
}: {
  manufacturer: Manufacturer;
  categories: Category[];
  onClose: () => void;
  onUpdate: (updatedManufacturer: Manufacturer) => void;
}) => {
  const [companyName, setCompanyName] = useState(manufacturer.companyName);
  const [contactName, setContactName] = useState(
    manufacturer.contactName || "",
  );
  const [phoneNumber, setPhoneNumber] = useState(
    manufacturer.phoneNumber || "",
  );
  const [email, setEmail] = useState(manufacturer.email || "");
  const [address, setAddress] = useState(manufacturer.address || "");
  const [city, setCity] = useState(manufacturer.city || "");
  const [country, setCountry] = useState(manufacturer.country || "");
  const [postalCode, setPostalCode] = useState(manufacturer.postalCode || "");
  const [capital, setCapital] = useState(manufacturer.capital || "");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    () => {
      return (
        manufacturer.supplierCategories?.map(
          (sc) => sc.category?.id || sc.categoryId,
        ) || []
      );
    },
  );
  const [error, setError] = useState("");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedCategoryIds((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError("Company Name is required");
      return;
    }

    const updatedManufacturer: Manufacturer = {
      ...manufacturer,
      companyName,
      contactName,
      phoneNumber,
      email,
      address,
      city,
      country,
      postalCode,
      capital,
      supplierCategories: selectedCategoryIds.map((categoryId) => ({
        id: "",
        categoryId,
        supplierId: manufacturer.id,
      })),
    };

    onUpdate(updatedManufacturer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
      >
        <div className="space-y-6 overflow-y-auto p-8">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Manufacturer
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update the manufacturer details
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Company Information
            </h3>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone Number{" "}
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Capital
                </label>
                <input
                  type="text"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Supplier Categories
            </h3>
            {categories.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">No categories available</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map((category) => {
                  const categoryIdStr = category.id.toString();
                  const isChecked = selectedCategoryIds.includes(categoryIdStr);

                  return (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center space-x-2 rounded-lg border border-gray-200 p-3 hover:border-blue-500"
                    >
                      <input
                        type="checkbox"
                        value={category.id}
                        checked={isChecked}
                        onChange={handleCategoryChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {category.nameCategory}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 border-t bg-gray-50 px-8 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className=" rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditManuForm;
