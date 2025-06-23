// src/pages/AllContractorsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SmallContractorPreview from '../components/SmallContractorPreview';
import BackButton from '../components/BackButton';
import './css/AllContractors.css'; // create styles similar to AllCustomersPage.css

const AllContractorsPage = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const contractorsPerPage = 5;

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/contractors/all');
        setContractors(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch contractors.');
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  if (loading) return <p>Loading contractors...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const indexOfLast = currentPage * contractorsPerPage;
  const indexOfFirst = indexOfLast - contractorsPerPage;
  const currentContractors = contractors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(contractors.length / contractorsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <BackButton />
        <h2>Όλοι οι Εργολάβοι</h2>

       {currentContractors.length === 0 ? (
  <p>Δεν βρέθηκαν αποτελέσματα</p>
) : (
  currentContractors.map(contractor => (
    <div key={contractor._id} className="contractor-box">
      <SmallContractorPreview contractor={contractor} />
    </div>
  ))
)}


        {contractors.length > contractorsPerPage && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllContractorsPage;
