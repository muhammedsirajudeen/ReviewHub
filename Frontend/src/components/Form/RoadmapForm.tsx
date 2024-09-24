import { ChangeEvent, ReactElement, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import url from '../../helper/backendUrl';
import { roadmapProps } from '../../types/courseProps';
import Toggle from 'react-toggle';
import axiosInstance from '../../helper/axiosInstance';

interface Inputs {
  roadmapName: string;
  roadmapDescription: string;
}

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
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    defaultValues: {
      roadmapName: roadmap?.roadmapName,
      roadmapDescription: roadmap?.roadmapDescription,
    },
  });
  
  const [list, setList] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes

      if (e.target.files[0].size > maxSize) {
        toast('File must be less than 2MB');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(e.target.files[0].type)) {
        toast('Invalid file type');
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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("roadmapName", data.roadmapName);
    formData.append("roadmapDescription", data.roadmapDescription);
    formData.append("courseId", id);
    formData.append("unlistStatus", JSON.stringify(list));

    if (!fileRef.current?.files) {
      toast('Please select a file');
      return;
    } else {
      formData.append('file', fileRef.current.files[0]);
    }

    const response = method === 'put'
      ? await axiosInstance.put(`/admin/roadmap/${roadmap?._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      : await axiosInstance.post(`/admin/roadmap`, formData, {
          headers: {
            "Content-Type": 'multipart/form-data'
          },
        });

    if (response.data.message === 'success') {
      toast(`Roadmap ${method === 'put' ? 'updated' : 'added'} successfully`);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast(response.data.message);
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-start w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-semibold text-center mb-4">Manage Roadmap</h2>

      <label className="text-sm font-light w-full text-left">Name</label>
      <input
        placeholder="Enter the Roadmap Heading"
        className="h-10 w-full border border-gray-300 rounded-md px-2 focus:outline-none focus:ring focus:ring-blue-500"
        {...register('roadmapName', {
          required: 'Please enter the Roadmap Name',
          minLength: {
            value: 5,
            message: 'Please enter at least 5 characters',
          },
          validate: (roadmapName: string) => {
            if (SpecialCharRegex.test(roadmapName)) return 'Please enter valid characters';
            return true;
          },
        })}
      />
      {errors.roadmapName && (
        <span className="text-xs text-red-500">{errors.roadmapName.message}</span>
      )}

      <label className="text-sm font-light w-full text-left mt-4">Description</label>
      <input
        placeholder="Enter the Roadmap Description"
        className="h-10 w-full border border-gray-300 rounded-md px-2 focus:outline-none focus:ring focus:ring-blue-500"
        {...register('roadmapDescription', {
          required: 'Please enter the Roadmap Description',
          minLength: {
            value: 5,
            message: 'Please enter at least 5 characters',
          },
          validate: (roadmapDescription: string) => {
            if (SpecialCharRegex.test(roadmapDescription)) return 'Please enter valid characters';
            return true;
          },
        })}
      />
      {errors.roadmapDescription && (
        <span className="text-xs text-red-500">{errors.roadmapDescription.message}</span>
      )}

      <input ref={fileRef} onChange={fileHandler} type="file" className="hidden" />
      <button
        type="button"
        onClick={imageCloseHandler}
        className="flex relative top-10 left-36 items-center justify-center font-light bg-red-400 text-white p-2 text-xs rounded-lg h-6 w-6 mt-4"
      >
        x
      </button>

      <div className="h-32 flex flex-col items-center justify-center w-full border border-gray-300 rounded-lg overflow-hidden mt-4">
        <img
          onClick={() => fileRef.current?.click()}
          ref={imageRef}
          src={roadmap?.roadmapImage ? `${url}/roadmap/${roadmap.roadmapImage}` : '/form/add.png'}
          className={`${fileRef.current } h-10 w-10`}
          alt="Preview"
        />
      </div>

      <label htmlFor='toggle' className='text-sm font-light mt-4'>List Status</label>
      <Toggle
        defaultChecked={roadmap?.unlistStatus}
        onChange={(e) => setList(e.target.checked)}
        className="mt-2"
      />

      <div className="flex items-center justify-between w-full mt-6">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
        >
          Submit
        </button>
        <button
          onClick={closeForm}
          type="button"
          className="bg-gray-200 text-black px-4 py-2 rounded-md border border-gray-400 shadow hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>

      <ToastContainer />
    </form>
  );
}
