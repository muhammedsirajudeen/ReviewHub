import { ComponentType, ReactElement } from "react";
import { useAppSelector } from "../store/hooks";
import { Navigate } from "react-router";
import userProps from "../types/userProps";

export default function AuthPrivateRoute({Component}:{Component:ComponentType}):ReactElement{
    const user=useAppSelector((state)=>state.global.user) as userProps
    console.log(user)
    if(Object.keys(user).length!=0){
        if(user.authorization==="admin"){
            return <Navigate to="/admin/dashboard"/>
        }else{
            return <Navigate to="/user/dashboard"/>

        }
    }else{
        return <Component/>
    }
}