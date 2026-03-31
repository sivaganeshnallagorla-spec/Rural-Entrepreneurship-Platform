import React, { useState, useEffect } from 'react';

const MandiPriceFeed = () => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    // Simulated API call to fetch mandi prices
    const fetchPrices = async () => {
      const simulatedPrices = [
        { crop: 'Wheat', price: '$200/ton' },
        { crop: 'Rice', price: '$250/ton' },
        { crop: 'Corn', price: '$180/ton' },
      ];
      setPrices(simulatedPrices);
    };

    fetchPrices();
  }, []);

  return (
    <div>
      <h3>Mandi/Wholesale Price Feed</h3>
      <ul>
        {prices.map((item, index) => (
          <li key={index}>
            <strong>{item.crop}</strong>: {item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MandiPriceFeed;