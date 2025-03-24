"use client";
import { useState, useEffect } from "react";
import { Manufacturer } from "../types/manufacturer";

const EditManuForm = ({
  manufacturer,
  categories,
  onClose,
  onUpdate,
}: {
  manufacturer: Manufacturer;
  categories: string[];
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
  const [supplierCategories, setSupplierCategories] = useState<
    { categoryId: string }[]
  >(manufacturer.supplierCategories || []);
  const [error, setError] = useState("");
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setSupplierCategories(
      (prevCategories) =>
        checked
          ? [...prevCategories, { categoryId: value }] // Ajout d'un objet avec `categoryId`
          : prevCategories.filter((category) => category.categoryId !== value), // Retrait de l'objet par `categoryId`
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
      supplierCategories,
    };

    onUpdate(updatedManufacturer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[80vh] w-full max-w-4xl space-y-5 overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Edit Manufacturer
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact Name
          </label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categories
          </label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  value={category}
                  checked={supplierCategories.some(
                    (sc) => sc.categoryId === category,
                  )}
                  onChange={handleCategoryChange}
                  className="mr-2"
                />
                <span>{category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditManuForm;
