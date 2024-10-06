import { ReactElement, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setPage } from "../../store/globalSlice";
import { useLocation, useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";

export default function VideoChat():ReactElement{
    const dispatch=useAppDispatch()
    const location=useLocation().state
    const localVideoRef=useRef<HTMLVideoElement>(null)
    const navigate=useNavigate()
    const [loading,setLoading]=useState<boolean>(true)
    useEffect(()=>{
        dispatch(setPage('review'))
        async function requestPermission(){
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log(stream)
            if(localVideoRef.current){
                localVideoRef.current.srcObject=stream
                localVideoRef.current.play()
            }
        }
        requestPermission()
    },[dispatch])
    const backHandler=()=>{
        navigate('/user/dashboard')
    }
    return (
      <>
        {
            loading && (
                <div className="h-screen w-screen bg-transparent absolute  flex items-center justify-center">
                    <ClipLoader color="white" size={100}  loading={loading}/>
                    <button onClick={()=>backHandler()} className="absolute top-0 right-0 mr-10" >Leave Room</button>
                </div>
            )
        }
        <h1 className="text-3xl ml-36">VIDEO CHAT</h1>
        <div className="flex items-center w-full justify-center">
          <div className="w-1/2">
            <video ref={localVideoRef} className="w-3/4 h-3/4 rounded-xl "  > </video>
          </div>
        </div>
      </>
    );
}