// DamageListOfOrder.jsx
import { Link } from 'react-router-dom';

const DamageListOfOrder = ({ orderId, damages }) => (
  <div className="details-section">
    <div className="details-column">
      <div className="section-title">Έξοδα / Ζημιές</div>

      <Link to={`/orders/${orderId}/adddamage`}>
        <button className="add-damage-button">Προσθήκη Εξόδων</button>
      </Link>

      {/* Extra spacing below the button */}
      <div style={{ marginTop: '1rem' }}>
        {damages?.length > 0 ? (
          <ul className="payments-list">
            {damages.map((d, index) => (
              <li key={index}>
                <strong>Τύπος:</strong> {d.typeOfDamage || 'Δεν καθορίστηκε'}<br />
                <strong>Ποσό:</strong> €{d.amount} στις {new Date(d.date).toLocaleDateString()}<br />
                {d.notes && (
                  <>
                    <strong>Σημείωση:</strong> {d.notes}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Δεν υπάρχουν ζημιές ακόμα.</p>
        )}
      </div>
    </div>
  </div>
);

export default DamageListOfOrder;
