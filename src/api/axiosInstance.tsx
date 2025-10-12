import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh lock state
let isRefreshing = false;
let refreshSubscribers: ((tokenRefreshed: boolean) => void)[] = [];

// Helper to notify queued requests after refresh
function subscribeTokenRefresh(cb: (tokenRefreshed: boolean) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

// --- Request interceptor  ---
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor ---
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 403 (forbidden / expired token), try refresh flow
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await axiosInstance.get("/auth/refresh-token");
          console.log("✅ Token refreshed successfully");
          isRefreshing = false;
          onRefreshed(true);
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh failed");
          isRefreshing = false;
          onRefreshed(false);

          
          alert("Your session has expired. Please log in again.");

          localStorage.removeItem("user_id");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // Queue requests until refresh finishes
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((success) => {
            if (success) {
              resolve(axiosInstance(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
