import React, { useState } from 'react';

const ValueAdditionWorkflow = () => {
  const [step, setStep] = useState(1);
  const [workflowData, setWorkflowData] = useState({
    rawCrop: '',
    processingMethod: '',
    processedProduct: '',
    cost: 0,
    benefit: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkflowData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const calculateSummary = () => {
    const { cost, benefit } = workflowData;
    return benefit - cost;
  };

  return (
    <div>
      <h3>Value Addition Workflow</h3>
      {step === 1 && (
        <div>
          <label>
            Raw Crop:
            <input
              type="text"
              name="rawCrop"
              value={workflowData.rawCrop}
              onChange={handleChange}
            />
          </label>
          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label>
            Processing Method:
            <input
              type="text"
              name="processingMethod"
              value={workflowData.processingMethod}
              onChange={handleChange}
            />
          </label>
          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <label>
            Processed Product:
            <input
              type="text"
              name="processedProduct"
              value={workflowData.processedProduct}
              onChange={handleChange}
            />
          </label>
          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {step === 4 && (
        <div>
          <label>
            Cost (INR):
            <input
              type="number"
              name="cost"
              value={workflowData.cost}
              onChange={handleChange}
            />
          </label>
          <label>
            Benefit (INR):
            <input
              type="number"
              name="benefit"
              value={workflowData.benefit}
              onChange={handleChange}
            />
          </label>
          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Finish</button>
        </div>
      )}

      {step === 5 && (
        <div>
          <h4>Cost-Benefit Summary</h4>
          <p>Raw Crop: {workflowData.rawCrop}</p>
          <p>Processing Method: {workflowData.processingMethod}</p>
          <p>Processed Product: {workflowData.processedProduct}</p>
          <p>Cost: INR {workflowData.cost}</p>
          <p>Benefit: INR {workflowData.benefit}</p>
          <p>Net Margin: INR {calculateSummary()}</p>
          <button onClick={() => setStep(1)}>Start Over</button>
        </div>
      )}
    </div>
  );
};

export default ValueAdditionWorkflow;