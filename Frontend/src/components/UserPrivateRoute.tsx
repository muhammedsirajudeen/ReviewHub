import { ComponentType, ReactElement } from "react";
import { Navigate, useLoaderData } from "react-router";
import userProps from "../types/userProps";

export default function UserPrivateRoute({Component}:{Component:ComponentType}):ReactElement{
    const user=useLoaderData() as userProps
    if(user){
        if(Object.keys(user).length!==0){
            if(user.authorization==="admin"){
                return <Navigate to="/admin/dashboard"/>
            }
            return <Component/>
        }else{
            return <Navigate to="/"/>
        }
    
    }else{
        return <Navigate to="/"/>
    }
}