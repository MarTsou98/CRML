import React from 'react';
import { Link } from 'react-router-dom';
import './css/StatsDashboardPage.css';

const StatsDashboardPage = () => {
  const links = [
    { to: '/stats/by-company-type', label: 'Παραγγελείες ανά εταιρεία' },
    { to: '/stats/by-salesperson', label: 'Παραγγελείες ανά Πωλητή' },
    { to: '/stats/by-contractor', label: 'Παραγγελείες ανά Εργάλαβο' },
    { to: '/stats/summary', label: 'Συνολικά Στατιστικά' },
    { to: '/stats/salesperson/685535785a7cfef9258aacab', label: 'Στατιστικά για Πωλητή' },
    { to: '/stats/contractor/6867ab201e88455a095d3fb1', label: 'Στατιστικά για Εργάλαβο' },
    { to: '/stats/profit-by-salesperson', label: 'Κέρδη ανά Πωλητή' },
    { to: '/stats/profit-by-contractor', label: 'Κέρδη ανά Εργάλαβο' },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">📊 Stats Dashboard</h1>
      <ul className="dashboard-list">
        {links.map((link, index) => (
          <li key={index} className="dashboard-item">
            <Link to={link.to} className="dashboard-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsDashboardPage;
