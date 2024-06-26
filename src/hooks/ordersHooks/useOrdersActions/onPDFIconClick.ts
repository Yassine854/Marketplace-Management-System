import { generateOrderSummary } from "@/libs/magento/generateOrderSummary";

export const onPDFIconClick = async (orderId: string): Promise<void> => {
  try {
    const pdfUrl = await generateOrderSummary(orderId);
    let properties =
      "height=" +
      window.innerHeight +
      ",width=" +
      window.innerWidth +
      "," +
      "scrollbars=yes,status=yes";
    window.open(pdfUrl, properties);
  } catch {}
};
