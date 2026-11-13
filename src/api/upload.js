import client from './client';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await client.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data; // { url, filename }
};
