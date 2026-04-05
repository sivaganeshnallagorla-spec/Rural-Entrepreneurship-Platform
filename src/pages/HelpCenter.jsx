import React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Navbar from '../components/Navbar'

const FAQS = [
  {
    question: "How do I register as a Farmer?",
    answer: "Visit the Sign Up page, select 'Farmer' as your role, and complete the registration form with your basic details."
  },
  {
    question: "How do I track my orders?",
    answer: "Go to your Dashboard and click on the 'Orders' section to see the real-time status of all your purchases."
  },
  {
    question: "Is the platform secure?",
    answer: "Yes, we use secure storage and industry-standard encryption to protect your data and transactions."
  },
  {
    question: "What is the Drone Operator service?",
    answer: "Drone operators can provide services like crop health monitoring and pesticide spraying. You can book them through the Drone Marketplace."
  }
]

const HelpCenter = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8, flex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" fontWeight="800" gutterBottom color="primary">
            Help Center
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Find answers to common questions or get in touch with our team.
          </Typography>
        </Box>

        <Grid container spacing={6}>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontWeight="700" sx={{ mb: 4 }}>
              Frequently Asked Questions
            </Typography>
            {FAQS.map((faq, index) => (
              <Accordion key={index} sx={{ mb: 2, borderRadius: '12px !important', '&:before': { display: 'none' }, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="600">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="textSecondary">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper className="glass" sx={{ p: 4, borderRadius: 4, border: '1px solid var(--glass-border)' }}>
              <Typography variant="h5" fontWeight="700" gutterBottom>
                Contact Support
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
                Can't find what you're looking for? Message us directly.
              </Typography>

              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Subject" variant="outlined" size="small" />
                <TextField fullWidth label="Message" multiline rows={4} variant="outlined" size="small" />
                <Button variant="contained" size="large" fullWidth>
                  Send Message
                </Button>
              </Box>

              <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Typography variant="body2">2400090093@kluniversity.in</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon color="primary" />
                  <Typography variant="body2">8185818665</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOnIcon color="primary" />
                  <Typography variant="body2">kl university,vadrswerm.guntur dst,andra pradesh</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default HelpCenter
