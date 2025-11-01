import axios from "axios";

const API = axios.create({
  baseURL: "https://jobstracker-app.onrender.com",
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
