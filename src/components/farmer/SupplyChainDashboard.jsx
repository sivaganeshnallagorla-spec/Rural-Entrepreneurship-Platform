import React, { useState } from 'react';

const SupplyChainDashboard = () => {
  const [ledger, setLedger] = useState(() => {
    const storedLedger = localStorage.getItem('supplyChainLedger');
    return storedLedger ? JSON.parse(storedLedger) : [];
  });

  const addTransaction = (batchId, details) => {
    const newTransaction = {
      batchId,
      details,
      timestamp: new Date().toISOString(),
    };
    const updatedLedger = [...ledger, newTransaction];
    setLedger(updatedLedger);
    localStorage.setItem('supplyChainLedger', JSON.stringify(updatedLedger));
  };

  return (
    <div>
      <h3>Supply Chain Transparency Dashboard</h3>
      <button
        onClick={() =>
          addTransaction('Batch001', 'Processed at Facility A, Shipped to Warehouse B')
        }
      >
        Add Sample Transaction
      </button>

      <h4>Verified Supply Chain Record</h4>
      <ul>
        {ledger.map((entry, index) => (
          <li key={index}>
            <strong>Batch ID:</strong> {entry.batchId} <br />
            <strong>Details:</strong> {entry.details} <br />
            <strong>Timestamp:</strong> {entry.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplyChainDashboard;