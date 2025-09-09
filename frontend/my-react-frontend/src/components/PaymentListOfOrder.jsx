import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const PaymentListOfOrder = ({ orderId, payments }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedPayment, setEditedPayment] = useState({});

  const handleEditClick = (payment, index) => {
    setEditingIndex(index);
    setEditedPayment({ ...payment, DateOfPayment: payment.DateOfPayment?.slice(0, 10) });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedPayment({});
  };

  const handleSave = async (paymentId) => {
    try {
      await axios.patch(`${BASE_URL}/api/orders/${orderId}/editpayment/${paymentId}`, editedPayment);
      setEditingIndex(null);
      setEditedPayment({});
      window.location.reload(); // refresh order details after save
    } catch (err) {
      console.error('Failed to update payment:', err);
    }
  };

  return (
    <div className="details-section">
      <div className="details-column">
        <div className="section-title">Πληρωμές</div>

        {/* Add Payment Button */}
        <Link to={`/orders/${orderId}/addpayment`}>
          <button className="add-payment-button">Προσθήκη Πληρωμής</button>
        </Link>

        {payments?.length > 0 ? (
          <ul className="payments-list">
            {payments.map((p, index) => {
              if (editingIndex === index) {
                // Inline edit form
                return (
                  <li key={p._id}>
                    <input
                      type="number"
                      value={editedPayment.amount}
                      onChange={e => setEditedPayment({ ...editedPayment, amount: Number(e.target.value) })}
                    />
                    <input
                      type="date"
                      value={editedPayment.DateOfPayment}
                      onChange={e => setEditedPayment({ ...editedPayment, DateOfPayment: e.target.value })}
                    />
                    <select
                      value={editedPayment.method}
                      onChange={e => setEditedPayment({ ...editedPayment, method: e.target.value })}
                    >
                      <option value="Cash">Μετρητά</option>
                      <option value="Bank">Τράπεζα</option>
                    </select>
                    <select
                      value={editedPayment.payer}
                      onChange={e => setEditedPayment({ ...editedPayment, payer: e.target.value })}
                    >
                      <option value="Customer">Πελάτης</option>
                      <option value="Contractor">Εργολάβος</option>
                    </select>
                    <textarea
                      value={editedPayment.notes}
                      onChange={e => setEditedPayment({ ...editedPayment, notes: e.target.value })}
                    />
                    <button onClick={() => handleSave(p._id)}>Αποθήκευση</button>
                    <button onClick={handleCancel}>Ακύρωση</button>
                  </li>
                );
              }

              const formattedDate = p.DateOfPayment
                ? new Date(p.DateOfPayment).toLocaleDateString('el-GR')
                : '';

              return (
                <li key={p._id}>
                  <div>
                    Πληρωμή €{p.amount} στις {formattedDate}
                    <br />
                    Από τον {p.payer === 'Contractor' ? 'Εργολάβο' : 'Πελάτη'}
                    <br />
                    με χρήση {p.method === 'Cash' ? 'Μετρητών' : 'Τράπεζας'}
                    <br />
                    <em>Σημείωση:</em> {p.notes}
                  </div>
                  <button onClick={() => handleEditClick(p, index)}>Επεξεργασία</button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Δεν υπάρχουν πληρωμές ακόμα.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentListOfOrder;
