import axios from 'axios';

// Detecta automaticamente se está no ambiente local (porta 5678 do Spring Boot) ou no Render
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5678/api'
  : 'https://produtos-api-lagc.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;