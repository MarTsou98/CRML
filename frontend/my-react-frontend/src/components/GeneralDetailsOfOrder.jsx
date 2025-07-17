

const GeneralDetailsOfOrder = ({ invoiceType, Lock, createdAt, salesperson, customer, contractor,orderNotes, typeOfOrder }) => (
 <div className="details-section">
    <div className="details-column">
      <h3 className="section-title">Γενικές Πληροφορίες</h3>
      <div className="detail-box">
        <strong>Παραστατικό</strong>
<p>{invoiceType === 'timologio' ? 'Τιμολόγιο' : 'Απόδειξη'}</p>
<p><strong>Τύπος Παραγγελίας:</strong> {typeOfOrder}</p>
        <strong>Locked:</strong>
        <p>{Lock ? 'Yes' : 'No'}</p>
        <strong>Ημερομηνία:</strong>
        <p>{new Date(createdAt).toLocaleDateString()}</p>
        <strong>Σημείωση Παραγγελίας:</strong><p>{orderNotes}</p>
      </div>

      <div className="detail-box">
        <strong>Πωλητής:</strong>
        <p>{salesperson?.firstName} {salesperson?.lastName}</p>
      </div>

      <div className="detail-box">
        <strong>Πελάτης:</strong>
        <p>{customer?.firstName} {customer?.lastName}</p> <p>{customer?.email}</p>
        <p>{customer?.phone}</p>
        <p>{customer?.address}</p>
        <p><strong>Σημείωση:</strong> {customer?.CustomerNotes}</p>
      </div>

      <div className="detail-box">
        <strong>Εργολάβος:</strong>
        <p>{contractor?.firstName} {contractor?.lastName}</p>
      </div>
    </div>
  </div>
);
export default GeneralDetailsOfOrder;