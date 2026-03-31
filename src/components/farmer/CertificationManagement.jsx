import React, { useState } from 'react';

const CertificationManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    expiryDate: '',
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCertificate((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewCertificate((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleAddCertificate = () => {
    if (!newCertificate.name || !newCertificate.expiryDate || !newCertificate.file) {
      alert('Please fill in all fields and upload a file.');
      return;
    }

    setCertificates((prev) => [...prev, newCertificate]);
    setNewCertificate({ name: '', expiryDate: '', file: null });
    alert('Certificate added successfully!');
  };

  return (
    <div>
      <h3>Certification Management</h3>
      <div>
        <label>
          Certificate Name:
          <input
            type="text"
            name="name"
            value={newCertificate.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Expiry Date:
          <input
            type="date"
            name="expiryDate"
            value={newCertificate.expiryDate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Upload Certificate:
          <input type="file" onChange={handleFileChange} />
        </label>
        <button onClick={handleAddCertificate}>Add Certificate</button>
      </div>

      <h4>Uploaded Certificates</h4>
      <ul>
        {certificates.map((cert, index) => (
          <li key={index}>
            <strong>{cert.name}</strong> (Expires: {cert.expiryDate})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CertificationManagement;