import React from 'react';

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
    <div>
      <h3>Export Documentation Management</h3>
      <ul>
        {documents.map((doc, index) => (
          <li key={index}>
            <a href={doc.link} target="_blank" rel="noopener noreferrer">
              {doc.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExportDocuments;