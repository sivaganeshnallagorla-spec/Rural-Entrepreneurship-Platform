import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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
    <Box>
      <Typography variant="h5" gutterBottom>
        FSSAI/APEDA Compliance Tracker
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <FormControlLabel
          control={(
            <Checkbox
              checked={complianceStatus.fssai}
              onChange={() => toggleCompliance('fssai')}
            />
          )}
          label="FSSAI Compliance"
        />
        <FormControlLabel
          control={(
            <Checkbox
              checked={complianceStatus.apeda}
              onChange={() => toggleCompliance('apeda')}
            />
          )}
          label="APEDA Compliance"
        />
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          Compliance Status:
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          FSSAI: {complianceStatus.fssai ? 'Completed' : 'Pending'}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          APEDA: {complianceStatus.apeda ? 'Completed' : 'Pending'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ComplianceTracker;