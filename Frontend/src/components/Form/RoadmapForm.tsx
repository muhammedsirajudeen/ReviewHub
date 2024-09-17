import axios from 'axios';
import { ChangeEvent, ReactElement, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import url from '../../helper/backendUrl';
import { roadmapProps } from '../../types/courseProps';
import Toggle from 'react-toggle';

interface Inputs {
  roadmapName: string;
  roadmapDescription: string;
}


//for now keep it static add an option to accept it from the user as well

export default function RoadmapForm({
  closeForm,
  id,
  roadmap,
  method,
}: {
  closeForm: VoidFunction;
  id: string;
  roadmap: roadmapProps | undefined;
  method: string;
}): ReactElement {
  const SpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~1-9]/;
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      roadmapName: roadmap?.roadmapName,
      roadmapDescription: roadmap?.roadmapDescription,
    },
  });
  const [list,setList]=useState<boolean>(false)
  const imageRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files) {
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes

      if (e.target.files[0].size > maxSize) {
        // errorSpan.textContent = 'File size exceeds 2MB.';
        // isValid = false;
        toast('must be less than 2MB');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(e.target.files[0].type)) {
        toast('invalid file type');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (imageRef.current) {
          imageRef.current.src = reader.result as string;
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const imageCloseHandler = () => {
    if (imageRef.current?.src) {
      imageRef.current.src = '/form/add.png';
    }
  };
  // form submission Handler
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData=new FormData()
    formData.append("roadmapName",data.roadmapName)
    formData.append("roadmapDescription",data.roadmapDescription)
    formData.append("courseId",id)
    formData.append("unlistStatus",JSON.stringify(list))
    if (!fileRef.current?.files) {
      toast('please select a file');
      return;
    } else {
      formData.append('file', fileRef.current.files[0]);
    }
    console.log(data, id);
    if (method === 'put') {
      const response = (
        await axios.put(
          `${url}/admin/roadmap/${roadmap?._id}`,
            formData
          ,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('token')}`,
              'Content-Type':'multipart/form-data',
            },
          }
        )
      ).data;
      if (response.message === 'success') {
        toast('roadmap updated successfully');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast(response.message);
      }
      return;
    }
    const response = (
      await axios.post(
        url + '/admin/roadmap',
          formData,
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
            "Content-Type":'multipart/form-data'
          },
        }
      )
    ).data;
    if (response.message === 'success') {
      toast('roadmap added successfully');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast(response.message);
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-start w-3/4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* input forms here */}
      <p className="text-2xl font-light mt-4">ADD ROADMAP</p>
      <p className="text-xs font-light text-start w-full mt-4">Name</p>

      <input
        placeholder="enter the Roadmap Heading"
        className="h-8 w-full border border-black placeholder:text-xs "
        {...register('roadmapName', {
          required: {
            value: true,
            message: 'please enter the Roadmap Name',
          },
          minLength: {
            value: 5,
            message: 'please enter alteast 8 character',
          },
          validate: (roadmapName: string) => {
            if (roadmapName.trim() === '')
              return 'please enter the roadmap Name';
            if (SpecialCharRegex.test(roadmapName))
              return 'please enter valid Character';
            return true;
          },
        })}
      />
      {errors.roadmapName && (
        <span className="text-xs text-red-500">
          {errors.roadmapName.message}
        </span>
      )}
      <p className="text-xs font-light text-start w-full mt-4">Description</p>
      {/* for roadmap Description */}
      <input
        placeholder="enter the Roadmap Description"
        className="h-8 w-full border border-black placeholder:text-xs"
        {...register('roadmapDescription', {
          required: {
            value: true,
            message: 'please enter the roadmap Desription',
          },
          minLength: {
            value: 5,
            message: 'please enter alteast 8 character',
          },
          validate: (roadmapDescription: string) => {
            if (roadmapDescription.trim() === '')
              return 'please enter the roadmap Name';
            if (SpecialCharRegex.test(roadmapDescription))
              return 'please enter valid Character';
            return true;
          },
        })}
      />
      {errors.roadmapDescription && (
        <span className="text-xs text-red-500">
          {errors.roadmapDescription.message}
        </span>
      )}
      <input ref={fileRef} onChange={fileHandler} type="file" className="hidden" />
      <button
        type="button"
        onClick={imageCloseHandler}
        className="flex relative top-8 items-center justify-center font-light bg-red-600 text-white p-2 text-xs rounded-full h-6 w-6 mt-4 mr-24"
      >
        x
      </button>
      <div className="h-32 flex flex-col items-center justify-center w-32 border border-black rounded-lg">
        <img
          onClick={() => fileRef.current?.click()}
          ref={imageRef}
          src={
            roadmap?.roadmapImage
              ? `${url}/roadmap/${roadmap.roadmapImage}`
              : `/form/add.png`
          }
          className="h-full w-full rounded-lg"
        />
      </div>
      <label htmlFor='toggle' className='text-xs font-light'>ListStatus</label>
      <Toggle defaultChecked={roadmap?.unlistStatus} onChange={(e)=>setList(e.target.checked)} />
      {/* for roadmap Category*/}
      <div className="flex items-center justify-start w-full mt-5">
        <button
          type="submit"
          className="bg-blue-500 p-2 text-white  ml-2 h-6 text-xs flex items-center justify-center"
        >
          submit
        </button>
        <button
          onClick={closeForm}
          type="button"
          className="bg-white p-2 text-black border border-black ml-2 h-6 text-xs flex items-center justify-center"
        >
          Cancel
        </button>
      </div>
      <ToastContainer />
    </form>
  );
}
