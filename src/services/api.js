import axios from 'axios';
import Cookies from 'js-cookie';
const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const auth = Cookies.get('token');


const api = axios.create({
  baseURL,
  headers: {
    authorization: auth,
  },
});

export default api;
