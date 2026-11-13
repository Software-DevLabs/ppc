import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    // A 401 on public pages is normal (visitor, not logged in) — never
    // bounce visitors to Google sign-in. The dashboard guards itself
    // (DashboardLayout -> navigateToLogin), so only redirect there.
    if (err.response?.status === 401 && window.location.pathname.startsWith('/dashboard')) {
      window.location.href = '/auth/google';
    }
    return Promise.reject(err);
  }
);

export default client;
