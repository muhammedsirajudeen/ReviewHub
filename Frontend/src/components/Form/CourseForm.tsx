import axios from 'axios';
import { ChangeEvent, ReactElement, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import url from '../../helper/backendUrl';
import { courseProps } from '../../types/courseProps';
import Toggle from 'react-toggle';

interface Inputs {
  courseName: string;
  courseDescription: string;
  tagline: string;
}

// Options for select input
const options = [
  { value: 'Mern', label: 'Mern' },
  { value: 'Django', label: 'Django' },
  { value: 'Golang', label: 'Golang' },
];

export default function CourseForm({
  closeForm,
  course,
}: {
  closeForm: VoidFunction;
  course: courseProps | undefined;
}): ReactElement {
  const SpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~1-9]/;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      courseName: course?.courseName,
      courseDescription: course?.courseDescription,
      tagline: course?.tagline,
    },
  });

  const [domain, setDomain] = useState<string>('');
  const [list, setList] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (e.target.files[0].size > maxSize) {
        toast('File size must be less than 2MB');
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
    formData.append('courseName', data.courseName);
    formData.append('courseDescription', data.courseDescription);
    formData.append('domain', domain);
    formData.append('tagline', data.tagline);
    formData.append('unlistStatus', JSON.stringify(list));
    if (course) formData.append('courseId', course._id);
    if (!fileRef.current?.files) {
      toast('Please select a file');
      return;
    } else {
      formData.append('file', fileRef.current.files[0]);
    }
    if (!domain) {
      toast('Please select a domain first');
      return;
    }

    try {
      const response = course
        ? await axios.put(url + '/admin/course', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${window.localStorage.getItem('token')}`,
            },
          })
        : await axios.post(url + '/admin/course', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${window.localStorage.getItem('token')}`,
            },
          });
      
      if (response.data.message === 'success') {
        toast('Course saved successfully');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast(response.data.message);
      }
    } catch (error) {
      console.log(error)
      toast('An error occurred, please try again.');
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-start w-full max-w-md p-6 bg-white shadow-md rounded-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-semibold mb-4">Add Course</h2>

      {/* Course Name */}
      <label className="text-sm font-light w-full mt-4">Name</label>
      <input
        placeholder="Enter the Course Name"
        className="h-10 w-full border border-gray-300 rounded-md p-2 mb-2"
        {...register('courseName', {
          required: 'Please enter the Course Name',
          minLength: { value: 5, message: 'At least 5 characters required' },
          validate: (value) => !SpecialCharRegex.test(value) || 'Invalid characters',
        })}
      />
      {errors.courseName && <span className="text-xs text-red-500">{errors.courseName.message}</span>}

      {/* Course Description */}
      <label className="text-sm font-light w-full mt-4">Description</label>
      <input
        placeholder="Enter the Course Description"
        className="h-10 w-full border border-gray-300 rounded-md p-2 mb-2"
        {...register('courseDescription', {
          required: 'Please enter the Course Description',
          minLength: { value: 5, message: 'At least 5 characters required' },
          validate: (value) => !SpecialCharRegex.test(value) || 'Invalid characters',
        })}
      />
      {errors.courseDescription && <span className="text-xs text-red-500">{errors.courseDescription.message}</span>}

      {/* Tagline */}
      <label className="text-sm font-light w-full mt-4">Tagline</label>
      <input
        placeholder="Enter the Tagline"
        className="h-10 w-full border border-gray-300 rounded-md p-2 mb-2"
        {...register('tagline', {
          required: 'Please enter a Tagline',
          minLength: { value: 5, message: 'At least 5 characters required' },
          validate: (value) => !SpecialCharRegex.test(value) || 'Invalid characters',
        })}
      />
      {errors.tagline && <span className="text-xs text-red-500">{errors.tagline.message}</span>}

      {/* Domain Selection */}
      <label className="text-sm font-light w-full mt-4">Domain</label>
      <Select
        options={options}
        className="w-full mb-2"
        onChange={(value) => setDomain(value?.value ?? '')}
        classNamePrefix="select"
      />

      {/* File Upload */}
      <input
        onChange={fileHandler}
        ref={fileRef}
        type="file"
        className="hidden"
      />
      <div className="flex flex-col items-center mb-4">
        <label className="cursor-pointer">
          <div className="h-32 w-32 border border-gray-300 rounded-lg flex items-center justify-center">
            <img
              ref={imageRef}
              src={course?.courseImage ? `${url}/course/${course.courseImage}` : '/form/add.png'}
              className="h-full w-full rounded-lg cursor-pointer"
              onClick={() => fileRef.current?.click()}
              alt="Course Preview"
            />
          </div>
        </label>
        <button
          type="button"
          onClick={imageCloseHandler}
          className="flex items-center justify-center bg-red-600 text-white p-2 text-xs rounded-full mt-2"
        >
          Remove Image
        </button>
      </div>

      {/* List Status */}
      <label className="flex items-center w-full mt-4">
        <span className="mr-2">List Status</span>
        <Toggle
          defaultChecked={course?.unlistStatus}
          onChange={(e) => setList(e.target.checked)}
        />
      </label>

      {/* Action Buttons */}
      <div className="flex items-center justify-between w-full mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <button
          onClick={closeForm}
          type="button"
          className="bg-gray-200 text-black p-2 rounded-md border border-gray-300 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>

      <ToastContainer />
    </form>
  );
}
