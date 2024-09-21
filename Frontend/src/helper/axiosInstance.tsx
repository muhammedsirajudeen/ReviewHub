import axios from "axios";
import url from "./backendUrl";

const axiosInstance=axios.create(
    {
        baseURL:url
    }
)

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