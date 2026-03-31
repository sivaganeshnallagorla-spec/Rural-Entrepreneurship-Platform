import React, { useState } from 'react';

const LabTestUploads = () => {
  const [labTests, setLabTests] = useState([]);
  const [newLabTest, setNewLabTest] = useState({
    testName: '',
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLabTest((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewLabTest((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleAddLabTest = () => {
    if (!newLabTest.testName || !newLabTest.file) {
      alert('Please fill in all fields and upload a file.');
      return;
    }

    setLabTests((prev) => [...prev, newLabTest]);
    setNewLabTest({ testName: '', file: null });
    alert('Lab test uploaded successfully!');
  };

  return (
    <div>
      <h3>Lab Test Result Uploads</h3>
      <div>
        <label>
          Test Name:
          <input
            type="text"
            name="testName"
            value={newLabTest.testName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Upload Test Report:
          <input type="file" onChange={handleFileChange} />
        </label>
        <button onClick={handleAddLabTest}>Upload Lab Test</button>
      </div>

      <h4>Uploaded Lab Tests</h4>
      <ul>
        {labTests.map((test, index) => (
          <li key={index}>
            <strong>{test.testName}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LabTestUploads;