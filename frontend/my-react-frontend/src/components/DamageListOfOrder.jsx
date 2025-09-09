import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const DamageListOfOrder = ({ orderId, damages }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedDamage, setEditedDamage] = useState({});

  const handleEditClick = (damage, index) => {
    setEditingIndex(index);
    setEditedDamage({
      ...damage,
      DateOfDamages: damage.DateOfDamages ? damage.DateOfDamages.slice(0, 10) : ''
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedDamage({});
  };

  const handleSave = async (damageId) => {
    try {
      await axios.patch(`${BASE_URL}/api/orders/${orderId}/editdamage/${damageId}`, editedDamage);
      setEditingIndex(null);
      setEditedDamage({});
      window.location.reload(); // refresh the order to show updated list
    } catch (err) {
      console.error('Failed to update damage:', err);
    }
  };

  return (
    <div className="details-section">
      <div className="details-column">
        <div className="section-title">Έξοδα / Ζημιές</div>

        {/* Add Damage Button */}
        <Link to={`/orders/${orderId}/adddamage`}>
          <button className="add-damage-button">Προσθήκη Εξόδου</button>
        </Link>

        {damages?.length > 0 ? (
          <ul className="payments-list">
            {damages.map((d, index) => {
              if (editingIndex === index) {
                // Inline edit form
                return (
                  <li key={d._id}>
                    <input
                      type="number"
                      value={editedDamage.amount}
                      onChange={e => setEditedDamage({ ...editedDamage, amount: Number(e.target.value) })}
                    />
                    <input
                      type="date"
                      value={editedDamage.DateOfDamages}
                      onChange={e => setEditedDamage({ ...editedDamage, DateOfDamages: e.target.value })}
                    />
                    <select
                      value={editedDamage.typeOfDamage}
                      onChange={e => setEditedDamage({ ...editedDamage, typeOfDamage: e.target.value })}
                    >
                      <option value="Μεταφορά εξωτερικού">Μεταφορά εξωτερικού</option>
                      <option value="Μεταφορά εσωτερικού">Μεταφορά εσωτερικού</option>
                      <option value="Τοποθέτηση">Τοποθέτηση</option>
                      <option value="Διάφορα">Διάφορα</option>
                    </select>
                    <textarea
                      value={editedDamage.notes}
                      onChange={e => setEditedDamage({ ...editedDamage, notes: e.target.value })}
                    />
                    <button onClick={() => handleSave(d._id)}>Αποθήκευση</button>
                    <button onClick={handleCancel}>Ακύρωση</button>
                  </li>
                );
              }

              const formattedDate = d.DateOfDamages
                ? new Date(d.DateOfDamages).toLocaleDateString('el-GR')
                : '';

              return (
                <li key={d._id}>
                  <div>
                    <strong>Τύπος:</strong> {d.typeOfDamage || 'Δεν καθορίστηκε'}<br />
                    <strong>Ποσό:</strong> €{d.amount} στις {formattedDate}<br />
                    {d.notes && (
                      <>
                        <strong>Σημείωση:</strong> {d.notes}
                      </>
                    )}
                  </div>
                  <button onClick={() => handleEditClick(d, index)}>Επεξεργασία</button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Δεν υπάρχουν ζημιές ακόμα.</p>
        )}
      </div>
    </div>
  );
};

export default DamageListOfOrder;
