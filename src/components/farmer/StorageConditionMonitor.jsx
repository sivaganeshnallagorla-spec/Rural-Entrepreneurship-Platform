import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

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
    <Box>
      <Typography variant="h5" gutterBottom>
        Storage Condition Monitor
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          type="number"
          label="Temperature (°C)"
          name="temperature"
          value={conditions.temperature}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          type="number"
          label="Humidity (%)"
          name="humidity"
          value={conditions.humidity}
          onChange={handleChange}
        />
        <Button variant="contained" onClick={checkConditions}>
          Check Conditions
        </Button>
      </Box>

      {alerts.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Alerts
          </Typography>
          <List>
            {alerts.map((alert, index) => (
              <ListItem key={index} disablePadding>
                <ListItemText primary={alert} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default StorageConditionMonitor;