import { Dispatch, ReactElement, Ref, SetStateAction, useState } from 'react';
import { chapterProps } from '../../types/courseProps';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import "react-toggle/style.css";
import Toggle from "react-toggle";
import { Link } from 'react-router-dom';
import axiosInstance from '../../helper/axiosInstance';
import { produce } from 'immer';

type Inputs = {
  chapterName: string;
  additionalPrompt: string;
};

export default function ChapterForm({
  dialogRef,
  closeForm,
  chapter,
  method,
  chapterName,
  roadmapId,
  setChapters
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeForm: VoidFunction;
  chapter: chapterProps | undefined;
  method: string;
  chapterName: string | undefined;
  roadmapId: string | undefined;
  setChapters:Dispatch<SetStateAction<chapterProps[]>>
}): ReactElement {
  const SpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~1-9]/;
  const [quiz, setQuiz] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    defaultValues: {
      chapterName: chapter?.chapterName || chapterName,
      additionalPrompt: chapter?.additionalPrompt
    }
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      let response;
      if (method === 'post') {
        response = await axiosInstance.post(`/admin/chapter`, {
          roadmapId,
          chapterName,
          quizStatus: quiz,
          additionalPrompt: data.additionalPrompt,
        });
      } else {
        response = await axiosInstance.put(`/admin/chapter/${chapter?._id}`, {
          chapterName: data.chapterName,
          quizStatus: quiz,
          additionalPrompt: data.additionalPrompt,
        }
        );
      }

      if (response.data.message === "success") {
        toast.success(`${method === 'post' ? 'Created' : 'Edited'} successfully`);
        if(method==='post'){
          setChapters(produce((draft)=>{
            draft.push(response.data.chapter)
          }))
        }else{
          setChapters(produce((draft)=>{
            draft.forEach((draft)=>{
              if(draft._id===chapter?._id){
                Object.assign(draft,response.data.chapter)
              }
            })
          }))
        }
        closeForm()
      } else {
        toast(response.data.message);
      }
    } catch (error) {
      console.log(error)
      toast('An error occurred. Please try again.');
    }
  };

  return (
    <dialog style={{height:"50vh",width:"20vw"}} ref={dialogRef} className="flex flex-col items-center justify-start w-96  p-4 bg-white rounded-lg shadow-md">
      <button className="self-end text-red-500" onClick={closeForm}>
        x
      </button>
      <p className="text-xl font-semibold mt-2">{chapter?.chapterName}</p>
      <form className='flex flex-col w-full' onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='chapterName' className='text-sm font-medium mt-4'>Chapter Name</label>
        <input
          id='chapterName'
          className='border border-gray-300 h-10 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
          placeholder='Enter the chapter name'
          {...register('chapterName', {
            required: { value: true, message: 'Please enter the chapter name' },
            minLength: { value: 5, message: 'Minimum 5 characters required' },
            validate: (tag: string) => {
              if (tag.trim() === '') return 'Please enter a valid chapter name';
              if (SpecialCharRegex.test(tag)) return 'Invalid characters in chapter name';
              return true;
            },
          })}
        />
        {errors.chapterName && (
          <span className="text-xs text-red-500">{errors.chapterName.message}</span>
        )}

        <label htmlFor='additionalPrompt' className='text-sm font-medium mt-4'>Additional Prompt</label>
        <textarea
          id='additionalPrompt'
          className='border border-gray-300 h-24 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
          placeholder='Enter the additional prompt'
          {...register('additionalPrompt', {
            required: { value: true, message: 'Please enter the additional prompt' },
            minLength: { value: 5, message: 'Minimum 5 characters required' },
            validate: (tag: string) => {
              if (tag.trim() === '') return 'Please enter a valid additional prompt';
              if (SpecialCharRegex.test(tag)) return 'Invalid characters in additional prompt';
              return true;
            },
          })}
        />
        {errors.additionalPrompt && (
          <span className="text-xs text-red-500">{errors.additionalPrompt.message}</span>
        )}

        <div className='flex items-center mt-4'>
          <p className='text-sm font-medium'>Quiz</p>
          <Toggle
            className="ml-2"
            defaultChecked={chapter?.quizStatus}
            onChange={(e) => setQuiz(e.target.checked)}
          />
        </div>

        {method === 'put' && (
          <Link to='/admin/resource' state={{ chapterId: chapter?._id, roadmapId, quizStatus: chapter?.quizStatus }} className='p-2 text-sm border border-black mt-4 text-center hover:bg-gray-100 rounded'>
            View Chapter
          </Link>
        )}

        <button className='mt-4 border border-black p-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600' type="submit">
          Submit
        </button>
      </form>
    </dialog>
  );
}
