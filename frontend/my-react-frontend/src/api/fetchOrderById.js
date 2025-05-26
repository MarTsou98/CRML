export async function fetchOrderById(orderId) {
  const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  return response.json();
}