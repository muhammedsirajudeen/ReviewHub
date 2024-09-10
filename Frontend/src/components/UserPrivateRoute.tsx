import { ComponentType, ReactElement } from "react";
import { useAppSelector } from "../store/hooks";
import { Navigate } from "react-router";

export default function UserPrivateRoute({Component}:{Component:ComponentType}):ReactElement{
    const user=useAppSelector((state)=>state.global.user)
    if(Object.keys(user).length!==0){
        if(user.authorization==="admin"){
            return <Navigate to="/admin/dashboard"/>
        }
        return <Component/>
    }else{
        return <Navigate to="/"/>
    }
}