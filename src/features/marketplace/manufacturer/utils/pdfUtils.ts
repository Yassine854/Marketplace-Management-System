// utils/pdfUtils.ts
import jsPDF from "jspdf";
import { Manufacturer } from "../types/manufacturer"; // Import the Manufacturer type

export const downloadManufacturerPDF = (manufacturers: Manufacturer[]) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Manufacturers List", 14, 22);

  doc.setFontSize(12);
  doc.text("ID", 14, 30);
  doc.text("Company Name", 50, 30);
  doc.text("Contact Name", 100, 30);
  doc.text("Email", 150, 30);

  manufacturers.forEach((manufacturer, index) => {
    const y = 40 + index * 10;
    doc.text(manufacturer.id, 14, y);
    doc.text(manufacturer.companyName, 50, y);
    doc.text(manufacturer.contactName || "", 100, y);
    doc.text(manufacturer.email || "", 150, y);
  });

  doc.save("manufacturers.pdf");
};
