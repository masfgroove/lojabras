import axios from 'axios';

// Detecta automaticamente se está no ambiente local ou em produção no Render
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : 'https://produtos-api-lagc.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;