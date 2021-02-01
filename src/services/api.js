import axios from 'axios';

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
console.log(process.env, 'url');
const api = axios.create({
  baseURL,
  // baseURL: 'https://mudomoveisbackend.herokuapp.com/', //produção
  // baseURL: 'http://localhost:3333', //local
  // baseURL: 'https://mundomoveis.herokuapp.com/', //staging
});

export default api;
