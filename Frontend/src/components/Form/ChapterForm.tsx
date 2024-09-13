import { ReactElement, Ref } from 'react';
import { chapterProps } from '../../types/courseProps';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import url from '../../helper/backendUrl';
import { toast } from 'react-toastify';

type Inputs = {
  chapterName: string;
};

export default function ChapterForm({
  dialogRef,
  closeForm,
  chapter,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeForm: VoidFunction;
  chapter: chapterProps | undefined;
}): ReactElement {
  const SpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~1-9]/;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues:{
        chapterName:chapter?.chapterName
    }
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const response=(
        await axios.put(`${url}/admin/chapter/${chapter?._id}`,
            {
                chapterName:data.chapterName
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
        className='border border-black h-8 mt-4'
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
        <p className='text-xs mt-4' >The rest of the chapter would come here</p>
        <button className='flex mt-4 items-center justify-center border border-black p-2 text-xs' type="submit">Submit</button>
      </form>
    </dialog>
  );
}
