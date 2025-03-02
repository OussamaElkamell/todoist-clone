export const API_CONFIG = {
  BASE_URL: "https://api.todoist.com/rest/v2", // ✅ Todoist API Base URL
  COMPLETED_TASKS_URL: "https://api.todoist.com/sync/v9/completed/get_all", // ✅ Completed tasks API
  TODOIST_API_KEY: import.meta.env.VITE_TODOIST_API_KEY, // ✅ Get API key from `.env`
};
