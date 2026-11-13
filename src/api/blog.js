import client from './client';

export const blogApi = {
  getAll: (params = {}) => client.get('/api/blog', { params }).then(r => r.data),
  getBySlug: (slug) => client.get(`/api/blog/${slug}`).then(r => r.data),
  create: (data) => client.post('/api/blog', data).then(r => r.data),
  update: (id, data) => client.put(`/api/blog/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/api/blog/${id}`).then(r => r.data),
};
