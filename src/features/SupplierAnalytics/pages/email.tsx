import React, { useState } from "react";
import emailjs from "@emailjs/browser";

interface SupplierDetails {
  company_name: string;
  contact_name: string;
  phone_number: string;
  email: string;
  address: string;
}

interface EmailFormPopupProps {
  onClose: () => void;
  supplierDetails: SupplierDetails;
}

const servicesList = [
  "Service Ads",
  "Support de Gestion des Stocks",
  "Services d'Exécution des Commandes",
  "Collaboration Marketing",
  "Support Technique",
  "Gestion de Compte",
];

const EmailFormPopup: React.FC<EmailFormPopupProps> = ({
  onClose,
  supplierDetails,
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [contactName, setContactName] = useState(supplierDetails.contact_name);
  const [contactPhone, setContactPhone] = useState(
    supplierDetails.phone_number,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const templateParams = {
      // to_email: "achat@kamioun.tn",
      to_email: "medhioubyassine@gmail.com",
      from_name: supplierDetails.company_name,
      reply_to: supplierDetails.email,
      subject: `[${supplierDetails.company_name}] - Request for Services`,
      message: `Hello Kamioun team,

I ${supplierDetails.company_name} would love to request the following services:
${selectedServices.map((service) => `- ${service}`).join("\n")}

Here’s my contact information:
- Contact Person: ${contactName}
- Phone Number: ${contactPhone}
- Email: ${supplierDetails.email}
- Company Address: ${supplierDetails.address}

Best,
${supplierDetails.company_name}`,
    };

    try {
      await emailjs.send(
        "service_uyp6kf7", // Replace with your EmailJS service ID
        "template_zrvu0d5", // Replace with your EmailJS template ID
        templateParams,
        "lib5DzwJvadW8SbiB", // Replace with your EmailJS user ID
      );
      onClose();
    } catch (err) {
      setError("Failed to send request. Please try again.");
      console.error("Email sending error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-[90vw] rounded-lg bg-white p-4 md:max-w-md md:p-6">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-lg font-bold md:text-xl">
            Formulaire de demande de service
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-700 md:text-base"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          {/* Subject Input */}
          <div>
            <label className="mb-1 block text-sm font-medium">Sujet</label>
            <input
              type="text"
              disabled
              value={`[${supplierDetails.company_name}] - Request for Services`}
              className="w-full rounded border bg-gray-100 p-2 text-sm md:text-base"
            />
          </div>

          {/* Services Multi-select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sélectionnez service(s)
            </label>

            <div className="relative">
              <div className="max-h-48 min-h-[6rem] w-full overflow-y-auto rounded border p-2 md:min-h-[8rem]">
                {servicesList.map((service) => (
                  <div
                    key={service}
                    onClick={() => {
                      setSelectedServices((prev) =>
                        prev.includes(service)
                          ? prev.filter((s) => s !== service)
                          : [...prev, service],
                      );
                    }}
                    className={`mb-1 cursor-pointer rounded p-2 text-sm md:text-base ${
                      selectedServices.includes(service)
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {service}
                    {selectedServices.includes(service) && (
                      <span className="ml-2 text-blue-600">✓</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Hidden select for form submission */}
              <select
                multiple
                required
                className="hidden"
                value={selectedServices}
                onChange={() => {}}
                name="services"
              >
                {servicesList.map((service) => (
                  <option key={service} value={service} />
                ))}
              </select>
            </div>

            {selectedServices.length > 0 && (
              <div className="mt-1 line-clamp-2 text-xs text-gray-600 md:text-sm">
                Selected: {selectedServices.join(", ")}
              </div>
            )}
          </div>

          {error && (
            <div className="text-center text-sm text-red-500">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-500 p-2 text-sm text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </div>
            ) : (
              "Envoyer demande"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailFormPopup;
