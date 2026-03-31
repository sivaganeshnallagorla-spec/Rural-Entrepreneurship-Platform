import React, { useState } from 'react';

const EquipmentComparisonTool = () => {
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);

  const equipmentOptions = [
    { name: 'Dryer', cost: 800, roi: 12 },
    { name: 'Oil Expeller', cost: 1200, roi: 18 },
    { name: 'Flour Mill', cost: 1500, roi: 24 },
  ];

  const handleSelect = (equipment) => {
    setSelectedEquipment((prev) =>
      prev.find((item) => item.name === equipment.name)
        ? prev.filter((item) => item.name !== equipment.name)
        : [...prev, equipment]
    );
  };

  const calculateComparison = () => {
    if (selectedEquipment.length < 2) {
      alert('Please select at least two pieces of equipment to compare.');
      return;
    }

    const result = selectedEquipment.map((equipment) => ({
      name: equipment.name,
      cost: equipment.cost,
      roi: equipment.roi,
    }));

    setComparisonResult(result);
  };

  return (
    <div>
      <h3>Equipment Cost Comparison Tool</h3>
      <ul>
        {equipmentOptions.map((equipment, index) => (
          <li key={index}>
            <label>
              <input
                type="checkbox"
                onChange={() => handleSelect(equipment)}
                checked={selectedEquipment.some((item) => item.name === equipment.name)}
              />
              {equipment.name} (Cost: ₹{equipment.cost}, ROI: {equipment.roi} months)
            </label>
          </li>
        ))}
      </ul>
      <button onClick={calculateComparison}>Compare</button>

      {comparisonResult && (
        <div>
          <h4>Comparison Result</h4>
          <table border="1">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Cost</th>
                <th>ROI (months)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonResult.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>${item.cost}</td>
                  <td>{item.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EquipmentComparisonTool;