import axios from "axios";
import { API_CONFIG } from "../config/apiConfig"; // ✅ Import the API config

const apis = axios.create({
  baseURL: API_CONFIG.BASE_URL, // ✅ Uses Todoist API
  headers: {
    Authorization: `Bearer ${API_CONFIG.TODOIST_API_KEY}`, // ✅ Secure API Key
    "Content-Type": "application/json",
  },
});

export default apis;
