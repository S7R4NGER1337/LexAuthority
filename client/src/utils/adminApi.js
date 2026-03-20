const TIMEOUT_MS = 8000;

function getToken() {
  return localStorage.getItem('admin_token');
}

export async function adminFetch(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(url, { ...options, headers, signal: controller.signal });

    if (res.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
      return;
    }
    if (res.status === 204) return null;

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
