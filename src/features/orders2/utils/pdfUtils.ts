import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { OrderWithRelations } from "../types/order"; // Update the import to your Order type

export const downloadOrderPDF = (order: OrderWithRelations) => {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(18);
  doc.text("Order Details", 14, 15);

  const tableData = [
    [
      order.id,
      order.amountExclTaxe,
      order.amountTTC,
      order.amountBeforePromo,
      order.amountAfterPromo,
      order.amountRefunded,
      order.amountCanceled,
      order.amountOrdered,
      order.amountShipped,
      order.shippingMethod,
      order.loyaltyPtsValue,
      order.fromMobile ? "Yes" : "No",
      order.weight,
      new Date(order.createdAt).toLocaleString(),
      new Date(order.updatedAt).toLocaleString(),
      order.status.name,
      order.state.name,
      `${order.customer.firstName} ${order.customer.lastName}`,
      order.agent ? `${order.agent.firstName} ${order.agent.lastName}` : "N/A",
      order.reservation ? order.reservation.id : "N/A",
      `${order.partner.firstName} ${order.partner.lastName}`,
      order.orderItems.length,
      order.paymentMethod.name,
    ],
  ];

  autoTable(doc, {
    head: [
      [
        "ID",
        "Amount Excl. Tax",
        "Amount TTC",
        "Amount Before Promo",
        "Amount After Promo",
        "Amount Refunded",
        "Amount Canceled",
        "Amount Ordered",
        "Amount Shipped",
        "Shipping Method",
        "Loyalty Points Value",
        "From Mobile",
        "Weight",
        "Created At",
        "Updated At",
        "Status",
        "State",
        "Customer",
        "Agent",
        "Reservation",
        "Partner",
        "Items Count",
        "Payment Method",
      ],
    ],
    body: tableData,
    startY: 25,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 2,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
      6: { cellWidth: 25 },
      7: { cellWidth: 25 },
      8: { cellWidth: 25 },
      9: { cellWidth: 30 },
      10: { cellWidth: 25 },
      11: { cellWidth: 20 },
      12: { cellWidth: 20 },
      13: { cellWidth: 20 },
      14: { cellWidth: 20 },
      15: { cellWidth: 20 },
      16: { cellWidth: 30 },
      17: { cellWidth: 30 },
      18: { cellWidth: 30 },
      19: { cellWidth: 30 },
      20: { cellWidth: 30 },
      21: { cellWidth: 30 },
    },
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: [255, 255, 255],
      fontSize: 12,
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    tableWidth: "auto",
  });

  doc.save(`order_${order.id}.pdf`); // Save the PDF with the order ID
};
