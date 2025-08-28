import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // handle token refresh automatically
      try {
        await axios.post(
          `${import.meta.env.VITE_BASEURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        )

        // retry original request after refreshing
        return axiosInstance(error.config)
      } catch (refreshError) {
        console.error('Refresh failed, redirecting to login')
        // Clear user data and redirect
        localStorage.removeItem('role')
        localStorage.removeItem('user_id')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
