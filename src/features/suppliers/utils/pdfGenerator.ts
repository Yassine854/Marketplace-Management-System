import jsPDF from "jspdf";
import { Supplier, Warehouse } from "../types/types";

export const generateOrderPDF = (
  doc: jsPDF,
  selectedSupplier: Supplier | null,
  selectedWarehouse: Warehouse | null,
  selectedState: string,
  productsWithQuantities: any[],
  totalAmount: number,
) => {
  doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Order Details", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Supplier: ${selectedSupplier?.company_name}`, 20, 30);
  doc.text(`Warehouse: ${selectedWarehouse?.name}`, 20, 40);
  doc.text(`State: ${selectedState}`, 20, 50);

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(20, 55, 190, 55);

  let currentY = 65;
  const tableMargin = 20;
  const tableWidth = 170;

  doc.setFontSize(10);
  doc.setFillColor(230, 230, 230);
  doc.rect(tableMargin, currentY, tableWidth, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.text("No.", tableMargin + 5, currentY + 7);
  doc.text("Product", tableMargin + 25, currentY + 7);
  doc.text("Quantity", tableMargin + 85, currentY + 7);
  doc.text("Price", tableMargin + 125, currentY + 7);
  doc.text("Total", tableMargin + 155, currentY + 7);

  currentY += 12;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(tableMargin, currentY, tableMargin + tableWidth, currentY);

  currentY += 5;

  doc.setFont("helvetica", "normal");
  productsWithQuantities.forEach((item, index) => {
    if (
      item.product?.productName &&
      item.quantity &&
      item.priceExclTax &&
      item.total
    ) {
      doc.text(`${index + 1}`, tableMargin + 5, currentY + 7);
      doc.text(item.product.productName, tableMargin + 25, currentY + 7);
      doc.text(item.quantity.toString(), tableMargin + 85, currentY + 7);
      doc.text(item.priceExclTax.toFixed(2), tableMargin + 125, currentY + 7);
      doc.text(item.total.toFixed(2), tableMargin + 155, currentY + 7);

      currentY += 10;
    }
  });

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(tableMargin, currentY, tableMargin + tableWidth, currentY);

  let totalAmountText = `Total Amount: ${totalAmount.toFixed(2)}`;
  currentY += 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(totalAmountText, tableMargin, currentY);
  doc.save("order-details.pdf");
};
