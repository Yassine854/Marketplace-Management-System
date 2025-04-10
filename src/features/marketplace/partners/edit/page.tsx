import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { useRouter } from "@/libs/next-intl/i18nNavigation";
import { useParams } from "next/navigation";

type Partner = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address: string;
  roleId: string;
  isActive: boolean;
  logo?: string;
  patent?: string;
  responsibleName: string;
  position: string;
  coverageArea: string;
  minimumAmount: number;
  typePartner: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

type TypePartner = {
  id: string;
  name: string;
};

const EditPartnerPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [typePartners, setTypePartners] = useState<TypePartner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [partnerError, setPartnerError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [patentFile, setPatentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removePatent, setRemovePatent] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    address: "",
    responsibleName: "",
    position: "",
    coverageArea: "",
    minimumAmount: "",
    typePartnerId: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/marketplace/partners/${id}`);
        if (!response.ok) throw new Error("Failed to fetch partner");
        const data = await response.json();

        setPartner(data.partner);
        setFormData({
          username: data.partner.username,
          firstName: data.partner.firstName,
          lastName: data.partner.lastName,
          email: data.partner.email,
          telephone: data.partner.telephone,
          address: data.partner.address,
          responsibleName: data.partner.responsibleName,
          position: data.partner.position,
          coverageArea: data.partner.coverageArea,
          minimumAmount: data.partner.minimumAmount.toString(),
          typePartnerId: data.partner.typePartner.id,
          isActive: data.partner.isActive,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load partner",
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchTypePartners = async () => {
      try {
        const response = await fetch("/api/marketplace/typePartner/getAll");
        if (!response.ok) throw new Error("Failed to fetch partner types");
        const data = await response.json();
        setTypePartners(data.typePartners);
        setPartnerError(null);
      } catch (error: any) {
        setPartnerError(error.message || "Failed to load partner types");
        toast.error("Could not load partner types");
      } finally {
        setLoadingPartners(false);
      }
    };

    fetchPartner();
    fetchTypePartners();
  }, [id]);

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

  const handleRemoveLogo = () => {
    setRemoveLogo(!removeLogo);
  };

  const handleRemovePatent = () => {
    setRemovePatent(!removePatent);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, typeof value === "boolean" ? value.toString() : value);
    });

    data.append("removeLogo", removeLogo.toString());
    data.append("removePatent", removePatent.toString());

    if (logoFile) data.append("logo", logoFile);
    if (patentFile) data.append("patent", patentFile);
    data.append("roleId", "2");

    try {
      const response = await fetch(`/api/marketplace/partners/${id}`, {
        method: "PATCH",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update partner");
      }

      toast.success("Partner updated successfully!");
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
        {typePartners.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="mt-12 w-full px-3 py-6 duration-300 sm:px-4 lg:py-8 xxxl:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 lg:mb-8">
        <h2 className="h2">Edit Partner</h2>
        <a className="btn" href="/marketplace/partners/all">
          Manage Partners
        </a>
      </div>
      <div className="grid grid-cols-12 gap-4 xxxl:gap-6">
        <form className="col-span-12" onSubmit={handleSubmit}>
          <div className="box w-full xl:p-8">
            <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
              <p className="font-medium">Partner Details</p>
            </div>
            <div className="box mb-6 grid grid-cols-2 gap-4 bg-primary/5 dark:bg-bg3 md:p-4 xl:p-6 xxxl:gap-6">
              <div className="bb-dashed col-span-2 pb-6">
                <p className="mb-1 font-medium">Edit Partner Details</p>
                <span className="text-xs">
                  Modify partner information below
                </span>
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
              </div>

              {/* Bottom Section */}
              <div className="col-span-2 space-y-4">
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
                  <label className="mb-4 block font-medium md:text-lg">
                    Status *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="isActive"
                        value="true"
                        checked={formData.isActive === true}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, isActive: true }))
                        }
                        className="accent-primary"
                      />
                      Active
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="isActive"
                        value="false"
                        checked={formData.isActive === false}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, isActive: false }))
                        }
                        className="accent-primary"
                      />
                      Inactive
                    </label>
                  </div>
                </div>

                {/* Logo Section */}
                <div className="col-span-2">
                  <label className="mb-2 block font-medium">
                    Logo (Optional)
                  </label>
                  <div className="mb-4 flex flex-wrap gap-4">
                    {partner?.logo && !removeLogo ? (
                      <div className="group relative">
                        <img
                          src={partner.logo}
                          alt="Logo"
                          className="h-24 w-24 rounded object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                        id="logo"
                        accept="image/*"
                        onChange={(e) => {
                          handleFileChange(setLogoFile)(e);
                          setRemoveLogo(false);
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Patent Section */}
                <div className="col-span-2">
                  <label className="mb-2 block font-medium">
                    Patent (Optional)
                  </label>
                  <div className="mb-4 flex flex-wrap gap-4">
                    {(partner?.patent && !removePatent) || patentFile ? (
                      <div className="group relative flex items-center gap-2">
                        <div className="rounded bg-gray-100 px-4 py-2 dark:bg-bg3">
                          {patentFile ? (
                            <span>{patentFile.name}</span>
                          ) : (
                            <a
                              href={partner?.patent}
                              target="_blank"
                              className="text-primary hover:underline"
                            >
                              {partner?.patent?.split("/").pop()}
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setRemovePatent(!removePatent);
                            setPatentFile(null);
                          }}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        className="w-full rounded-3xl border border-n30 bg-n0 px-6 py-3 text-sm focus:outline-none dark:border-n500 dark:bg-bg4"
                        id="patent"
                        accept="application/pdf"
                        onChange={(e) => {
                          handleFileChange(setPatentFile)(e);
                          setRemovePatent(false);
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="col-span-2 flex justify-end gap-4">
                  <button
                    type="submit"
                    className="btn hover:shadow-none"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Partner"}
                  </button>
                  <button
                    type="button"
                    className="btn-outline shadow-none"
                    onClick={() => router.push("/marketplace/partners/all")}
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

export default EditPartnerPage;
