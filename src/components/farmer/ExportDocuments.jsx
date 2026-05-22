import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

const ExportDocuments = () => {
  const documents = [
    {
      name: 'Phytosanitary Certificate Template',
      link: '/templates/phytosanitary_certificate.pdf',
    },
    {
      name: 'APEDA Registration Guidance',
      link: '/templates/apeda_registration.pdf',
    },
    {
      name: 'Import Export Code (IEC) Checklist',
      link: '/templates/iec_checklist.pdf',
    },
    {
      name: 'Certificate of Origin (COO) Format',
      link: '/templates/certificate_of_origin.pdf',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Export Documentation Management
      </Typography>
      <List>
        {documents.map((doc, index) => (
          <ListItem key={index} disablePadding>
            <Button
              variant="outlined"
              href={doc.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mb: 1 }}
            >
              {doc.name}
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ExportDocuments;