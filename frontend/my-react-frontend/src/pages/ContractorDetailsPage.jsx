import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SmallOrderPreview from '../components/SmallOrderPreview';
import './css/ContractorDetails.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const ContractorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/contractors/${id}`);
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

  if (loading) return <p>Φόρτωση λεπτομερειών εργολάβου...</p>;
  if (error) return <p>{error}</p>;
  if (!contractor) return <p>Δεν βρέθηκαν εργολάβοι.</p>;

  return (
    <div className="customer-details-wrapper">
      <div className="customer-details-content">
        <button onClick={() => navigate(-1)} className="add-order-button">Πίσω</button>
        <h2 className="customer-details-heading">Λεπτομέρειες Εργολάβου</h2>

        <div className="customer-details-section">
          <p><strong>Επωνυμία:</strong> {contractor.EnterpriseName}</p>
          <p><strong>ΑΦΜ:</strong> {contractor.VAT|| 'N/A'}</p>
          <p><strong>Email:</strong> {contractor.email || 'N/A'}</p>
          <p><strong>Τηλέφωνο:</strong> {contractor.phone || 'N/A'}</p>
          <p><strong>Σημειώσεις:</strong> {contractor.ContractorNotes || 'N/A'}</p>
        </div>

        <button
          className="add-order-button"
          onClick={() => navigate(`/orders/new/contractor/${id}`)}
        >
          Προσθήκη Παραγγελίας
        </button>

        <div className="customer-orders-section">
          <h3>Παραγγελίες</h3>
          {contractor.orders?.length === 0 ? (
            <p className="no-orders-message">Δεν υπάρχουν παραγγελίες.</p>
          ) : (
            contractor.orders?.map(order => (
              <SmallOrderPreview key={order._id} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorDetailsPage;
