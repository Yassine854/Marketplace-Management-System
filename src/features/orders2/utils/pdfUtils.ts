import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { OrderWithRelations } from "../types/order";

export const downloadOrderPDF = (order: OrderWithRelations) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setFontSize(12);

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
      order.isActive ? "Active" : "Inactive",
      new Date(order.createdAt).toLocaleString(),
      new Date(order.updatedAt).toLocaleString(),
    ],
  ];

  autoTable(doc, {
    head: [
      [
        "ID",
        "Amt Excl. Tax",
        "Amt TTC",
        "Amt Before Promo",
        "Amt After Promo",
        "Amt Refunded",
        "Amt Canceled",
        "Amt Ordered",
        "Amt Shipped",
        "Shipping Method",
        "Status",
        "State",
        "Customer",
        "Agent",
        "Is Active",
        "Created At",
        "Updated At",
      ],
    ],
    body: orderTableData,
    startY,
    theme: "grid",
    styles: {
      fontSize: 6,
      cellPadding: 2,
      overflow: "linebreak",
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 15 },
      2: { cellWidth: 15 },
      3: { cellWidth: 15 },
      4: { cellWidth: 15 },
      5: { cellWidth: 15 },
      6: { cellWidth: 15 },
      7: { cellWidth: 15 },
      8: { cellWidth: 15 },
      9: { cellWidth: 20 },
      10: { cellWidth: 15 },
      11: { cellWidth: 15 },
      12: { cellWidth: 20 },
      13: { cellWidth: 20 },
      14: { cellWidth: 15 },
      15: { cellWidth: 18 },
      16: { cellWidth: 18 },
    },
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: [255, 255, 255],
      fontSize: 6,
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    margin: { horizontal: 10 },
    didDrawPage: function (data) {
      if (data.cursor) {
        startY = data.cursor.y + 10;
      }
    },
  });

  if (order.reservation) {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Reservation Details", 14, startY);
    startY += 7;

    const reservationTableData = [
      [
        order.reservation.id,
        order.reservation.amountExclTaxe,
        order.reservation.amountTTC,
        order.reservation.amountBeforePromo,
        order.reservation.amountAfterPromo,
        order.reservation.shippingMethod,
        `${order.reservation.customer?.firstName || ""} ${
          order.reservation.customer?.lastName || "N/A"
        }`,
        order.reservation.paymentMethod?.name || "N/A",
        new Date(order.reservation.createdAt).toLocaleString(),
      ],
    ];

    autoTable(doc, {
      head: [
        [
          "ID",
          "Amt Excl. Tax",
          "Amt TTC",
          "Amt Before Promo",
          "Amt After Promo",
          "Shipping Method",
          "Customer",
          "Payment Method",
          "Created At",
        ],
      ],
      body: reservationTableData,
      startY,
      theme: "grid",
      styles: {
        fontSize: 6,
        cellPadding: 2,
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: [51, 102, 0],
        textColor: [255, 255, 255],
        fontSize: 6,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { horizontal: 10 },
      didDrawPage: function (data) {
        if (data.cursor) {
          startY = data.cursor.y + 10;
        }
      },
    });

    doc.setFontSize(10);
    doc.text("Reservation Items", 14, startY);
    startY += 7;

    const reservationItemsData = order.reservation.reservationItems.map(
      (item) => [
        item.sku,
        item.qteReserved,
        item.qteCanceled,
        item.discountedPrice,
        item.weight,
        item.product?.name || "N/A",
        item.tax?.value || "N/A",
      ],
    );

    autoTable(doc, {
      head: [
        [
          "SKU",
          "Reserved Qty",
          "Canceled Qty",
          "Price",
          "Weight",
          "Product",
          "Tax",
        ],
      ],
      body: reservationItemsData,
      startY,
      theme: "grid",
      styles: {
        fontSize: 6,
        cellPadding: 2,
        overflow: "linebreak",
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 15 },
        2: { cellWidth: 15 },
        3: { cellWidth: 20 },
        4: { cellWidth: 15 },
        5: { cellWidth: 30 },
        6: { cellWidth: 15 },
      },
      headStyles: {
        fillColor: [102, 51, 0],
        textColor: [255, 255, 255],
        fontSize: 6,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { horizontal: 10 },
      didDrawPage: function (data) {
        if (data.cursor) {
          startY = data.cursor.y + 10;
        }
      },
    });
  }

  doc.setFontSize(10);
  doc.text("Order Items", 14, startY);
  startY += 7;

  const orderItemsTableData = order.orderItems.map((item) => [
    item.sku,
    item.qteOrdered,
    item.qteShipped,
    item.qteRefunded,
    item.qteCanceled,
    item.discountedPrice,
    item.weight,
  ]);

  autoTable(doc, {
    head: [
      [
        "SKU",
        "Ordered Qty",
        "Shipped Qty",
        "Refunded Qty",
        "Canceled Qty",
        "Price",
        "Weight",
      ],
    ],
    body: orderItemsTableData,
    startY,
    theme: "grid",
    styles: {
      fontSize: 6,
      cellPadding: 2,
      overflow: "linebreak",
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 15 },
      2: { cellWidth: 15 },
      3: { cellWidth: 15 },
      4: { cellWidth: 15 },
      5: { cellWidth: 20 },
      6: { cellWidth: 15 },
    },
    headStyles: {
      fillColor: [102, 0, 51],
      textColor: [255, 255, 255],
      fontSize: 6,
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    margin: { horizontal: 10 },
  });

  doc.save(`order_${order.id}_report.pdf`);
};
