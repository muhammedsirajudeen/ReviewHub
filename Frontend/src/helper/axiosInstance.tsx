import axios from "axios";
import url from "./backendUrl";

const axiosInstance=axios.create(
    {
        baseURL:url
    }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        const refreshToken = window.localStorage.getItem("refresh_token")
        const response = await axios.post(`${url}/auth/refresh`, { refresh_token: refreshToken });
       
        const { token,refresh_token } = response.data;
        window.localStorage.setItem("token",token)
        window.localStorage.setItem("refresh_token",refresh_token)
        window.localStorage.setItem("hey","hey")
        // Set the new access token in the original request's headers
        originalRequest.headers['Authorization'] = `Bearer ${token}`;

        return axiosInstance(originalRequest); // Retry the original request
      } catch (refreshError) {
        window.localStorage.clear()
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
axiosInstance.interceptors.request.use(
    (config)=>{
      const token=window.localStorage.getItem("token")
      if(token){
        config.headers['Authorization']=`Bearer ${token}`
      }  
      return config
    },
    (error)=>{
        console.log(error)
        return Promise.reject(error)
    }
)

export default axiosInstance