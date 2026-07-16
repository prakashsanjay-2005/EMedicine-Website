import axios from "axios";

const api = axios.create({
  baseURL: "https://emedicine-website.onrender.com/api",
});

export default api;