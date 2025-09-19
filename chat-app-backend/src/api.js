import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000", // backend URL
  baseURL: "/", // Use relative path for same origin
});

export default API;
