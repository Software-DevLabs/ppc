import client from './client';

export const authApi = {
  me: () => client.get('/auth/me').then(r => r.data),
  logout: () => client.post('/auth/logout').then(r => r.data),
  loginWithGoogle: () => {
    window.location.href = '/auth/google';
  },
};
