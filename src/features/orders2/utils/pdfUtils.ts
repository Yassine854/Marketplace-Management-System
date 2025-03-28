import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { OrderWithRelations } from "../types/order";

export const downloadOrderPDF = (order: OrderWithRelations) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setFontSize(16);
  doc.text(`Order Report - #${order.id}`, 14, 15);

  let startY = 25;

  const orderTableData = [
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
      order.status.name,
      order.state.name,
      `${order.customer.firstName} ${order.customer.lastName}`,
      order.agent ? `${order.agent.firstName} ${order.agent.lastName}` : "N/A",
      new Date(order.createdAt).toLocaleString(),
      new Date(order.updatedAt).toLocaleString(),
    ],
  ];

  autoTable(doc, {
    head: [
      [
        "ID",
        "Amount Excl. Taxe",
        "Amount TTC",
        "Amount Before Promo",
        "Amount After Promo",
        "Amount Refunded",
        "Amount Canceled",
        "Amount Ordered",
        "Amount Shipped",
        "Shipping Method",
        "Status",
        "State",
        "Customer",
        "Agent",
        "Created At",
        "Updated At",
      ],
    ],
    body: orderTableData,
    startY,
    theme: "grid",
    styles: {
      fontSize: 7,
      cellPadding: 2,
      overflow: "linebreak",
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
      7: { cellWidth: 20 },
      8: { cellWidth: 20 },
      9: { cellWidth: 30 },
      10: { cellWidth: 20 },
      11: { cellWidth: 20 },
      12: { cellWidth: 30 },
      13: { cellWidth: 30 },
      14: { cellWidth: 25 },
      15: { cellWidth: 25 },
    },
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: [255, 255, 255],
      fontSize: 7,
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    tableWidth: "auto",
    margin: { top: 25, left: 10, right: 10 },
  });

  doc.save(`order_${order.id}_report.pdf`);
};
