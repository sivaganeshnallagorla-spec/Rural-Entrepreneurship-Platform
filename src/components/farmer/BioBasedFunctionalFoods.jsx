import React from 'react';

const BioBasedFunctionalFoods = () => {
  const categories = [
    {
      name: 'Natural Dyes',
      description: 'Derived from plants and minerals, used in textiles and food.',
      marketDemand: 'High',
      regulatoryNotes: 'Ensure compliance with food safety standards.',
    },
    {
      name: 'Herbal Extracts',
      description: 'Used in cosmetics, medicines, and supplements.',
      marketDemand: 'Medium',
      regulatoryNotes: 'Check for export restrictions.',
    },
    {
      name: 'Cold-Pressed Oils',
      description: 'High-quality oils for culinary and cosmetic use.',
      marketDemand: 'High',
      regulatoryNotes: 'Label nutritional content accurately.',
    },
    {
      name: 'Nutraceuticals',
      description: 'Food products with health benefits.',
      marketDemand: 'Growing',
      regulatoryNotes: 'Adhere to health claims regulations.',
    },
    {
      name: 'Fortified Foods',
      description: 'Foods enriched with vitamins and minerals.',
      marketDemand: 'High',
      regulatoryNotes: 'Follow fortification guidelines.',
    },
  ];

  return (
    <div>
      <h3>Bio-based & Functional Foods</h3>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <h4>{category.name}</h4>
            <p>{category.description}</p>
            <p>Market Demand: {category.marketDemand}</p>
            <p>Regulatory Notes: {category.regulatoryNotes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BioBasedFunctionalFoods;