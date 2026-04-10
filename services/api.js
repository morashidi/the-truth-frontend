import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to true if backend uses cookies
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Debug logging (remove in production)
    console.log("[API Request]", config.method.toUpperCase(), config.url);
    console.log("[API Token]", token ? "Present" : "Missing");
    
    if (token) {
      // Try both common formats - backend might expect one or the other
      config.headers.Authorization = `Bearer ${token}`;
      // Alternative: config.headers.Authorization = token;
    }
    
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log("[API Response]", response.status, response.config.url);
    return response;
  },
  (error) => {
    // Enhanced error logging
    const errorDetails = {
      code: error.code,
      message: error.message,
      isNetworkError: !error.response,
      isCorsError: error.code === "ERR_NETWORK" || error.message?.includes("Network Error"),
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      requestUrl: error.config?.url,
      requestMethod: error.config?.method,
      requestHeaders: error.config?.headers,
    };
    
    console.error("[API Error] Full details:", errorDetails);
    
    if (!error.response) {
      console.error("[API Error] Network/CORS error - no response received from server");
      console.error("[API Error] Check if backend is running on http://localhost:5000");
    }
    
    if (error.response?.status === 401) {
      console.warn("[Auth] Token invalid or expired, redirecting to login");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    // Handle CORS errors
    if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
      console.error("[CORS/Network] Check if backend CORS allows frontend origin");
      console.error("[CORS/Network] Ensure backend has: allowedHeaders: ['Content-Type', 'Authorization']");
    }
    
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const register = async (name, email, password) => {
  console.log("[API Register] Sending request:", { name, email, password: "***" });
  
  // Check if backend is running first
  const isConnected = await testConnection();
  if (!isConnected) {
    const error = new Error("Backend server is not running. Please start the backend server.");
    console.error("[API Register] Backend unreachable");
    throw error;
  }
  
  try {
    const response = await api.post("/auth/register", { name, email, password });
    console.log("[API Register] Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API Register] Failed:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const addPost = async (postData) => {
  const response = await api.post("/posts", postData);
  return response.data;
};

export const getPosts = async (params = {}) => {
  const response = await api.get("/posts", { params });
  return response.data;
};

export const getAdminPosts = async (params = {}) => {
  const response = await api.get("/posts/admin", { params });
  return response.data;
};

export const updatePostStatus = async (id, status) => {
  const response = await api.put(`/posts/${id}`, { status });
  return response.data;
};

// Test backend connection
export const testConnection = async () => {
  try {
    const response = await api.get("/health");
    console.log("[API] Backend connection OK:", response.data);
    return true;
  } catch (error) {
    console.error("[API] Backend connection failed:", error.message);
    return false;
  }
};

export default api;
