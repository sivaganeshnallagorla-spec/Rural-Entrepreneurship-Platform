import React from 'react';

const ExportSubsidyInfo = () => {
  const subsidies = [
    {
      name: 'APEDA Export Subsidy',
      description: 'Financial assistance for agri-exporters.',
      link: 'https://apeda.gov.in/apedawebsite/'
    },
    {
      name: 'SFAC Support',
      description: 'Schemes for Farmer Producer Organizations.',
      link: 'https://sfacindia.com/'
    },
    {
      name: 'State-Level Agri-Export Schemes',
      description: 'Various state-specific export promotion schemes.',
      link: 'https://agriexport.gov.in/'
    }
  ];

  return (
    <div>
      <h3>Export Subsidy and Scheme Information</h3>
      <ul>
        {subsidies.map((subsidy, index) => (
          <li key={index}>
            <h4>{subsidy.name}</h4>
            <p>{subsidy.description}</p>
            <a href={subsidy.link} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExportSubsidyInfo;