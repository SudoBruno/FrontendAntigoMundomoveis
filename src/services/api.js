import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://mudomoveisbackend.herokuapp.com/', //produção
  // baseURL: 'http://localhost:3333', //local
  baseURL: 'https://mundomoveis.herokuapp.com/', //staging
});

export default api;
