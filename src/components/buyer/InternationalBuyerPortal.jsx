import React, { useState } from 'react';

const InternationalBuyerPortal = () => {
  const [country, setCountry] = useState('');
  const [products, setProducts] = useState([
    { name: 'Organic Rice', exportEligible: true },
    { name: 'Mango Pulp', exportEligible: false },
    { name: 'Spices', exportEligible: true },
  ]);

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  return (
    <div>
      <h3>International Buyer Portal</h3>
      <label>
        Select Country/Region:
        <input
          type="text"
          value={country}
          onChange={handleCountryChange}
          placeholder="Enter country or region"
        />
      </label>
      <div>
        <h4>Available Products</h4>
        <ul>
          {products.map((product, index) => (
            <li key={index}>
              {product.name}{' '}
              {product.exportEligible && <span style={{ color: 'green' }}>Export Eligible</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InternationalBuyerPortal;