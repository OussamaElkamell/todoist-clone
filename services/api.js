import axios from "axios";
import { API_CONFIG } from "../config/apiConfig"; // ✅ Import the API config

const apis = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    Authorization: `Bearer ${API_CONFIG.TODOIST_API_KEY}`,
  },
});

export default apis;
