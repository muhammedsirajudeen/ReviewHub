import { ReactElement, Ref } from "react";
import { quizProps } from "../../../types/courseProps";
import axios from "axios";
import url from "../../../helper/backendUrl";
import { toast, ToastContainer } from "react-toastify";

export default function QuizDelete(
    {
        deleteQuizDialogRef,
        closeHandler,
        quiz,
        quizId
    }
    :
    {
        deleteQuizDialogRef:Ref<HTMLDialogElement>,
        closeHandler:VoidFunction,
        quiz:quizProps | undefined,
        quizId:string | undefined
    }
):ReactElement{
    const deleteHandler=async ()=>{
        const response = (
        await axios.delete(`${url}/admin/quiz/${quizId}/${quiz?._id}`, {
            headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
            },
        })
        ).data;
        if (response.message === 'success') {
            toast('deleted successfully');
        setTimeout(() => window.location.reload(), 1000);
        } else {
            toast(response.message);
        }
    }
    return(
        <>
            <dialog ref={deleteQuizDialogRef} className="rounded-lg shadow-lg bg-white p-6 flex flex-col items-center justify-center">
                <button 
                    onClick={closeHandler} 
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-lg font-semibold mb-4">Delete Question</h2>
                <p className="text-sm font-light text-gray-700 mb-2">Are you sure you want to delete this question?</p>
                <span className="text-md font-bold text-gray-900 mb-4">{quiz?.question}</span>
                <div className="flex space-x-4">
                    <button 
                        className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition" 
                        onClick={deleteHandler}
                    >
                        <img className="h-4 w-4 inline-block mr-1" src="/delete.png" alt="Delete icon" />
                        Delete
                    </button>
                    <button 
                        className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-400 transition" 
                        onClick={closeHandler}
                    >
                        Cancel
                    </button>
                </div>
            </dialog>
            <ToastContainer/>
        </>
    )
}