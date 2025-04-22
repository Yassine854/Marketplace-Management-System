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
    roleId: string;
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
    roleId: partner.roleId,
    logo: undefined as File | undefined,
    patent: undefined as File | undefined,
    responsibleName: partner.responsibleName,
    position: partner.position,
    coverageArea: partner.coverageArea,
    minimumAmount: partner.minimumAmount,
    typePartnerId: partner.typePartnerId,
  });

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
      !formData.roleId.trim()
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
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-3xl font-bold text-gray-800">Edit Partner</h2>

        <div className="grid grid-cols-1 gap-6 divide-y divide-gray-200 md:grid-cols-2">
          {/* Personal Information */}
          <div className="space-y-4 pb-6">
            <h3 className="text-xl font-semibold text-primary">
              Personal Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4 pb-6 pt-6">
            <h3 className="text-xl font-semibold text-primary">
              Company Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telephone
                </label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
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
                  className="w-full rounded-lg border p-3"
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
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>
          </div>

          {/* Partnership Details */}
          <div className="space-y-4 pt-6 md:col-span-2">
            <h3 className="text-xl font-semibold text-primary">
              Partnership Details
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Responsible Name *
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
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coverage Area *
                </label>
                <input
                  type="text"
                  value={formData.coverageArea}
                  onChange={(e) =>
                    setFormData({ ...formData, coverageArea: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Amount *
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
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Partner Type *
                </label>
                <select
                  value={formData.typePartnerId}
                  onChange={(e) =>
                    setFormData({ ...formData, typePartnerId: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Role *
                </label>
                <select
                  value={formData.roleId}
                  onChange={(e) =>
                    setFormData({ ...formData, roleId: e.target.value })
                  }
                  className="w-full rounded-lg border p-3"
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
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-400 px-5 py-2 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPartnerModal;
