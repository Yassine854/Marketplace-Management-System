import React, { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface OrderPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any; // VendorOrder type
  partner?: any; // Partner data
}

const OrderPrintModal: React.FC<OrderPrintModalProps> = ({
  isOpen,
  onClose,
  order,
  partner,
}) => {
  // Move hooks to the top level of the component
  const printRef = useRef<HTMLDivElement>(null);

  // Set document title for printing
  useEffect(() => {
    if (isOpen && order) {
      const originalTitle = document.title;
      const today = new Date().toLocaleDateString();
      document.title = `Bon_de_commande_${order.orderCode}_${today}`;

      return () => {
        document.title = originalTitle;
      };
    }
  }, [isOpen, order]);

  // Early return after hooks are declared
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;

    if (printContent) {
      // Create a new window for printing with a specific name to avoid about:blank
      const printWindow = window.open(
        "",
        "print_window",
        "width=800,height=600",
      );
      if (!printWindow) {
        alert("Please allow popups for this website to print the order.");
        return;
      }

      // Fix the unescaped entity on line 455
      // Change any instances of ' to &apos;
      // For example: "Montant minimum de commande : ${partner.minimumAmount} TND"

      // Write the print content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Bon_de_commande_${
            order.orderCode
          }_${new Date().toLocaleDateString()}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 0;
              margin: 0;
              font-size: 12px;
              line-height: 1.4;
            }
            * {
              box-sizing: border-box;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
            }
            th, td {
              padding: 4px 6px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            
            /* Print-specific layout */
            .print-container {
              max-width: 100%;
              margin: 0 auto;
              padding: 10px;
            }
            
            /* Header with logo */
            .print-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            }
            .print-header h1 {
              margin: 0;
              color: #0891b2;
              font-weight: bold;
              font-size: 24px;
            }
            .print-logo {
              width: 60px;
              height: 60px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            /* Two-column layout sections */
            .print-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
              width: 100%;
            }
            .print-col-50 {
              width: 48%;
            }
            
            /* Info box with grid layout */
            .print-info-box {
              background-color: #f9fafb;
              border-radius: 8px;
              padding: 10px;
              margin-bottom: 15px;
            }
            .print-info-grid {
              display: flex;
              justify-content: space-between;
            }
            .print-info-col {
              width: 48%;
            }
            
            /* Field groups with consistent heights */
            .field-group {
              margin-bottom: 5px;
            }
            .field-group p {
              margin: 0;
              line-height: 1.4;
            }
            .field-label {
              font-weight: bold;
              display: inline-block;
              min-width: 120px;
            }
            
            /* Table styles */
            .items-table {
              margin-bottom: 15px;
            }
            .text-right {
              text-align: right;
            }
            
            /* Totals section */
            .print-totals {
              display: flex;
              justify-content: flex-end;
              margin-top: 15px;
            }
            .print-totals-content {
              width: 200px;
            }
            .print-total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
            }
            
            /* Signature section */
            .print-signature {
              margin-top: 20px;
            }
            .print-signature-line {
              height: 24px;
              width: 120px;
              border-bottom: 1px solid #d1d5db;
              margin-top: 8px;
            }
            
            h2 {
              font-size: 14px;
              margin: 0 0 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Header -->
            <div class="print-header">
              <h1>Bon de commande</h1>
              ${
                partner?.logo
                  ? `<div class="print-logo">
                    <!-- Using img instead of Next.js Image for print compatibility -->
                    <img src="${partner.logo}" alt="Logo" style="max-width:100%; max-height:100%;">
                  </div>`
                  : `<div class="print-logo" style="background-color:#facc15; border-radius:50%; color:white; font-weight:bold;">Logo</div>`
              }
            </div>
            <hr style="border-color:#06b6d4; margin-bottom:15px;">
            
            <!-- Company & Recipient -->
            <div class="print-row">
              <div class="print-col-50">
                <h2>Mon Entreprise</h2>
                <h2>${partner?.companyName || ""}</h2>
                <p>${partner?.address || ""}<br>
                ${partner?.coverageArea || ""}, Tunisie<br>
                <i>Téléphone : ${partner?.telephone || ""}</i></p>
              </div>
              <div class="print-col-50">
                <h2>Destinataire</h2>
                <p>
                  ${order.order?.customer?.firstName || ""} ${
                    order.order?.customer?.lastName || ""
                  }<br>
                  ${order.order?.customer?.address || ""}<br>
                  Tunisie
                </p>
              </div>
            </div>
            
            <!-- Order Metadata -->
            <div class="print-info-box">
              <div class="print-info-grid">
                <div class="print-info-col">
                  <div class="field-group">
                    <p><span class="field-label">Date commande :</span> ${new Date(
                      order.createdAt,
                    ).toLocaleDateString()}</p>
                  </div>
                  <div class="field-group">
                    <p><span class="field-label">Bon de commande N° :</span> ${
                      order.orderCode
                    }</p>
                  </div>
                  <div class="field-group">
                    <p><span class="field-label">Mode de paiement :</span> ${
                      order.order?.paymentMethod?.name || "Non spécifié"
                    }</p>
                  </div>
                </div>
                <div class="print-info-col">
                  <div class="field-group">
                    <p><span class="field-label">Émis par :</span> ${
                      partner?.responsibleName ||
                      partner?.firstName + " " + partner?.lastName ||
                      "Pierre Fournisseur"
                    }</p>
                  </div>
                  <div class="field-group">
                    <p><span class="field-label">Contact client :</span> ${
                      order.order?.customer?.firstName || ""
                    } ${order.order?.customer?.lastName || ""}</p>
                  </div>
                  <div class="field-group">
                    <p><span class="field-label">Téléphone du client :</span> ${
                      order.order?.customer?.telephone || ""
                    }</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Additional Info -->
            <div style="margin-bottom:15px;">
              <p style="font-weight:bold; margin:0 0 5px 0;">Informations additionnelles</p>
              <p style="margin:0 0 5px 0;">Merci d'avoir choisi ${
                partner?.companyName || "notre entreprise"
              } pour nos services.</p>
              ${
                partner?.minimumAmount
                  ? `<p style="margin:0;">Montant minimum de commande : ${partner.minimumAmount} TND</p>`
                  : ""
              }
            </div>
            
            <!-- Items Table -->
            <table class="items-table">
              <thead>
                <tr>
                  <th style="text-align:left;">Réf. produit</th>
                  <th style="text-align:left;">Nom du produit</th>
                  <th style="text-align:right;">Quantité</th>
                  <th style="text-align:right;">Prix unitaire HT</th>
                  <th style="text-align:right;">% TVA</th>
                  <th style="text-align:right;">Total HT</th>
                  <th style="text-align:right;">Total TTC</th>
                </tr>
              </thead>
              <tbody>
                ${order.itemsSnapshot
                  ?.map((item: any, idx: number) => {
                    const price = item.specialPrice ?? item.unitPrice ?? 0;
                    const quantity = item.qteOrdered || 1;
                    const totalHT = item.total_ht || price * quantity;
                    const tvaPercentage = item.tva || 20;
                    const totalTTC =
                      item.total_ttc || totalHT * (1 + tvaPercentage / 100);

                    return `
                    <tr>
                      <td style="text-align:left;">${item.sku || ""}</td>
                      <td style="text-align:left;">${
                        item.productName || ""
                      }</td>
                      <td style="text-align:right;">${quantity}</td>
                      <td style="text-align:right;">${price.toFixed(2)} TND</td>
                      <td style="text-align:right;">${tvaPercentage} %</td>
                      <td style="text-align:right;">${totalHT.toFixed(
                        2,
                      )} TND</td>
                      <td style="text-align:right;">${totalTTC.toFixed(
                        2,
                      )} TND</td>
                    </tr>
                  `;
                  })
                  .join("")}
              </tbody>
            </table>
            
            <!-- Totals -->
            <div class="print-totals">
              <div class="print-totals-content">
                ${(() => {
                  const totalHT = order.order_total_ht || 0;
                  const totalTVA =
                    order.order_total_ttc - order.order_total_ht || 0;
                  const deliveryFees = parseFloat(
                    partner?.settings[0]?.deliveryTypeAmount || "0",
                  );
                  const finalTotalTTC = totalHT + totalTVA + deliveryFees;

                  return `
                    <div class="print-total-row">
                      <span>Total HT</span>
                      <span>${totalHT.toFixed(2)} TND</span>
                    </div>
                    <div class="print-total-row">
                      <span>Total TVA</span>
                      <span>${totalTVA.toFixed(2)} TND</span>
                    </div>
                    <div class="print-total-row">
                      <span>Frais de livraison</span>
                      <span>${deliveryFees.toFixed(2)} TND</span>
                    </div>
                    <div class="print-total-row" style="font-weight:bold; border-top:1px solid #e5e7eb; padding-top:8px; font-size:14px; color:#0e7490;">
                      <span>Total TTC</span>
                      <span>${finalTotalTTC.toFixed(2)} TND</span>
                    </div>
                  `;
                })()}
              </div>
            </div>
            
            <!-- Signature -->
            <div class="print-signature">
              <p style="margin:0 0 4px 0;">Signature :</p>
              <div class="print-signature-line"></div>
            </div>
          </div>
          <script>
            // Improved print and close handling
            document.addEventListener('DOMContentLoaded', function() {
              // Focus the window to bring it to front
              window.focus();
              
              // Print after a short delay to ensure everything is loaded
              setTimeout(function() {
                window.print();
                
                // Close window after printing
                window.addEventListener('afterprint', function() {
                  window.close();
                });
                
                // Fallback for browsers that don't support afterprint
                setTimeout(function() {
                  window.close();
                }, 1000);
              }, 300);
            });
          </script>
        </body>
        </html>
      `);

      // Ensure document is properly closed
      printWindow.document.close();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative my-8 w-full max-w-6xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800">
                Bon de commande
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div
              ref={printRef}
              className="max-h-[calc(100vh-200px)] overflow-y-auto p-6"
            >
              {/* Original content starts here */}
              <div className="mb-10 flex items-center justify-between">
                <h1 className="text-4xl font-bold text-cyan-600">
                  Bon de commande
                </h1>
                {partner?.logo ? (
                  <div className="flex h-16 w-16 items-center justify-center">
                    <img
                      src={partner.logo}
                      alt="Logo partenaire"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.add("bg-yellow-400", "rounded-full");
                          parent.innerHTML =
                            '<span class="font-bold text-white text-lg">Logo</span>';
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-lg font-bold text-white">
                    Logo
                  </div>
                )}
              </div>
              <hr className="mb-6 border-cyan-500" />

              {/* Company & Recipient */}
              <div className="mb-8 grid grid-cols-1 gap-8 text-sm text-gray-800 md:grid-cols-2">
                <div>
                  <h2 className="font-semibold">Mon Entreprise</h2>
                  <h2 className="font-semibold">{partner?.companyName}</h2>
                  <p>
                    {partner?.address}
                    <br />
                    {partner?.coverageArea}, Tunisie
                    <br />
                    <i>Téléphone : {partner?.telephone}</i>
                  </p>
                </div>
                <div>
                  <h2 className="font-semibold">Destinataire</h2>
                  <p>
                    {order.order?.customer?.firstName}{" "}
                    {order.order?.customer?.lastName}
                    <br />
                    {order.order?.customer?.address}
                    <br />
                    Tunisie
                  </p>
                </div>
              </div>

              {/* Order Metadata */}
              <div className="mb-6 grid grid-cols-1 gap-6 rounded-lg bg-gray-50 p-6 text-sm md:grid-cols-2">
                <div>
                  <p>
                    <strong>Date commande :</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Bon de commande N° :</strong> {order.orderCode}
                  </p>
                  <p>
                    <strong>Mode de paiement :</strong>{" "}
                    {order.order?.paymentMethod?.name || "Non spécifié"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Émis par :</strong>{" "}
                    {partner?.responsibleName ||
                      partner?.firstName + " " + partner?.lastName ||
                      "Pierre Fournisseur"}
                  </p>
                  <p>
                    <strong>Contact client :</strong>{" "}
                    {order.order?.customer?.firstName}{" "}
                    {order.order?.customer?.lastName}
                  </p>
                  <p>
                    <strong>Téléphone du client :</strong>{" "}
                    {order.order?.customer?.telephone}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mb-6 text-sm text-gray-700">
                <p>
                  <strong>Informations additionnelles</strong>
                </p>
                <p>
                  Merci d&#39;avoir choisi {partner?.companyName} pour nos
                  services.
                </p>
                {partner?.minimumAmount && (
                  <p>
                    Montant minimum de commande : {partner.minimumAmount} TND
                  </p>
                )}
              </div>

              {/* Items Table */}
              <table className="mb-8 w-full border-t border-gray-200 text-sm">
                <thead className="border-b border-gray-300 bg-gray-100">
                  <tr>
                    <th className="px-2 py-2 text-left">Réf. produit</th>
                    <th className="px-2 py-2 text-left">Nom du produit</th>
                    <th className="px-2 py-2 text-right">Quantité</th>
                    <th className="px-2 py-2 text-right">Prix unitaire HT</th>
                    <th className="px-2 py-2 text-right">% TVA</th>
                    <th className="px-2 py-2 text-right">Total HT</th>
                    <th className="px-2 py-2 text-right">Total TTC</th>
                  </tr>
                </thead>
                <tbody>
                  {order.itemsSnapshot?.map((item: any, idx: number) => {
                    const price = item.specialPrice ?? item.unitPrice ?? 0;
                    const quantity = item.qteOrdered || 1;
                    const totalHT = item.total_ht || price * quantity;
                    const tvaPercentage = item.tva || 20;
                    const totalTTC =
                      item.total_ttc || totalHT * (1 + tvaPercentage / 100);

                    return (
                      <tr key={item.id || idx} className="border-b">
                        <td className="px-2 py-1">{item.sku}</td>
                        <td className="px-2 py-1">{item.productName}</td>
                        <td className="px-2 py-1 text-right">{quantity}</td>
                        <td className="px-2 py-1 text-right">
                          {price.toFixed(2)} TND
                        </td>
                        <td className="px-2 py-1 text-right">
                          {tvaPercentage} %
                        </td>
                        <td className="px-2 py-1 text-right">
                          {totalHT.toFixed(2)} TND
                        </td>
                        <td className="px-2 py-1 text-right">
                          {totalTTC.toFixed(2)} TND
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full max-w-md text-sm">
                  {/* Calculate values with proper fallbacks */}
                  {(() => {
                    const totalHT = order.order_total_ht || 0;
                    const totalTVA =
                      order.order_total_ttc - order.order_total_ht || 0;
                    const deliveryFees = parseFloat(
                      partner?.settings[0]?.deliveryTypeAmount || "0",
                    );
                    const finalTotalTTC = totalHT + totalTVA + deliveryFees;

                    return (
                      <>
                        <div className="mb-1 flex justify-between">
                          <span>Total HT</span>
                          <span>{totalHT.toFixed(2)} TND</span>
                        </div>
                        <div className="mb-1 flex justify-between">
                          <span>Total TVA</span>
                          <span>{totalTVA.toFixed(2)} TND</span>
                        </div>
                        <div className="mb-1 flex justify-between">
                          <span>Frais de livraison</span>
                          <span>{deliveryFees.toFixed(2)} TND</span>
                        </div>
                        <div className="mt-2 flex justify-between border-t pt-2 text-lg font-bold text-cyan-700">
                          <span>Total TTC</span>
                          <span>{finalTotalTTC.toFixed(2)} TND</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Signature */}
              <div className="mt-10">
                <p className="text-sm">Signature :</p>
                <div className="mt-2 h-12 w-64 border-b border-gray-300" />
              </div>
            </div>

            {/* Footer - Sticky Bottom */}
            <div className="sticky bottom-0 flex justify-end gap-3 rounded-b-2xl bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-gray-200 px-6 py-2 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Print
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderPrintModal;
