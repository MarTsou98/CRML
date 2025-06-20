

const FinancialDetailsOfOrder = ({ money }) => (
  <div className="details-section">
    <div className="details-column">
      <h3 className="section-title">Οικονομικές Πληροφορίες</h3>
      <div className="detail-box">
        <strong>Τιμή Τιμοκαταλόγου:</strong>
        <p>€{money?.timi_Timokatalogou}</p>
        <strong>Τιμή Πώλησης:</strong>
        <p>€{money?.timi_Polisis}</p>
        <strong>Μετρητά:</strong>
        <p>€{money?.cash}</p>
        <strong>Τράπεζα:</strong>
        <p>€{money?.bank}</p>
        <strong>Κέρδος:</strong>
        <p>€{money?.profit}</p>
        <strong>ΦΠΑ:</strong>
        <p>€{money?.FPA}</p>
      </div>

      <div className="detail-box">
        <strong>Υπόλοιπο Μετρητών Πελάτη:</strong>
        <p>€{money?.customer_remainingShare_Cash}</p>
        <strong>Υπόλοιπο Τράπεζης Πελάτη:</strong>
        <p>€{money?.customer_remainingShare_Bank}</p>
        <strong>Υπόλοιπο Μετρητών Εργολάβου:</strong>
        <p>€{money?.contractor_remainingShare_Cash}</p>
        <strong>Υπόλοιπο Τράπεζης Εργολάβου:</strong>
        <p>€{money?.contractor_remainingShare_Bank}</p>
      </div>
    </div>
  </div>
);

export default FinancialDetailsOfOrder;