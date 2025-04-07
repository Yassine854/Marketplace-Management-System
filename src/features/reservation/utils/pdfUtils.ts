import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Reservation } from "../types/reservation";

export const downloadReservationPDF = (reservations: Reservation[]) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setFontSize(16);
  doc.text("Reservation Report", 14, 15);

  let startY = 25;

  reservations.forEach((reservation) => {
    const tableData = [
      [
        reservation.id,
        reservation.amountExclTaxe,
        reservation.amountTTC,
        reservation.amountBeforePromo,
        reservation.amountAfterPromo,
        reservation.amountRefunded,
        reservation.amountCanceled,
        reservation.amountOrdered,
        reservation.amountShipped,
        reservation.shippingMethod,
        reservation.isActive ? "Active" : "Inactive",
        reservation.loyaltyPtsValue,
        reservation.fromMobile ? "Yes" : "No",
        reservation.weight,
        new Date(reservation.createdAt).toLocaleDateString(),
        new Date(reservation.updatedAt).toLocaleDateString(),
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
          "State",
          "Loyalty Pts",
          "From Mobile",
          "Weight",
          "Created At",
          "Updated At",
        ],
      ],
      body: tableData,
      startY,
      theme: "grid",
      styles: {
        fontSize: 7,
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
        5: { cellWidth: 15 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
        8: { cellWidth: 15 },
        9: { cellWidth: 25 },
        10: { cellWidth: 15 },
        11: { cellWidth: 15 },
        12: { cellWidth: 15 },
        13: { cellWidth: 15 },
        14: { cellWidth: 20 },
        15: { cellWidth: 20 },
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

    startY += 10 + tableData.length * 6;
    startY += 20;

    if (reservation.reservationItems.length > 0) {
      doc.setFontSize(12);
      doc.text(`Items for Reservation #${reservation.id}`, 14, startY);
      startY += 6;

      const itemTableData = reservation.reservationItems.map((item) => [
        item.sku,
        item.qteReserved,
        `${item.discountedPrice} DT`,
        `${item.weight} kg`,
        item.productName || "N/A",
        `${item.taxValue ?? 0} DT`,
      ]);

      autoTable(doc, {
        head: [
          [
            "SKU",
            "Reserved Qty",
            "Canceled Qty",
            "Discounted Price",
            "Weight",
            "Product Name",
            "Tax Value",
          ],
        ],
        body: itemTableData,
        startY,
        theme: "grid",
        styles: { fontSize: 7, cellPadding: 2, valign: "middle" },
        headStyles: {
          fillColor: [50, 50, 50],
          textColor: [255, 255, 255],
          fontSize: 7,
          halign: "center",
        },
        alternateRowStyles: { fillColor: [230, 230, 230] },
        tableWidth: "auto",
        margin: { left: 10, right: 10 },
      });

      startY += 10 + itemTableData.length * 6;
    }
  });

  doc.save("reservation_report.pdf");
};
