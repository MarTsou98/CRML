const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
export async function fetchCustomersBySalespersonId(salespersonId) {
  const response = await fetch(`${BASE_URL}/api/customers/salesperson/${salespersonId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch customers  by salesperson ID');
  }

  return response.json();  // array of customers
}
