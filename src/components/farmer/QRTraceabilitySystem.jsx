import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRTraceabilitySystem = () => {
  const [batchDetails, setBatchDetails] = useState({
    farmOrigin: '',
    harvestDate: '',
    processingSteps: '',
    shippingWaypoints: '',
  });
  const [qrData, setQrData] = useState('');

  const generateQRCode = () => {
    const data = JSON.stringify(batchDetails);
    setQrData(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatchDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h3>QR/Batch Traceability System</h3>
      <div>
        <label>
          Farm Origin:
          <input
            type="text"
            name="farmOrigin"
            value={batchDetails.farmOrigin}
            onChange={handleChange}
          />
        </label>
        <label>
          Harvest Date:
          <input
            type="date"
            name="harvestDate"
            value={batchDetails.harvestDate}
            onChange={handleChange}
          />
        </label>
        <label>
          Processing Steps:
          <textarea
            name="processingSteps"
            value={batchDetails.processingSteps}
            onChange={handleChange}
          />
        </label>
        <label>
          Shipping Waypoints:
          <textarea
            name="shippingWaypoints"
            value={batchDetails.shippingWaypoints}
            onChange={handleChange}
          />
        </label>
        <button onClick={generateQRCode}>Generate QR Code</button>
      </div>

      {qrData && (
        <div>
          <h4>Generated QR Code</h4>
          <QRCodeCanvas value={qrData} />
        </div>
      )}
    </div>
  );
};

export default QRTraceabilitySystem;