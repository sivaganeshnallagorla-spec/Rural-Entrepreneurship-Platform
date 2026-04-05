/**
 * Invoice Generator — Indian GST Compliant
 * REP/FY/SERIAL format, CGST+SGST or IGST breakdown,
 * QR code for order tracking, and correct ₹ (U+20B9) rendering.
 *
 * Dynamically imports jspdf to keep the initial bundle lean for 2G rural networks.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the Indian Financial Year string for the given date.
 * FY runs April–March. E.g. April 2025 → "2025-26".
 * @param {Date} date
 * @returns {string}
 */
const getIndianFY = (date = new Date()) => {
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();
  if (month >= 3) {
    // April (3) onwards → FY starts this year
    return `${year}-${String(year + 1).slice(2)}`;
  }
  // Jan–Mar → FY started previous year
  return `${year - 1}-${String(year).slice(2)}`;
};

/**
 * Builds an Indian-format invoice serial number.
 * Format: REP/2025-26/0001
 * @param {string|number} orderId
 * @returns {string}
 */
const buildInvoiceNumber = (orderId) => {
  const fy = getIndianFY();
  // Use last 4 chars of orderId as the running sequence
  const seq = String(orderId).replace(/-/g, '').slice(-4).padStart(4, '0');
  return `REP/${fy}/${seq}`;
};

/**
 * Generates a QR code Data URL by rendering onto an offscreen canvas.
 * Uses qrcode.react's underlying canvas API.
 * @param {string} text — URL or text to encode
 * @param {number} size — canvas side length in px
 * @returns {Promise<string>} — PNG data URL
 */
const generateQRDataUrl = async (text, size = 80) => {
  try {
    // qrcode.react v4 exports QRCodeCanvas which uses <canvas> internally.
    // We create a real DOM canvas, render onto it, and export.
    const { QRCodeCanvas } = await import('qrcode.react');
    const { createRoot } = await import('react-dom/client');
    const { createElement } = await import('react');

    return await new Promise((resolve, reject) => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      const root = createRoot(container);
      root.render(
        createElement(QRCodeCanvas, {
          value: text,
          size,
          bgColor: '#ffffff',
          fgColor: '#000000',
          level: 'M',
        })
      );

      // Allow React to commit to DOM
      setTimeout(() => {
        try {
          const canvas = container.querySelector('canvas');
          const dataUrl = canvas ? canvas.toDataURL('image/png') : null;
          root.unmount();
          document.body.removeChild(container);
          resolve(dataUrl);
        } catch (e) {
          reject(e);
        }
      }, 150);
    });
  } catch {
    // Silently skip QR if rendering fails (offline / old browsers)
    return null;
  }
};

// ---------------------------------------------------------------------------
// GST constants (Schedule I — most raw agricultural produce: 0%)
// ---------------------------------------------------------------------------
const GST_RATE = 0; // 0% for raw agricultural produce under GST Schedule I

/**
 * Calculates GST breakdown.
 * For intra-state: CGST = SGST = rate/2 each.
 * For inter-state: IGST = rate.
 * @param {number} subtotal
 * @param {number} rate — decimal, e.g. 0 or 0.05
 * @param {boolean} isInterState
 */
const calcGST = (subtotal, rate = GST_RATE, isInterState = false) => {
  const gstAmount = subtotal * rate;
  if (isInterState) {
    return { igst: gstAmount, cgst: 0, sgst: 0, total: subtotal + gstAmount };
  }
  return { igst: 0, cgst: gstAmount / 2, sgst: gstAmount / 2, total: subtotal + gstAmount };
};

// ₹ Unicode character — Helvetica in jsPDF supports this natively
const INR = '\u20B9';

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generates and downloads a GST-compliant PDF invoice.
 *
 * @param {object} order  — order object { id, items, total, buyerState? }
 * @param {object} user   — buyer { name, email, state? }
 * @param {object} farmer — seller { name, email?, gstin? } (optional)
 */
