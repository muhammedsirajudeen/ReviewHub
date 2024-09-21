import { ChangeEvent, ReactElement, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

interface ReviewerApprovalFormData {
  name: string;
  experience: number;
  domain: string;
  comments?: string;
}

export default function Approval(): ReactElement {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<ReviewerApprovalFormData>();
  const fileRef = useRef<HTMLInputElement>(null);

  const [pdfurl,setPdfurl]=useState<string>('')

  const onSubmit: SubmitHandler<ReviewerApprovalFormData> = (data) => {
    console.log(data);
    // Handle form submission (e.g., send data to an API)
  };
  const addFileHandler = () => {
    fileRef.current?.click();
  };
  const fileChangeHandler=(e:ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files){
      if (e.target.files) {
        const file = e.target.files[0];
    
        if (file) {
          const isPDF = file.type === 'application/pdf';
          const isUnder2MB = file.size <= 2 * 1024 * 1024; // 2MB in bytes
    
          if (!isPDF) {
            toast("Please upload a valid PDF file.");
            return;
          }
    
          if (!isUnder2MB) {
            toast("File size must be less than 2MB.");
            return;
          }
    
          // Proceed with file processing
          toast("File is valid:");
        }
      }
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md mt-40">
      <h2 className="text-2xl font-bold mb-4">Reviewer Approval Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="name"
          >
            Name
          </label>
          <input
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters long',
              },
              maxLength: {
                value: 50,
                message: 'Name must be less than 50 characters long',
              },
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Name can only contain letters and spaces',
              },
            })}
            className="mt-1 block w-full p-2 border rounded"
            type="text"
            id="name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Experience Field */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="experience"
          >
            Experience (years)
          </label>
          <input
            {...register('experience', {
              required: 'Experience is required',
              min: { value: 0, message: 'Must be a positive number' },
              max: { value: 50, message: 'Experience cannot exceed 50 years' },
              valueAsNumber: true,
            })}
            className="mt-1 block w-full p-2 border rounded"
            type="number"
            id="experience"
          />
          {errors.experience && (
            <p className="text-red-500 text-xs">{errors.experience.message}</p>
          )}
        </div>

        {/* Domain Field */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="domain"
          >
            Domain
          </label>
          <select
            {...register('domain', { required: 'Domain is required' })}
            className="mt-1 block w-full p-2 border rounded"
            id="domain"
          >
            <option value="">Select a domain</option>
            <option value="frontend">Frontend Development</option>
            <option value="backend">Backend Development</option>
            <option value="fullstack">Fullstack Development</option>
            <option value="design">UI/UX Design</option>
          </select>
          {errors.domain && (
            <p className="text-red-500 text-xs">{errors.domain.message}</p>
          )}
        </div>

        {/* Comments Field */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="comments"
          >
            Comments
          </label>
          <textarea
            {...register('comments', {
              maxLength: {
                value: 200,
                message: 'Comments cannot exceed 200 characters',
              },
            })}
            className="mt-1 block w-full p-2 border rounded"
            id="comments"
          />
          {errors.comments && (
            <p className="text-red-500 text-xs">{errors.comments.message}</p>
          )}
        </div>
        <input onChange={fileChangeHandler}  ref={fileRef} type="file" className="hidden" />
        <button
          type="button"
          onClick={addFileHandler}
          className="flex items-center justify-center m-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add File

        </button>
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
    </div>
  );
}
