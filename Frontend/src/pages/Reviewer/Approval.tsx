import { ChangeEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../../helper/axiosInstance';
import { domainProps } from '../../types/courseProps';
interface ReviewerApprovalFormData {
  name: string;
  experience: string;
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
  const [pdfFile, setPdfFile] = useState<string | ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState('');
  const [requested, setRequested] = useState<boolean>(false);
  const [domain, setDomain] = useState<Array<domainProps>>([]);
  useEffect(() => {
    try {
      async function dataWrapper() {
        const response = (await axiosInstance.get('/reviewer/approval')).data;

        if (response.message === 'success') {
          setRequested(false);
        } else {
          setRequested(true);
        }
      }
      async function domainWrapper() {
        const response = (await axiosInstance.get('/admin/domain')).data;
        if (response.message === 'success') {
          console.log(response);
          setDomain(response.domain);
        }
      }
      domainWrapper();
      dataWrapper();
    } catch (error) {
      console.log(error);
      toast('error occured');
    }
  }, []);
  const onSubmit: SubmitHandler<ReviewerApprovalFormData> = async (data) => {
    console.log(data);
    // Handle form submission (e.g., send data to an API)
    if (!pdfFile) {
      toast('please select a file first');
    } else {
      const formData = new FormData();
      formData.append('experience', data.experience);
      formData.append('domain', data.domain);
      if (data.comments) formData.append('comment', data.comments);
      if (fileRef.current?.files) {
        formData.append('file', fileRef.current?.files[0]);
      }
      const response = (
        await axiosInstance.post('/reviewer/approval', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).data;
      console.log(response);
      if (response.message === 'success') {
        toast('approval requested');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast('please try again');
      }
    }
  };

  const addFileHandler = () => {
    fileRef.current?.click();
  };

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        const isPDF = file.type === 'application/pdf';
        const isUnder2MB = file.size <= 2 * 1024 * 1024; // 2MB in bytes

        if (!isPDF) {
          toast('Please upload a valid PDF file.');
          return;
        }

        if (!isUnder2MB) {
          toast('File size must be less than 2MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          setPdfFile(reader.result);
          setFileName(file.name);
        };
        reader.readAsArrayBuffer(file);
        toast('File is valid.');
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md mt-40">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 ">
        Reviewer Approval Form
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {requested ? (
          <div className="flex flex-col items-center justify-center">
            <p className="font-bold">You have already requested for Approval</p>
            <img src="/reviewer/approval.png" />
          </div>
        ) : (
          <>
            {/* Experience Field */}
            <div className="mb-5">
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
                  max: {
                    value: 50,
                    message: 'Experience cannot exceed 50 years',
                  },
                  valueAsNumber: true,
                })}
                className={`mt-1 block w-full p-3 border rounded-md transition duration-200 ${
                  errors.experience ? 'border-red-500' : 'border-gray-300'
                }`}
                type="number"
                id="experience"
              />
              {errors.experience && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Domain Field */}
            <div className="mb-5">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="domain"
              >
                Domain
              </label>
              <select
                {...register('domain', { required: 'Domain is required' })}
                className={`mt-1 block w-full p-3 border rounded-md transition duration-200 ${
                  errors.domain ? 'border-red-500' : 'border-gray-300'
                }`}
                id="domain"
              >
                {domain.map((domain) => {
                  return (
                    <option key={domain._id} value={domain.domain}>
                      {domain.domain}
                    </option>
                  );
                })}
              </select>
              {errors.domain && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.domain.message}
                </p>
              )}
            </div>

            {/* Comments Field */}
            <div className="mb-5">
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
                className={`mt-1 block w-full p-3 border rounded-md transition duration-200 ${
                  errors.comments ? 'border-red-500' : 'border-gray-300'
                }`}
                id="comments"
              />
              {errors.comments && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.comments.message}
                </p>
              )}
            </div>

            <input
              onChange={fileChangeHandler}
              ref={fileRef}
              type="file"
              className="hidden"
            />
            <button
              type="button"
              onClick={addFileHandler}
              className="flex items-center justify-center w-full mb-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
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
            {fileName && (
              <p className="text-gray-700 text-sm">Uploaded File: {fileName}</p>
            )}

            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </>
        )}
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
