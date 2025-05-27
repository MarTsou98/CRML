export async function login(username) {
  const res = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return await res.json(); // expected to return { user, token, etc. }
}
