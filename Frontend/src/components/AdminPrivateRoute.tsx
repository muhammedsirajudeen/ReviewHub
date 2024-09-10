import { ComponentType, ReactElement } from "react";
import { useAppSelector } from "../store/hooks";
import { Navigate } from "react-router";

export default function AdminPrivateRoute({Component}:{Component:ComponentType}):ReactElement{
    const user=useAppSelector((state)=>state.global.user)
    if(Object.keys(user).length!==0){
        if(user.authorization==="admin"){
            return <Component/>
        }else{
            return <Navigate to="/user/dashboard"/>
        }
    }else{
        return <Navigate to="/"/>
    }
}