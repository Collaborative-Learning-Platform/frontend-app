import axios from 'axios'


// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BASEURL,
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json',
//     // Authorization will be set dynamically in interceptor
//   },
// })

// // Helper to get cookie value by name
// function getCookie(name: string): string | null {
//   const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
//   return match ? decodeURIComponent(match[2]) : null
// }

// // Request interceptor to add token dynamically from cookies
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getCookie('auth_token')
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// // Response interceptor for error handling and token refresh (example)
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // Example: handle 401 Unauthorized, refresh token logic placeholder
//     if (error.response && error.response.status === 401) {
//       // Optionally, implement token refresh logic here
//       // Redirect to login or show message
//     }
//     return Promise.reject(error)
//   }
// )

// export default axiosInstance;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  withCredentials: true, // 🔹 automatically send cookies
});

axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      try {
        await axiosInstance.post('/auth/refresh', {}, { withCredentials: true });
        return axiosInstance(error.config); // retry original request
      } catch (err) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);




export default axiosInstance;
