// pdfUtils.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Tax } from "../types/tax";

export const downloadTaxPDF = (taxes: Tax[]) => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("Tax Report", 14, 22);

  const tableData = taxes.map((tax) => [tax.id, tax.value]);

  autoTable(doc, {
    head: [["ID", "Value"]],
    body: tableData,
    startY: 30,
  });

  doc.save("tax_report.pdf");
};
