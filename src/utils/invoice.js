import { jsPDF } from 'jspdf'

export const generateInvoicePdf = (order) => {
	const doc = new jsPDF()
	const line = (y) => doc.line(10, y, 200, y)

	doc.setFontSize(16)
	doc.text('🌾 Rural Entrepreneurship Platform', 10, 15)
	doc.setFontSize(12)
	doc.text(`Invoice`, 10, 25)
	doc.text(`Order ID: ${order.id}`, 10, 32)
	doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleString()}`, 10, 39)

	line(45)
	doc.setFontSize(12)
	doc.text('Buyer Details', 10, 52)
	doc.setFontSize(10)
	doc.text(`${order.buyerName || 'Buyer'}`, 10, 58)
	if (order.buyerAddress) {
		doc.text(`${order.buyerAddress.street || ''}`, 10, 64)
		doc.text(`${order.buyerAddress.city || ''}, ${order.buyerAddress.state || ''} ${order.buyerAddress.pincode || ''}`, 10, 70)
	}

	doc.setFontSize(12)
	doc.text('Farmer Details', 120, 52)
	doc.setFontSize(10)
	doc.text(`${order.farmerName || 'Farmer'}`, 120, 58)

	line(78)
	doc.setFontSize(12)
	doc.text('Items', 10, 86)
	doc.setFontSize(10)

	let y = 92
	doc.text('Product', 10, y)
	doc.text('Qty', 110, y)
	doc.text('Price', 130, y)
	doc.text('Total', 160, y)
	y += 4
	line(y)
	y += 6

	(order.items || []).forEach((item) => {
		doc.text(`${item.productName}`, 10, y)
		doc.text(`${item.quantity} ${item.unit || ''}`, 110, y)
		doc.text(`₹${(item.price).toFixed(2)}`, 130, y)
		doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 160, y)
		y += 6
	})

	y += 2
	line(y)
	y += 8
	doc.setFontSize(12)
	doc.text(`Subtotal: ₹${(order.subtotal || 0).toFixed(2)}`, 130, y)
	y += 6
	doc.text(`Shipping: ₹${(order.shipping?.cost || 0).toFixed(2)} (${order.shipping?.method || ''})`, 130, y)
	y += 6
	doc.setFontSize(14)
	doc.text(`Total: ₹${(order.total || 0).toFixed(2)}`, 130, y)
	y += 10

	doc.setFontSize(10)
	doc.text('Thank you for supporting rural entrepreneurship!', 10, y)

	doc.save(`invoice-${order.id}.pdf`)
}
