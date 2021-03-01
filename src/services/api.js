import axios from 'axios';
const baseURL = `${process.env.REACT_APP_BASE_URL}`;
// import Cookies from 'js-cookie';

const api = axios.create({
  baseURL,
  // headers: {
  //   authorization: Cookies.get('token'),
  // },
});

export default api;
