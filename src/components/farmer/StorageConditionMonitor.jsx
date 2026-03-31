import React, { useState } from 'react';

const StorageConditionMonitor = () => {
  const [conditions, setConditions] = useState({
    temperature: 0,
    humidity: 0,
  });
  const [alerts, setAlerts] = useState([]);

  const thresholds = {
    temperature: { min: 2, max: 10 },
    humidity: { min: 30, max: 70 },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConditions((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const checkConditions = () => {
    const newAlerts = [];
    if (conditions.temperature < thresholds.temperature.min || conditions.temperature > thresholds.temperature.max) {
      newAlerts.push('Temperature is out of range!');
    }
    if (conditions.humidity < thresholds.humidity.min || conditions.humidity > thresholds.humidity.max) {
      newAlerts.push('Humidity is out of range!');
    }
    setAlerts(newAlerts);
  };

  return (
    <div>
      <h3>Storage Condition Monitor</h3>
      <div>
        <label>
          Temperature (°C):
          <input
            type="number"
            name="temperature"
            value={conditions.temperature}
            onChange={handleChange}
          />
        </label>
        <label>
          Humidity (%):
          <input
            type="number"
            name="humidity"
            value={conditions.humidity}
            onChange={handleChange}
          />
        </label>
        <button onClick={checkConditions}>Check Conditions</button>
      </div>

      {alerts.length > 0 && (
        <div>
          <h4>Alerts</h4>
          <ul>
            {alerts.map((alert, index) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StorageConditionMonitor;