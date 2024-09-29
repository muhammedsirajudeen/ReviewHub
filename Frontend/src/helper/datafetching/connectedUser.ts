import { Dispatch, SetStateAction } from "react"
import userProps from "../../types/userProps"
import axiosInstance from "../axiosInstance"

const getConnectedUser=async (setResult:Dispatch<SetStateAction<Array<Pick<userProps,'_id'|'email'|'profileImage'>>>>)=>{
    const response=
    (
        await axiosInstance.get(
            '/user/chat/connected'
        )
    ).data
    if(response.message==="success"){
        console.log(response)
        setResult(response.users ?? [])
    }else{
        setResult([])
    }
}

export default getConnectedUser