import { Link } from 'react-router-dom';




const PaymentListOfOrder = ({ orderId, payments }) => (
  <div className="details-section">
    <div className="details-column">
      <div className="section-title">Πληρωμές</div>
      <Link to={`/orders/${orderId}/addpayment`}>
        <button className="add-payment-button">Προσθήκη Πληρωμής</button>
      </Link>

      {payments?.length > 0 ? (
        <ul className="payments-list">
          {payments.map((p, index) => (
          <li key={index}>
  Πληρωμή €{p.amount} στις {new Date(p.date).toLocaleDateString()}<br />
   Από τον {p.payer === "Contractor" ? "Εργολάβο" : "Πελάτη"}<br />
   με χρήση {p.method === "Cash" ? "Μετρητών" : "Τράπεζας"}<br />
  <em>Σημείωση:</em> {p.notes}
</li>

          ))}
        </ul>
      ) : (
        <p>Δεν υπάρχουν πληρωμές ακόμα.</p>
      )}
    </div>
  </div>
);

export default PaymentListOfOrder;
