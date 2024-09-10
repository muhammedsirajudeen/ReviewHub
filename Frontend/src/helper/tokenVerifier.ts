import url from "./backendUrl";
import axios from "axios";
import userProps from "../types/userProps";
// import { redirect } from "react-router";
export async function tokenVerifier(): Promise<userProps | null> {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(`${url}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data?.message === "success") {
          //exceptional case this is becoming success so we have to like include the edge case
          return response.data.user as userProps;
        }
      } catch (error) {
        console.error("Token verification failed", error);  
        
      }
    }
    return null;
  }