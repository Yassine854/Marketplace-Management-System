import Image from "next/image";
import { useState } from "react";
import EmailFormPopup from "./email";

interface SupplierDetails {
  company_name: string;
  contact_name: string;
  phone_number: string;
  email: string;
  postal_code: string;
  city: string;
  country: string;
}

interface FooterProps {
  supplier: SupplierDetails | null; // Update prop name to match parent component
}

const Footer: React.FC<FooterProps> = ({ supplier }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);

  return (
    <>
      {/* Email Form Popup */}
      {showEmailForm && supplier && (
        <EmailFormPopup
          onClose={() => setShowEmailForm(false)}
          supplierDetails={{
            company_name: supplier.company_name,
            contact_name: supplier.contact_name,
            phone_number: supplier.phone_number,
            email: supplier.email,
            address: `${supplier.postal_code} ${supplier.city}, ${supplier.country}`,
          }}
        />
      )}

      <footer className="mt-12 bg-[#384179] py-3 text-center text-white">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between">
          {/* Kamioun Logo */}
          <div>
            <Image
              alt="logo"
              width={100}
              height={38}
              src="/images/kamioun.png"
            />
          </div>

          {/* Liste des services */}
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold">Liste des services</h3>
            <div className="flex justify-center space-x-6">
              <div className="text-sm">Service Ads</div>
              <div className="text-sm">
                Services d&apos;Exécution des Commandes
              </div>
              <div className="text-sm">Collaboration Marketing</div>
              <div className="text-sm">Support Technique</div>
              <div className="text-sm">Gestion de Compte</div>
            </div>
          </div>

          {/* Request Service Button */}
          <div>
            <button
              onClick={() => setShowEmailForm(true)}
              className="rounded-md bg-[rgb(251_201_22/_var(--tw-bg-opacity))] px-4 py-1 text-black transition-all hover:bg-yellow-500"
            >
              Demander un service
            </button>
          </div>
        </div>

        {/* Rights Reserved Text */}
        <p className="mt-3 text-sm">© 2025 Kamioun. Tous droits réservés.</p>
      </footer>
    </>
  );
};

export default Footer;
