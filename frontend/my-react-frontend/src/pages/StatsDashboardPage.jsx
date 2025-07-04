// src/pages/StatsDashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const StatsDashboardPage = () => {
  const links = [
   { to: '/stats/by-company-type', label: 'Orders by Company Type' },
    { to: '/stats/by-salesperson', label: 'Orders by Salesperson' },
    { to: '/stats/by-contractor', label: 'Orders by Contractor' },
   { to: '/stats/summary', label: 'Summary Stats' },
   { to: '/stats/salesperson/685535785a7cfef9258aacab', label: 'Stats for a Salesperson' } ,// Replace "1" with a real ID or test ID
 { to: '/stats/contractor/6867ab201e88455a095d3fb1', label: 'Stats for a Contractor' },
    { to: '/stats/profit-by-salesperson', label: 'Profit by Salesperson' },
    { to: '/stats/profit-by-contractor', label: 'Profit by Contractor' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Stats Dashboard</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {links.map((link, index) => (
          <li key={index} style={{ marginBottom: '1rem' }}>
            <Link to={link.to.replace(':id', '1')} style={{ textDecoration: 'none', color: '#0077cc' }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsDashboardPage;
