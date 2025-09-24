const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function getSalespeople() {
  const response = await fetch(`${BASE_URL}/api/salespeople/all`);
  if (!response.ok) throw new Error("Failed to fetch items");
  return await response.json();
}

export async function fetchOrderById(orderId) {
  const response = await fetch(`${BASE_URL}/api/orders/${orderId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  return response.json();
}
