import { useState } from "react";
import toast from "react-hot-toast";
import { Partner } from "@/types/partner";

interface EditPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (partner: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    address: string;
    password: string;
    mRoleId: string;
    logo?: File;
    patent?: File;
    responsibleName: string;
    position: string;
    coverageArea: string;
    minimumAmount: number;
    typePartnerId: string;
  }) => void;
  typePartners: Array<{ id: string; name: string }>;
  roles: Array<{ id: string; name: string }>;
  partner: Partner;
}

const EditPartnerModal = ({
  isOpen,
  onClose,
  onEdit,
  typePartners,
  roles,
  partner,
}: EditPartnerModalProps) => {
  const [formData, setFormData] = useState({
    username: partner.username,
    firstName: partner.firstName,
    lastName: partner.lastName,
    email: partner.email,
    telephone: partner.telephone,
    address: partner.address,
    password: partner.password,
    mRoleId: partner.mRoleId,
    logo: undefined as File | undefined,
    patent: undefined as File | undefined,
    responsibleName: partner.responsibleName,
    position: partner.position,
    coverageArea: partner.coverageArea,
    minimumAmount: partner.minimumAmount,
    typePartnerId: partner.typePartnerId,
  });

  const [activeTab, setActiveTab] = useState(0);
  const tabLabels = [
    "Partnership Details",
    "Personal Information",
    "Company Information",
  ];

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.telephone.trim() ||
      !formData.address.trim() ||
      !formData.responsibleName.trim() ||
      !formData.position.trim() ||
      !formData.coverageArea.trim() ||
      formData.minimumAmount <= 0 ||
      !formData.typePartnerId.trim() ||
      !formData.mRoleId.trim()
    ) {
      toast.error("Please fill in required fields");
      return;
    }
    onEdit(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-2xl bg-white p-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Edit Partner</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b">
          {tabLabels.map((label, idx) => (
            <button
              key={label}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
                activeTab === idx
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(idx)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary">
                Partnership Details
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Responsible <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.responsibleName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        responsibleName: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="w-full rounded-lg border p-2 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Coverage Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.coverageArea}
                    onChange={(e) =>
                      setFormData({ ...formData, coverageArea: e.target.value })
                    }
                    className="w-full rounded-lg border p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.minimumAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimumAmount: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border p-2 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Partner Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.typePartnerId}
                  onChange={(e) =>
                    setFormData({ ...formData, typePartnerId: e.target.value })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                >
                  <option value="">Select Partner Type</option>
                  {typePartners?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.mRoleId}
                  onChange={(e) =>
                    setFormData({ ...formData, mRoleId: e.target.value })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                >
                  <option value="">Select Role</option>
                  {roles?.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full rounded-lg border p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full rounded-lg border p-2 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                />
              </div>
            </div>
          )}
          {activeTab === 2 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary">
                Company Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telephone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Logo
                </label>
                {partner.logo && (
                  <div className="mb-2">
                    <span className="text-sm">Current Logo: </span>
                    <a
                      href={partner.logo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Logo
                    </a>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.files?.[0] })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patent
                </label>
                {partner.patent && (
                  <div className="mb-2">
                    <span className="text-sm">Current Patent: </span>
                    <a
                      href={partner.patent}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Patent
                    </a>
                  </div>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setFormData({ ...formData, patent: e.target.files?.[0] })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-400 px-6 py-3 text-base text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-6 py-3 text-base text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPartnerModal;
