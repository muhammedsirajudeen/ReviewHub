import { ReactElement, Ref, useEffect } from "react";
import axiosInstance from "../../helper/axiosInstance";

export default function ProgressDialog({
    dialogRef,
    closeHandler,
    courseId
}: {
    dialogRef: Ref<HTMLDialogElement>;
    closeHandler: VoidFunction;
    courseId:string
}): ReactElement {
    useEffect(()=>{
        async function progressFetcher(){
            try{
                const response=(await axiosInstance.get(`/user/progress/${courseId}`)).data
                if(response.message==="success"){
                    console.log(response)
                }
            }catch(error){
                console.log(error)
            }
        }
        progressFetcher()
    },[courseId])
    return (
        <dialog
            ref={dialogRef}
            className="flex flex-col items-center justify-start p-6 rounded-lg shadow-lg"
            style={{ height: "60vh", width: "60vw", border: "none", backgroundColor: "#ffffff" }}
        >
            <button
                onClick={closeHandler}
                className="absolute top-2 right-2 bg-transparent border-0 text-gray-600 text-2xl hover:text-gray-800 transition"
                aria-label="Close"
            >
                &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">{courseId}</h2>

        </dialog>
    );
}
