import client from './client';

export const projectsApi = {
  getAll: (params = {}) => client.get('/api/projects', { params }).then(r => r.data),
  getBySlug: (slug) => client.get(`/api/projects/${slug}`).then(r => r.data),
  create: (data) => client.post('/api/projects', data).then(r => r.data),
  update: (id, data) => client.put(`/api/projects/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/api/projects/${id}`).then(r => r.data),
};
