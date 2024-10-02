import { ComponentType, ReactElement } from "react";
import { Navigate, useLoaderData, useMatch } from "react-router";
import userProps from "../types/userProps";

export default function UserPrivateRoute({Component}:{Component:ComponentType}):ReactElement{
    const user=useLoaderData() as userProps
    const match=useMatch('/user/courses')
    const roadmapMatch=useMatch('/user/roadmap')
    const resourceMatch=useMatch('/user/resource')
    //hacky code 
    const dashboardMatch=useMatch('/user/dashboard')
    const manageMatch=useMatch('/user/blog/manage')
    if(user){
        if(user.authorization==="admin" && !manageMatch ){
            return <Navigate to="/admin/dashboard"/>
        }
        else if((user.authorization==="reviewer" && !user.reviewerApproval) && (!match || !roadmapMatch || !resourceMatch)){
            return <Navigate to="/reviewer/approval"/>
        }else if(user.authorization==="reviewer" && dashboardMatch){
            return <Navigate to="/reviewer/dashboard"/>

        }
        return <Component/>
    }else{
        return <Navigate to="/"/>
    }
    
}