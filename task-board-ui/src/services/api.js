import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5209/api', // Use the port your .NET app is running on
});

export default api;