import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { EmailParams } from "../types/types";

export const sendOrderEmail = async (params: EmailParams) => {
  const loadingToast = toast.loading("Email sending in progress...");

  try {
    await emailjs.send(
      "service_z1bkm7y",
      "template_b63ikd2",
      params,
      "1I-USeEEq-xcp9edT",
    );

    toast.success("Order validated and email sent successfully!", {
      id: loadingToast,
      duration: 4000,
      style: { background: "#4caf50", color: "#fff", fontWeight: "bold" },
    });
    return true;
  } catch (error) {
    toast.error("Error sending email.", {
      id: loadingToast,
      duration: 4000,
      style: { background: "#f44336", color: "#fff", fontWeight: "bold" },
    });
    return false;
  }
};
