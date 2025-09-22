// api.ts
import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // Replace with your API's base URL
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer "+ localStorage.getItem("token"), // Example for authentication
  },
});

export default api;
