import { magento } from "@/libs/magento";

export const onPDFIconClick = async (orderId: string): Promise<void> => {
  try {
    const pdfUrl = await magento.generateOrderSummary(orderId);
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
