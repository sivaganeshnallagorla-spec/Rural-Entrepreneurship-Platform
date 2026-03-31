import React from 'react';

const TradeFairListings = () => {
  const tradeFairs = [
    {
      name: 'Anuga Food Fair',
      date: 'October 5-9, 2026',
      location: 'Cologne, Germany',
      link: 'https://www.anuga.com/'
    },
    {
      name: 'SIAL Paris',
      date: 'October 19-23, 2026',
      location: 'Paris, France',
      link: 'https://www.sialparis.com/'
    },
    {
      name: 'Agri Asia',
      date: 'September 1-3, 2026',
      location: 'Gandhinagar, India',
      link: 'https://www.agriasia.in/'
    }
  ];

  return (
    <div>
      <h3>Global Trade Fair Listings</h3>
      <ul>
        {tradeFairs.map((fair, index) => (
          <li key={index}>
            <h4>{fair.name}</h4>
            <p>Date: {fair.date}</p>
            <p>Location: {fair.location}</p>
            <a href={fair.link} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradeFairListings;