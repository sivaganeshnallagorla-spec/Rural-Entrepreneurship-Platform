import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ValueAdditionWorkflow = () => {
  const [step, setStep] = useState(1);
  const [workflowData, setWorkflowData] = useState({
    rawCrop: '',
    processingMethod: '',
    processedProduct: '',
    cost: 0,
    benefit: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkflowData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const calculateSummary = () => {
    const { cost, benefit } = workflowData;
    return benefit - cost;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Value Addition Workflow
      </Typography>

      {step === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Raw Crop"
            name="rawCrop"
            value={workflowData.rawCrop}
            onChange={handleChange}
          />
          <Box>
            <Button variant="contained" onClick={nextStep}>Next</Button>
          </Box>
        </Box>
      )}

      {step === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Processing Method"
            name="processingMethod"
            value={workflowData.processingMethod}
            onChange={handleChange}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={prevStep}>Back</Button>
            <Button variant="contained" onClick={nextStep}>Next</Button>
          </Box>
        </Box>
      )}

      {step === 3 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Processed Product"
            name="processedProduct"
            value={workflowData.processedProduct}
            onChange={handleChange}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={prevStep}>Back</Button>
            <Button variant="contained" onClick={nextStep}>Next</Button>
          </Box>
        </Box>
      )}

      {step === 4 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="Cost (INR)"
            name="cost"
            value={workflowData.cost}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="number"
            label="Benefit (INR)"
            name="benefit"
            value={workflowData.benefit}
            onChange={handleChange}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={prevStep}>Back</Button>
            <Button variant="contained" onClick={nextStep}>Finish</Button>
          </Box>
        </Box>
      )}

      {step === 5 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Cost-Benefit Summary
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Raw Crop: {workflowData.rawCrop}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Processing Method: {workflowData.processingMethod}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Processed Product: {workflowData.processedProduct}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Cost: INR {workflowData.cost}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Benefit: INR {workflowData.benefit}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Net Margin: INR {calculateSummary()}
          </Typography>
          <Button variant="contained" onClick={() => setStep(1)}>Start Over</Button>
        </Box>
      )}
    </Box>
  );
};

export default ValueAdditionWorkflow;