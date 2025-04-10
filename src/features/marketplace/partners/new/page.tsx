import { useState, FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "@/libs/next-intl/i18nNavigation";

interface TypePartner {
  id: string;
  name: string;
}

const PartnerForm = () => {
  const [typePartners, setTypePartners] = useState<TypePartner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [partnerError, setPartnerError] = useState<string | null>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    address: "",
    password: "",
    roleId: "2",
    responsibleName: "",
    position: "",
    coverageArea: "",
    minimumAmount: "",
    typePartnerId: "",
  });

  useEffect(() => {
    const fetchTypePartners = async () => {
      try {
        const response = await fetch("/api/marketplace/typePartner/getAll");
        if (!response.ok) throw new Error("Failed to fetch partner types");

        const data = await response.json();
        if (!data.typePartners) throw new Error("No partner types found");

        setTypePartners(data.typePartners);
        setPartnerError(null);
      } catch (error: any) {
        console.error("Error fetching partner types:", error);
        setPartnerError(error.message || "Failed to load partner types");
        toast.error("Could not load partner types");
      } finally {
        setLoadingPartners(false);
      }
    };

    fetchTypePartners();
  }, []);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [patentFile, setPatentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const renderTypePartnerDropdown = () => (
    <div>
      <label
        htmlFor="typePartnerId"
        className="mb-4 block font-medium md:text-lg"
      >
        Partner Type *
      </label>
      <select
        className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
        id="typePartnerId"
        name="typePartnerId"
        required
        value={formData.typePartnerId}
        onChange={handleInputChange}
        disabled={loadingPartners}
      >
        <option value="">{partnerError || "Select Partner Type"}</option>

        {loadingPartners ? (
          <option disabled>Loading partner types...</option>
        ) : (
          typePartners.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))
        )}

        {!loadingPartners && typePartners.length === 0 && (
          <option disabled>No partner types available</option>
        )}
      </select>

      {partnerError && (
        <p className="mt-2 text-sm text-red-500">{partnerError}</p>
      )}
    </div>
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange =
    (setFile: React.Dispatch<React.SetStateAction<File | null>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (logoFile) data.append("logo", logoFile);
    if (patentFile) data.append("patent", patentFile);

    try {
      const response = await fetch("/marketplace/partners/create", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create partner");
      }

      toast.success("Partner created successfully!");
      router.push("/marketplace/partners/all");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 w-full px-3 py-6 duration-300 sm:px-4 lg:py-8 xxxl:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 lg:mb-8">
        <h2 className="h2">Create New Partner</h2>
        <a className="btn" href="/marketplace/partners/all">
          Manage Partners
        </a>
      </div>
      <div className="grid grid-cols-12 gap-4 xxxl:gap-6">
        <form className="col-span-12" onSubmit={handleSubmit}>
          <div className="box w-full xl:p-8">
            <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
              <p className="font-medium">Partner Details</p>
              <div className="relative top-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cursor-pointer"
                >
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                  <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                  <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                </svg>
              </div>
            </div>
            <div className="box mb-6 grid grid-cols-2 gap-4 bg-primary/5 dark:bg-bg3 md:p-4 xl:p-6 xxxl:gap-6">
              <div className="bb-dashed col-span-2 pb-6">
                <p className="mb-1 font-medium">Create New Partner</p>
                <span className="text-xs">Enter partner details below</span>
              </div>

              {/* Left Column */}
              <div className="col-span-2 space-y-4 md:col-span-1">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Username *
                  </label>
                  <input
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    placeholder="Enter username"
                    id="username"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    First Name *
                  </label>
                  <input
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    placeholder="Enter first name"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Last Name *
                  </label>
                  <input
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    placeholder="Enter last name"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    placeholder="Enter email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Password *
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    placeholder="Enter password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-2 space-y-4 md:col-span-1">
                <div>
                  <label
                    htmlFor="telephone"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Phone *
                  </label>
                  <input
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    placeholder="Enter phone number"
                    id="telephone"
                    name="telephone"
                    required
                    value={formData.telephone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Address *
                  </label>
                  <input
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    placeholder="Enter address"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="responsibleName"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Responsible Name *
                  </label>
                  <input
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    placeholder="Enter responsible name"
                    id="responsibleName"
                    name="responsibleName"
                    required
                    value={formData.responsibleName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="position"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Position *
                  </label>
                  <input
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    placeholder="Enter position"
                    id="position"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="coverageArea"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Coverage Area *
                  </label>
                  <input
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    placeholder="Enter coverage area"
                    id="coverageArea"
                    name="coverageArea"
                    required
                    value={formData.coverageArea}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Bottom Section */}
              <div className="col-span-2 space-y-4">
                <div>
                  <label
                    htmlFor="minimumAmount"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Minimum Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    placeholder="Enter minimum amount"
                    id="minimumAmount"
                    name="minimumAmount"
                    required
                    value={formData.minimumAmount}
                    onChange={handleInputChange}
                  />
                </div>

                {renderTypePartnerDropdown()}

                <div>
                  <label
                    htmlFor="logo"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Logo (Optional)
                  </label>
                  <input
                    type="file"
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    id="logo"
                    accept="image/*"
                    onChange={handleFileChange(setLogoFile)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="patent"
                    className="mb-4 block font-medium md:text-lg"
                  >
                    Patent (Optional)
                  </label>
                  <input
                    type="file"
                    className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                    id="patent"
                    accept="application/pdf"
                    onChange={handleFileChange(setPatentFile)}
                  />
                </div>
                <input type="hidden" name="roleId" value="2" />

                <div className="col-span-2 flex justify-end gap-4">
                  <button
                    type="submit"
                    className="btn hover:shadow-none"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Partner"}
                  </button>
                  <button
                    type="button"
                    className="btn-outline shadow-none"
                    onClick={() => router.push("/api/marketplace/partners/all")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerForm;
