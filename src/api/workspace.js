import client from './client';

export const workspaceApi = {
  getTasks: () => client.get('/api/workspace/tasks').then(r => r.data),
  createTask: (data) => client.post('/api/workspace/tasks', data).then(r => r.data),
  updateTask: (id, data) => client.put(`/api/workspace/tasks/${id}`, data).then(r => r.data),
  deleteTask: (id) => client.delete(`/api/workspace/tasks/${id}`).then(r => r.data),

  getActivities: () => client.get('/api/workspace/activities').then(r => r.data),
  createActivity: (data) => client.post('/api/workspace/activities', data).then(r => r.data),
};
