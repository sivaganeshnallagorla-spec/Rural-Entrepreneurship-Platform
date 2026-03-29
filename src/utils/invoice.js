import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates and downloads an invoice PDF for a given order.
 * @param {object} order - The order object.
 * @param {object} user - The user who placed the order.
 */
export const generateInvoice = (order, user) => {
  const doc = new jsPDF();
  
  // Set fonts and sizes
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Rural Entrepreneurship Platform", 105, 20, { align: "center" });

  doc.setFontSize(14);
  doc.text("INVOICE", 105, 30, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  // Bill From & Bill To
  doc.text("From:", 20, 45);
  doc.text("REP Network", 20, 50);
  doc.text("Nashik Industrial Hub", 20, 55);
  doc.text("rep-support@rural.com", 20, 60);

  doc.text("To:", 130, 45);
  doc.text(user.name || "Customer", 130, 50);
  doc.text(user.email || "", 130, 55);
  doc.text(`Invoice #: INV-${order.id.toString().substring(0, 8)}`, 130, 65);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 130, 70);

  // Order Items Table
  const tableData = order.items.map(item => [
    item.name,
    `${item.quantity} ${item.unit || 'units'}`,
    `INR ${item.price}`,
    `INR ${item.price * item.quantity}`
  ]);

  doc.autoTable({
    startY: 85,
    head: [["Item Description", "Quantity", "Price", "Total"]],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [46, 125, 50] } // Material Green 700
  });

  // Totals
  const finalY = doc.previousAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total: INR ${order.total}`, 190, finalY, { align: "right" });

  // Footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.text("Thank you for supporting rural entrepreneurs!", 105, 280, { align: "center" });

  // Save the PDF
  doc.save(`Invoice_${order.id}.pdf`);
};
