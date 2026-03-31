import React, { useState } from 'react';

const ComplianceTracker = () => {
  const [complianceStatus, setComplianceStatus] = useState({
    fssai: false,
    apeda: false,
  });

  const toggleCompliance = (type) => {
    setComplianceStatus((prevStatus) => ({
      ...prevStatus,
      [type]: !prevStatus[type],
    }));
  };

  return (
    <div>
      <h3>FSSAI/APEDA Compliance Tracker</h3>
      <div>
        <label>
          <input
            type="checkbox"
            checked={complianceStatus.fssai}
            onChange={() => toggleCompliance('fssai')}
          />
          FSSAI Compliance
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={complianceStatus.apeda}
            onChange={() => toggleCompliance('apeda')}
          />
          APEDA Compliance
        </label>
      </div>
      <div>
        <h4>Compliance Status:</h4>
        <p>FSSAI: {complianceStatus.fssai ? 'Completed' : 'Pending'}</p>
        <p>APEDA: {complianceStatus.apeda ? 'Completed' : 'Pending'}</p>
      </div>
    </div>
  );
};

export default ComplianceTracker;