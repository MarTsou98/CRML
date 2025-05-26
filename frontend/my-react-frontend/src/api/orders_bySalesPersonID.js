export async function fetchOrdersBySalespersonId(salespersonId) {
  const response = await fetch(`http://localhost:5000/api/orders/salesperson/${salespersonId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();  // array of orders
}
