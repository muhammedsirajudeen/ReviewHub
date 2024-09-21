import { ReactElement, useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setPage } from "../../store/globalSlice";

export default function Blog():ReactElement{
    const dispatch=useAppDispatch()

    useEffect(()=>{
        dispatch(setPage('blog'))
    },[dispatch])
    return(
        <div className="ml-36">
            <h1 className="text-3xl font-bold mt-4">BLOG</h1>
            
        </div>
    )
}