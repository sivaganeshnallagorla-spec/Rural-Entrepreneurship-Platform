import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Agriculture from '@mui/icons-material/Agriculture'
import Verified from '@mui/icons-material/Verified'
import Inventory from '@mui/icons-material/Inventory'
import LocalShipping from '@mui/icons-material/LocalShipping'
import Place from '@mui/icons-material/Place'
import DateRange from '@mui/icons-material/DateRange'
import QrCode from '@mui/icons-material/QrCode'
import Navbar from '../components/Navbar';
import { getOriginData } from '../utils/qrGenerator';

const ProductOriginPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate fetching tracking data
    const trackingData = getOriginData(id);
    setData(trackingData);
  }, [id]);

  if (!data) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={4} sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }}>
          {/* Header Banner */}
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)'
          }}>
            <QrCode sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              Trace the Journey
            </Typography>
            <Typography variant="subtitle1">
              Verifying the authenticity and origin of your agricultural produce.
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Origin Details */}
              <Grid item xs={12} md={5}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                  <Agriculture sx={{ mr: 1, color: 'primary.main' }} /> Origin Details
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'action.hover', color: 'primary.main' }}><Place /></Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Location</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.location}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'action.hover', color: 'primary.main' }}><DateRange /></Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Harvest Date</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.harvestDate}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'action.hover', color: 'primary.main' }}><Verified /></Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Batch ID</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>{data.batchNumber}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>Certifications</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {data.certifications.map((cert, i) => (
                      <Chip key={i} label={cert} color="secondary" size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Supply Chain Timeline */}
              <Grid item xs={12} md={7}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                  <Inventory sx={{ mr: 1, color: 'secondary.main' }} /> Supply Chain Logs
                </Typography>
                
                <Stepper orientation="vertical" sx={{ mt: 3 }}>
                  {data.logs.map((log, index) => (
                    <Step key={index} active={true}>
                      <StepLabel
                        icon={index === data.logs.length - 1 ? <LocalShipping color="primary" /> : null}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {log.activity} • <Typography component="span" variant="caption" color="text.secondary">{log.date}</Typography>
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          {log.details}
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Verified by Rural Entrepreneurship Platform Supply-Chain Engine.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProductOriginPage;
