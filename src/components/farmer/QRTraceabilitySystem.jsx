import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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
    <Box>
      <Typography variant="h5" gutterBottom>
        QR/Batch Traceability System
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Farm Origin"
          name="farmOrigin"
          value={batchDetails.farmOrigin}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Harvest Date"
          type="date"
          name="harvestDate"
          value={batchDetails.harvestDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Processing Steps"
          name="processingSteps"
          value={batchDetails.processingSteps}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          label="Shipping Waypoints"
          name="shippingWaypoints"
          value={batchDetails.shippingWaypoints}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <Button variant="contained" onClick={generateQRCode}>
          Generate QR Code
        </Button>
      </Box>

      {qrData && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Generated QR Code
          </Typography>
          <QRCodeCanvas value={qrData} />
        </Box>
      )}
    </Box>
  );
};

export default QRTraceabilitySystem;