import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust this URL to match your backend server
  withCredentials: true, // This ensures cookies (including session cookies) are sent with every request
});

export default api;