export const generateInvoice = async (order, user, farmer = {}) => {
  try {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // ── Page constants ──────────────────────────────────────────────────────
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 14;
    const rightCol = 130;
    const now = new Date();
    const invoiceNo = buildInvoiceNumber(order.id);

    // Detect intra vs inter state (default intra if unknown)
    const isInterState =
      user?.state && farmer?.state
        ? user.state.trim().toLowerCase() !== farmer.state.trim().toLowerCase()
        : false;

    // ── Header ──────────────────────────────────────────────────────────────
    doc.setFillColor(46, 125, 50); // Green 700
    doc.rect(0, 0, pageW, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('KisanMart', margin, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Rural Entrepreneurship Platform', margin, 18);
    doc.text('Connecting Farmers · Empowering India', margin, 23);

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', pageW - margin, 16, { align: 'right' });

    // Reset color
    doc.setTextColor(33, 33, 33);

    // ── Invoice Meta ────────────────────────────────────────────────────────
    let y = 36;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice No:', rightCol, y);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceNo, rightCol + 25, y);

    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', rightCol, y);
    doc.setFont('helvetica', 'normal');
    doc.text(now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), rightCol + 25, y);

    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Order ID:', rightCol, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(order.id).substring(0, 16), rightCol + 25, y);

    // ── Bill From ───────────────────────────────────────────────────────────
    y = 36;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('BILL FROM', margin, y);
    doc.setDrawColor(46, 125, 50);
    doc.line(margin, y + 1, margin + 40, y + 1);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(farmer?.name || 'REP Network', margin, y);
    y += 4;
    doc.text(farmer?.location || 'KL University, Vaddeswaram', margin, y);
    y += 4;
    doc.text('Guntur Dt., Andhra Pradesh', margin, y);
    y += 4;
    if (farmer?.gstin) {
      doc.text(`GSTIN: ${farmer.gstin}`, margin, y);
      y += 4;
    }
    doc.text('support@kisanmart.in', margin, y);
    y += 4;
    doc.text('+91 8185818665', margin, y);

    // ── Bill To ─────────────────────────────────────────────────────────────
    const billToStartY = 36 + 6;
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', rightCol, 36);
    doc.line(rightCol, 37, rightCol + 40, 37);

    doc.setFont('helvetica', 'normal');
    let bY = billToStartY;
    doc.text(user?.name || 'Customer', rightCol, bY);    bY += 4;
    doc.text(user?.email || '', rightCol, bY);            bY += 4;
    if (user?.state) { doc.text(user.state, rightCol, bY); bY += 4; }

    // ── Divider ─────────────────────────────────────────────────────────────
    y = Math.max(y, bY) + 6;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageW - margin, y);
    y += 4;

    // ── Items Table ─────────────────────────────────────────────────────────
    const tableData = order.items.map((item) => [
      item.name || item.productName || '—',
      `${item.quantity} ${item.unit || 'kg'}`,
      `${INR}${Number(item.price).toFixed(2)}`,
      `0%`, // GST rate column
      `${INR}${(item.price * item.quantity).toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: y,
      head: [['Item Description', 'Qty', `Rate (${INR})`, 'GST%', `Amount (${INR})`]],
      body: tableData,
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: [46, 125, 50],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 30, halign: 'right' },
      },
      margin: { left: margin, right: margin },
    });

    // ── GST Breakdown ────────────────────────────────────────────────────────
    const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const gst = calcGST(subtotal, GST_RATE, isInterState);

    let tY = doc.previousAutoTable.finalY + 6;
    const summaryX = pageW - margin - 70;

    const addSummaryRow = (label, value, bold = false) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(9);
      doc.text(label, summaryX, tY);
      doc.text(`${INR}${Number(value).toFixed(2)}`, pageW - margin, tY, { align: 'right' });
      tY += 5;
    };

    addSummaryRow('Subtotal:', subtotal);

    if (isInterState) {
      addSummaryRow(`IGST @ ${(GST_RATE * 100).toFixed(0)}% (Inter-state):`, gst.igst);
    } else {
      addSummaryRow(`CGST @ ${((GST_RATE / 2) * 100).toFixed(1)}% (Intra-state):`, gst.cgst);
      addSummaryRow(`SGST @ ${((GST_RATE / 2) * 100).toFixed(1)}% (Intra-state):`, gst.sgst);
    }

    // Note for 0% GST produce
    if (GST_RATE === 0) {
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'italic');
      doc.text(
        'Exempted under GST Schedule I — raw agricultural produce',
        summaryX,
        tY
      );
      doc.setTextColor(33, 33, 33);
      tY += 4;
    }

    // Total bar
    doc.setFillColor(232, 245, 233);
    doc.rect(summaryX - 4, tY - 1, pageW - margin - summaryX + 4 + 4, 9, 'F');
    tY += 5;
    addSummaryRow('GRAND TOTAL:', gst.total, true);

    // Amount in words note
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `All amounts in Indian Rupees (${INR}). This is a computer-generated invoice.`,
      margin,
      tY - 3
    );
    doc.setTextColor(33, 33, 33);

    tY += 8;

    // ── QR Code (order tracking link) ───────────────────────────────────────
    const trackingUrl = `https://kisanmart.in/track/${order.id}`;
    const qrDataUrl = await generateQRDataUrl(trackingUrl, 100);

    if (qrDataUrl) {
      const qrSize = 28; // mm
      const qrX = margin;
      const qrY = tY;

      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Scan to track your order', qrX + qrSize + 3, qrY + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(46, 125, 50);

      // Break URL into two lines to fit
      doc.text(trackingUrl, qrX + qrSize + 3, qrY + 10);
      doc.setTextColor(33, 33, 33);

      tY = Math.max(tY + qrSize + 4, tY + 16);
    }

    // ── Terms & Footer ───────────────────────────────────────────────────────
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, tY, pageW - margin, tY);
    tY += 5;

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions:', margin, tY);
    tY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const terms = [
      '1. Goods once sold are not returnable unless found defective or not as described.',
      '2. Disputes subject to jurisdiction of Guntur, Andhra Pradesh courts.',
      '3. This invoice is valid for 30 days from date of issue.',
    ];
    terms.forEach((line) => {
      doc.text(line, margin, tY);
      tY += 4;
    });

    // Page footer
    doc.setFillColor(46, 125, 50);
    doc.rect(0, 287, pageW, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(
      'KisanMart — Empowering Rural India  |  support@kisanmart.in  |  +91 8185818665',
      pageW / 2,
      293,
      { align: 'center' }
    );

    // ── Save ─────────────────────────────────────────────────────────────────
    doc.save(`${invoiceNo.replace(/\//g, '-')}.pdf`);
  } catch (error) {
    console.error('Error generating GST invoice:', error);
    alert('Unable to generate invoice. Please try again or check your connection.');
  }
};
