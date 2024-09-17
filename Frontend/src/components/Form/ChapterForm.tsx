import { ReactElement, Ref, useState } from 'react';
import { chapterProps } from '../../types/courseProps';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import url from '../../helper/backendUrl';
import { toast } from 'react-toastify';
import "react-toggle/style.css"
import Toggle from "react-toggle"
import { Link } from 'react-router-dom';

type Inputs = {
  chapterName: string;
  additionalPrompt:string
};

export default function ChapterForm({
  dialogRef,
  closeForm,
  chapter,
  method,
  chapterName,
  roadmapId
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeForm: VoidFunction;
  chapter: chapterProps | undefined;
  method:string;
  chapterName:string | undefined;
  roadmapId:string | undefined
}): ReactElement {
  const SpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~1-9]/;
  const [quiz,setQuiz]=useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues:{
        chapterName:chapter?.chapterName || chapterName,
        additionalPrompt:chapter?.additionalPrompt
    }
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(method)
    if(method==='post'){
      const response = (
        await axios.post(
          `${url}/admin/chapter`,
          {
            roadmapId: roadmapId,
            chapterName: chapterName,
            quizStatus: quiz,
            additionalPrompt: data.additionalPrompt,
          },
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('token')}`,
            },
          }
        )
      ).data;
    if(response.message==="success"){
        toast("created successfully")
        setTimeout(()=>window.location.reload(),1000)
    }else{
        toast(response.message)
    } 
    return
    }
    const response=(
        await axios.put(`${url}/admin/chapter/${chapter?._id}`,
            {
                chapterName:data.chapterName,
                quizStatus:quiz,
                additionalPrompt:data.additionalPrompt

            },{
                headers:{
                    Authorization:`Bearer ${window.localStorage.getItem("token")}`
                }
            }
        )
    ).data
    if(response.message==="success"){
        toast("edited successfully")
        setTimeout(()=>window.location.reload(),1000)
    }else{
        toast(response.message)
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="h-96 w-96 flex items-center justify-start flex-col"
    >
      <button
        className="bg-black text-white h-6 p-2 flex items-center justify-center"
        onClick={closeForm}
      >
        x
      </button>
      <p className="text-xl font-light mt-2">{chapter?.chapterName}</p>
      <form className='flex flex-col items-center justify-start' onSubmit={handleSubmit(onSubmit)}>

        <label htmlFor='chapterName' className='text-xs font-light mt-4'>chapterName</label>
        <input
        id='chapterName'
        className='border border-black h-8'
        placeholder='enter the chapter name'
          {...register('chapterName', {
            required: {
              value: true,
              message: 'please enter the chapter',
            },
            minLength: {
              value: 5,
              message: 'please enter the required characters',
            },
            validate: (tag: string) => {
              if (tag.trim() === '') return 'please enter the roadmap Name';
              if (SpecialCharRegex.test(tag))
                return 'please enter valid Character';
              return true;
            },
          })}
        />
        {errors.chapterName && (
          <span className="text-xs text-red-500">
            {errors.chapterName.message}
          </span>
        )}

        <label htmlFor='additionalPrompt' className='text-xs font-light mt-4'>additionalPrompt</label>
        <textarea
        id='additionalPrompt'
        className='border border-black h-16'
        placeholder='enter the additional prompt'
          {...register('additionalPrompt', {
            required: {
              value: true,
              message: 'please enter the additional prompt',
            },
            minLength: {
              value: 5,
              message: 'please enter the required characters',
            },
            validate: (tag: string) => {
              if (tag.trim() === '') return 'please enter the additional prompt ';
              if (SpecialCharRegex.test(tag))
                return 'please enter valid Character';
              return true;
            },
          })}
        />
        {errors.additionalPrompt && (
          <span className="text-xs text-red-500">
            {errors.additionalPrompt.message}
          </span>
        )}
        <p  className='text-xs font-light mt-4'>Quiz</p>
  
        <Toggle
            defaultChecked={chapter?.quizStatus}
            onChange={(e)=>setQuiz(e.target.checked)}
        />
        <p className='text-xs font-light'>Additional Prompt</p>
        {/* here we give a button to view the complete chapter */}
        {
          method==='put' && (
            <Link to='/admin/resource' state={{chapterId:chapter?._id,roadmapId:roadmapId,quizStatus:chapter?.quizStatus}} className='p-1 text-xs border border-black  m-4 '>View Chapter</Link>
          )
        }
        <button className='flex mt-4 items-center justify-center border border-black p-2 text-xs mb-4' type="submit">Submit</button>
      </form>
    </dialog>
  );
}
