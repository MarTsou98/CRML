import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/ContractorDetails.css'; // Import your CSS here

const ContractorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/contractors/${id}`);
        setContractor(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load contractor details');
      } finally {
        setLoading(false);
      }
    };

    fetchContractor();
  }, [id]);

  if (loading) return <p className="customer-loading">Loading contractor details...</p>;
  if (error) return <p className="customer-error">{error}</p>;
  if (!contractor) return <p className="customer-not-found">No contractor found.</p>;

  return (
    <div className="customer-details-wrapper">
      <div className="customer-details-content">
        <button onClick={() => navigate(-1)} className="add-order-button">Back</button>
        <h2 className="customer-details-heading">Λεπτομέρειες Εργολάβου</h2>
        <div className="customer-details-section">
          <p><strong>Όνομα:</strong> {contractor.firstName} {contractor.lastName}</p>
          <p><strong>Role:</strong> {contractor.Role}</p>
          <p><strong>Email:</strong> {contractor.email || 'N/A'}</p>
          <p><strong>Τηλέφωνο:</strong> {contractor.phone || 'N/A'}</p>
          <p><strong>Σημειώσεις:</strong> {contractor.ContractorNotes || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default ContractorDetailsPage;
