import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lojabras-backend-of.onrender.com'
});

export default api;