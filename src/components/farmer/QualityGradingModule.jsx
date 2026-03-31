import React, { useState } from 'react';

const QualityGradingModule = () => {
  const [qualityParams, setQualityParams] = useState({
    moisture: '',
    colorGrade: '',
    sizeUniformity: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQualityParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Quality Parameters:', qualityParams);
    alert('Quality parameters logged successfully!');
  };

  return (
    <div>
      <h3>Quality Grading Module</h3>
      <div>
        <label>
          Moisture (%):
          <input
            type="number"
            name="moisture"
            value={qualityParams.moisture}
            onChange={handleChange}
          />
        </label>
        <label>
          Color Grade:
          <input
            type="text"
            name="colorGrade"
            value={qualityParams.colorGrade}
            onChange={handleChange}
          />
        </label>
        <label>
          Size Uniformity:
          <input
            type="text"
            name="sizeUniformity"
            value={qualityParams.sizeUniformity}
            onChange={handleChange}
          />
        </label>
        <button onClick={handleSubmit}>Log Quality Parameters</button>
      </div>
    </div>
  );
};

export default QualityGradingModule;