import { ReactElement, useRef } from "react";

export default function Course():ReactElement{
    const dialogRef=useRef<HTMLDialogElement>(null)
    // const openForm=()=>{

    // }    
    return(
        <>
        <div className="ml-36 mt-10">
           <div className="flex h-72 w-80 shadow-xl items-center flex-col justify-center">
                <button style={{fontSize:"4vw"}} className="flex items-center justify-center text-4xl font-light rounded-lg">+</button>
                <p className="text-sm mt-10 text-gray-500">Add more Courses...</p>
           </div>
        </div>
        <dialog ref={dialogRef} >

        </dialog>
        </>
    )
}