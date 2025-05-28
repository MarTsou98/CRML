export async function fetchCustomersBySalespersonId(salespersonId) {
  const response = await fetch(`http://localhost:5000/api/customers/salesperson/${salespersonId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch customers  by salesperson ID');
  }

  return response.json();  // array of customers
}
