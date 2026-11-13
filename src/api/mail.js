import client from './client';

export const mailApi = {
  threads: (sync = false) => client.get('/api/mail/threads', { params: sync ? { sync: '1' } : {} }).then(r => r.data),
  thread: (id) => client.get(`/api/mail/threads/${id}`).then(r => r.data),
  send: (data) => client.post('/api/mail/send', data).then(r => r.data),
  markRead: (id) => client.patch(`/api/mail/threads/${id}/read`).then(r => r.data),
  removeThread: (id) => client.delete(`/api/mail/threads/${id}`).then(r => r.data),
  sync: () => client.post('/api/mail/sync').then(r => r.data),
};
