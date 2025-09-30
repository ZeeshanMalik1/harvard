import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
