import React, { useState } from 'react';

const BulkOrder = () => {
  const [orderDetails, setOrderDetails] = useState({
    product: '',
    quantity: '',
    price: '',
    deliveryDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const submitOrder = () => {
    console.log('Bulk Order Submitted:', orderDetails);
    alert('Bulk order submitted successfully!');
  };

  return (
    <div>
      <h3>Bulk/Group Order</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Product Name:
          <input
            type="text"
            name="product"
            value={orderDetails.product}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={orderDetails.quantity}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Price (Negotiable):
          <input
            type="text"
            name="price"
            value={orderDetails.price}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Delivery Date:
          <input
            type="date"
            name="deliveryDate"
            value={orderDetails.deliveryDate}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="button" onClick={submitOrder}>
          Submit Bulk Order
        </button>
      </form>
    </div>
  );
};

export default BulkOrder;