const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
export async function fetchOrdersBySalespersonId(salespersonId) {
  const response = await fetch(`${BASE_URL}/api/orders/salesperson/${salespersonId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();  // array of orders
}
