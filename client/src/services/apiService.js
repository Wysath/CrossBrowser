import axios from 'axios';

export const generatePreviews = (url) => {
  return axios.post('http://localhost:5000/api/preview', { url });
};