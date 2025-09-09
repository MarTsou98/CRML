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
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch contractor data
  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/contractors/${id}`);
        setContractor(res.data);
      setForm({
  EnterpriseName: res.data.EnterpriseName || '',
  VAT: res.data.VAT || '',
  Address: res.data.Address || '',
  email: res.data.email || '',
  phone: res.data.phone || '',
  ContractorNotes: res.data.ContractorNotes || ''
});

      } catch (err) {
        console.error(err);
        setError('Failed to load contractor details');
      } finally {
        setLoading(false);
      }
    };

    fetchContractor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(`${BASE_URL}/api/contractors/${id}`, form);
      setContractor(res.data);
      setIsEditing(false);
      setMessage('✅ Contractor updated successfully.');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update contractor.');
    }
  };

  if (loading) return <p>Φόρτωση λεπτομερειών εργολάβου...</p>;
  if (error) return <p>{error}</p>;
  if (!contractor) return <p>Δεν βρέθηκαν εργολάβοι.</p>;

  return (
    <div className="customer-details-wrapper">
      <div className="customer-details-content">
        <button onClick={() => navigate(-1)} className="add-order-button">Πίσω</button>
        <h2 className="customer-details-heading">Λεπτομέρειες Εργολάβου</h2>

        <div className="customer-details-section">
          <p>
            <strong>Επωνυμία:</strong>{' '}
            {isEditing ? (
              <input
                type="text"
                name="EnterpriseName"
                value={form.EnterpriseName}
                onChange={handleChange}
              />
            ) : (
              contractor.EnterpriseName
            )}
          </p>

          <p>
            <strong>ΑΦΜ:</strong>{' '}
            {isEditing ? (
              <input type="text" name="VAT" value={form.VAT} onChange={handleChange} />
            ) : (
              contractor.VAT || 'N/A'
            )}
          </p>
<p>
  <strong>Διεύθυνση:</strong>{' '}
  {isEditing ? (
    <input type="text" name="Address" value={form.Address} onChange={handleChange} />
  ) : (
    contractor.Address || 'N/A'
  )}
</p>

          <p>
            <strong>Email:</strong>{' '}
            {isEditing ? (
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            ) : (
              contractor.email || 'N/A'
            )}
          </p>

          <p>
            <strong>Τηλέφωνο:</strong>{' '}
            {isEditing ? (
              <input type="text" name="phone" value={form.phone} onChange={handleChange} />
            ) : (
              contractor.phone || 'N/A'
            )}
          </p>

          <p>
            <strong>Σημειώσεις:</strong>{' '}
            {isEditing ? (
              <textarea
                name="ContractorNotes"
                value={form.ContractorNotes}
                onChange={handleChange}
              />
            ) : (
              contractor.ContractorNotes || 'N/A'
            )}
          </p>

          {/* Edit / Save / Cancel Buttons */}
          <div className="button-row" style={{ marginTop: '10px' }}>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)}>✏️ Επεξεργασία</button>
            ) : (
              <>
                <button onClick={handleSave}>💾 Αποθήκευση</button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setForm({
                      EnterpriseName: contractor.EnterpriseName || '',
                      VAT: contractor.VAT || '',
                      email: contractor.email || '',
                      phone: contractor.phone || '',
                      ContractorNotes: contractor.ContractorNotes || ''
                    });
                    setMessage(null);
                  }}
                >
                  Ακύρωση
                </button>
              </>
            )}
          </div>

          {/* Message */}
          {message && (
            <p style={{ marginTop: '10px', color: message.startsWith('❌') ? 'red' : 'green' }}>
              {message}
            </p>
          )}
        </div>

        {/* Add Order button disabled while editing */}
        <button
          className="add-order-button"
          onClick={() => navigate(`/orders/new/contractor/${id}`)}
          disabled={isEditing}
          style={{
            cursor: isEditing ? 'not-allowed' : 'pointer',
            opacity: isEditing ? 0.5 : 1,
            marginTop: '15px'
          }}
        >
          Προσθήκη Παραγγελίας
        </button>

        {/* Orders List */}
        <div className="customer-orders-section" style={{ marginTop: '20px' }}>
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
