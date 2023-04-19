// axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3002/v1/', // Replace this with your API base URL
});


export default instance;