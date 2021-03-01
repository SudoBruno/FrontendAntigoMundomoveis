import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
console.log(Cookies.get('token'));
const api = axios.create({
  baseURL,
  headers: {
    authorization: Cookies.get('token'),
  },
});

export default api;
