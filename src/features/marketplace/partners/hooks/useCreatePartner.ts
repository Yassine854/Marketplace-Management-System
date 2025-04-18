import { useState } from "react";
import axios from "axios";

export function useCreatePartner() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPartner = async (
    partnerData: {
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      telephone: string;
      address: string;
      password: string;
      roleId: string;
      responsibleName: string;
      position: string;
      coverageArea: string;
      minimumAmount: number;
      typePartnerId: string;
      logo?: File;
      patent?: File;
    },
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("username", partnerData.username);
    formData.append("firstName", partnerData.firstName);
    formData.append("lastName", partnerData.lastName);
    formData.append("email", partnerData.email);
    formData.append("telephone", partnerData.telephone);
    formData.append("address", partnerData.address);
    formData.append("password", partnerData.password);
    formData.append("roleId", partnerData.roleId);
    formData.append("responsibleName", partnerData.responsibleName);
    formData.append("position", partnerData.position);
    formData.append("coverageArea", partnerData.coverageArea);
    formData.append("minimumAmount", partnerData.minimumAmount.toString());
    formData.append("typePartnerId", partnerData.typePartnerId);

    if (partnerData.logo) {
      formData.append("logo", partnerData.logo);
    }
    if (partnerData.patent) {
      formData.append("patent", partnerData.patent);
    }
    try {
      const response = await axios.post(
        "/api/marketplace/partners/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Erreur lors de la création du partenaire");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createPartner, isLoading, error };
}
