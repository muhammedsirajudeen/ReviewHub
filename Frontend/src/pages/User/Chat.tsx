import { ReactElement, useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setPage } from "../../store/globalSlice";

export default function Chat():ReactElement{
    const dispatch=useAppDispatch()
    useEffect(()=>{
        dispatch(setPage('chat'))
    },[dispatch])
    return(
        <>

            <h1 className="ml-36 w-full text-3xl mt-2" >CHAT</h1>
            <div className="ml-36 flex flex-col items-center justify-start">

            </div>
        </>
    )
}