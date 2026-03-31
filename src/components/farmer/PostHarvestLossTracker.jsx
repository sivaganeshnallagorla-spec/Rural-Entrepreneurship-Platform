import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import { QueryStats, AssignmentLate } from '@mui/icons-material';

const PostHarvestLossTracker = () => {
  const [stages, setStages] = useState({
    harvest: '',
    processing: '',
    storage: '',
  });
  const [lossPercentage, setLossPercentage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStages((prev) => ({ ...prev, [name]: value }));
  };

  const calculateLoss = () => {
    const harvest = Number(stages.harvest);
    const processing = Number(stages.processing);
    const storage = Number(stages.storage);
    
    if (harvest <= 0) {
      return;
    }
    
    const processingLoss = ((harvest - processing) / harvest) * 100;
    const storageLoss = ((processing - storage) / processing) * 100;
    
    setLossPercentage({
      processingLoss: processingLoss.toFixed(1),
      storageLoss: storageLoss.toFixed(1),
      totalLoss: (((harvest - storage) / harvest) * 100).toFixed(1)
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AssignmentLate color="error" /> Post-Harvest Loss Tracker
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Identify and reduce wastage across your production stages to increase your net earnings.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="harvest"
                  label="Harvest Quantity (kg)"
                  type="number"
                  value={stages.harvest}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="processing"
                  label="After Processing (kg)"
                  type="number"
                  value={stages.processing}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="storage"
                  label="After Storage / Grading (kg)"
                  type="number"
                  value={stages.storage}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  onClick={calculateLoss}
                  startIcon={<QueryStats />}
                  color="error"
                >
                  Analyze Losses
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          {lossPercentage ? (
            <Card sx={{ height: '100%', border: '1px solid var(--glass-border)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Analysis Results</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 152, 0, 0.05)', borderRadius: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block">Processing Loss</Typography>
                      <Typography variant="h4" color="warning.main" fontWeight="800">{lossPercentage.processingLoss}%</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(244, 67, 54, 0.05)', borderRadius: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block">Storage Loss</Typography>
                      <Typography variant="h4" color="error.main" fontWeight="800">{lossPercentage.storageLoss}%</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: 2 }}>
                      <Typography variant="caption" color="textSecondary" display="block">Net Recovery</Typography>
                      <Typography variant="h4" color="primary.main" fontWeight="800">{(100 - lossPercentage.totalLoss).toFixed(1)}%</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Alert severity={Number(lossPercentage.totalLoss) > 15 ? "warning" : "success"}>
                  {Number(lossPercentage.totalLoss) > 15 
                    ? "Your losses are above industry average. Check your storage conditions in the Skill Center." 
                    : "Excellent recovery rate! Your processing efficiency is within top standards."}
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <Paper sx={{ p: 4, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', border: '1px dashed #bdbdbd' }}>
              <Typography color="textSecondary">
                Enter your batch weights to analyze post-harvest efficiency.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PostHarvestLossTracker;