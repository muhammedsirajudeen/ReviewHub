import { ComponentType, ReactElement } from "react";
import { Navigate, useLoaderData } from "react-router";
import userProps from "../types/userProps";

export default function AdminPrivateRoute({Component}:{Component:ComponentType}):ReactElement{
    const user=useLoaderData() as userProps
    
    if(Object.keys(user ?? {}).length>0){
        if(user.authorization==="admin"){
            return <Component/>
        }else{
            
            return <Navigate to="/user/dashboard"/>
        }
    }else{
        
        console.log("here")
        return <Navigate to="/"/>
    }
}