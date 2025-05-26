export async function getSalespeople() {
  const response = await fetch("http://localhost:5000/api/salespeople/all");
  if (!response.ok) throw new Error("Failed to fetch items");
  return await response.json();
}

// src/api/orders.js

export async function fetchOrderById(orderId) {
  const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  return response.json();
}
