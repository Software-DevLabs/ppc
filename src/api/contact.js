import client from './client';

export const contactApi = {
  submit: (data) => client.post('/api/contact', data).then(r => r.data),
  getAll: () => client.get('/api/contact').then(r => r.data),
  unreadCount: () => client.get('/api/contact/unread-count').then(r => r.data),
  setRead: (id, isRead = true) => client.patch(`/api/contact/${id}`, { is_read: isRead }).then(r => r.data),
  remove: (id) => client.delete(`/api/contact/${id}`).then(r => r.data),
};
