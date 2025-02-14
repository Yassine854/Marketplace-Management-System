import jsPDF from "jspdf";
import { Supplier, Product } from "../types/types";

export const generatePDF = (
  selectedSupplier: Supplier,
  selectedProducts: Product[],
  quantities: { [productId: string]: number },
  totalPayment: number,
  selectedPaymentMode: string,
) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Order Details", 14, 20);
  doc.setFontSize(12);
  doc.text(`Company Name: ${selectedSupplier.company_name}`, 14, 30);
  doc.text(`Contact Name: ${selectedSupplier.contact_name}`, 14, 40);
  doc.text(`Email: ${selectedSupplier.email}`, 14, 50);
  doc.text("Products:", 14, 60);

  selectedProducts.forEach((product, index) => {
    const quantity = quantities[product.id] || 0;
    doc.text(
      `${index + 1}. ${product.productName} - Quantity: ${quantity} - Price: ${
        product.productPrice
      }`,
      14,
      70 + index * 10,
    );
  });

  doc.text(`Total Payment: ${totalPayment.toFixed(2)} DT`, 14, 100);
  doc.text(`Payment Mode: ${selectedPaymentMode}`, 14, 110);

  doc.save(`Order_${selectedSupplier.company_name}.pdf`);
};
