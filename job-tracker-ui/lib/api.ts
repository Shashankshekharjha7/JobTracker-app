import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Prevent SSR/localStorage issues
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    // IMPORTANT FIX
    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});