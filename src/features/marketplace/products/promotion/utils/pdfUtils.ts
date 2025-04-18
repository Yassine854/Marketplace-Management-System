import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Promotion } from "../types/promo";

export const downloadPromoPDF = (promotions: Promotion[]) => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("Promotion Report", 14, 22);

  const tableData = promotions.map((promotion) => {
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    return [
      promotion.id,
      promotion.promoPrice,
      startDate.toLocaleDateString(),
      endDate.toLocaleDateString(),
    ];
  });

  autoTable(doc, {
    head: [["ID", "Promo Price", "Start Date", "End Date"]],
    body: tableData,
    startY: 30,
  });

  doc.save("promotion_report.pdf");
};
