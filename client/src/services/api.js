import axios from "axios";

// Using relative path so Vite proxy handles dev server requests, fallback to localhost:3000
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 300000, // 5 minute timeout for thorough repo analysis
});

export const generateReport = async (repoUrl) => {
  try {
    const response = await apiClient.post("/api/report", {
      repo_url: repoUrl,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.error || `Server error (${error.response.status})`);
    } else if (error.request) {
      throw new Error("Unable to connect to CodeScope backend server. Please ensure the backend is running on port 3000.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};

export const checkHealth = async () => {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    console.warn("Backend health check failed:", error.message);
    return { status: "DOWN" };
  }
};
