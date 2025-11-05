import { format } from 'date-fns'

export const generateInvoice = (order, buyer, farmer) => {
  // Create HTML content for invoice
  const invoiceHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - ${order.id}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Arial', sans-serif;
          padding: 20px;
          background: #f5f5f5;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2e7d32;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2e7d32;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .header p {
          color: #666;
          font-size: 14px;
        }
        .invoice-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 5px;
        }
        .info-section {
          flex: 1;
        }
        .info-section h3 {
          color: #2e7d32;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .info-section p {
          margin: 5px 0;
          font-size: 14px;
          color: #555;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th {
          background: #2e7d32;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        .items-table tr:hover {
          background: #f9f9f9;
        }
        .text-right {
          text-align: right;
        }
        .totals {
          margin-top: 20px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 5px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 16px;
        }
        .total-row.grand-total {
          font-size: 20px;
          font-weight: bold;
          color: #2e7d32;
          border-top: 2px solid #2e7d32;
          padding-top: 15px;
          margin-top: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 14px;
        }
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .invoice-container {
            box-shadow: none;
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <h1>🌾 Rural Entrepreneurship Platform</h1>
          <p>Empowering Farmers, Connecting Markets</p>
        </div>

        <div class="invoice-info">
          <div class="info-section">
            <h3>Invoice Details</h3>
            <p><strong>Invoice ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${format(new Date(order.createdAt || Date.now()), 'dd-MM-yyyy HH:mm')}</p>
            <p><strong>Order Status:</strong> ${order.status.toUpperCase()}</p>
          </div>
          <div class="info-section">
            <h3>Bill To</h3>
            <p><strong>${buyer.name || 'Buyer'}</strong></p>
            <p>${buyer.address?.street || ''}</p>
            <p>${buyer.address?.city || ''}, ${buyer.address?.state || ''}</p>
            <p>${buyer.address?.pin || ''}, ${buyer.address?.country || 'India'}</p>
            <p>Email: ${buyer.email || 'N/A'}</p>
            <p>Phone: ${buyer.phone || 'N/A'}</p>
          </div>
          <div class="info-section">
            <h3>Sold By</h3>
            <p><strong>${farmer.name || order.farmerName || 'Farmer'}</strong></p>
            <p>${farmer.location || 'Rural India'}</p>
            <p>Email: ${farmer.email || 'N/A'}</p>
            <p>Phone: ${farmer.phone || 'N/A'}</p>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map(item => `
              <tr>
                <td>${item.productName}</td>
                <td>${item.quantity} ${item.unit || ''}</td>
                <td class="text-right">₹${item.price.toLocaleString()}</td>
                <td class="text-right">₹${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${(order.subtotal || 0).toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span>Shipping (${order.shipping?.method || 'Standard'}):</span>
            <span>₹${(order.shipping?.cost || 0).toLocaleString()}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total Amount:</span>
            <span>₹${(order.total || 0).toLocaleString()}</span>
          </div>
        </div>

        <div class="totals" style="margin-top: 20px;">
          <div class="total-row">
            <span><strong>Payment Method:</strong></span>
            <span>${(order.payment?.method || 'N/A').toUpperCase()}</span>
          </div>
          <div class="total-row">
            <span><strong>Payment Status:</strong></span>
            <span>${(order.payment?.status || 'pending').toUpperCase()}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for supporting rural entrepreneurship!</p>
          <p style="margin-top: 10px; font-size: 12px;">
            This is a computer-generated invoice. No signature required.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  // Create a blob and download
  const blob = new Blob([invoiceHTML], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `invoice-${order.id}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  // Also open in new window for printing
  const printWindow = window.open('', '_blank')
  printWindow.document.write(invoiceHTML)
  printWindow.document.close()
  
  // Auto-print after a short delay
  setTimeout(() => {
    printWindow.print()
  }, 250)
}
