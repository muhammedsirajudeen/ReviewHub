import { ChangeEvent, Dispatch, ReactElement, Ref, SetStateAction, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { blogProps } from '../../../types/blogProps';
import { toast } from 'react-toastify';
import axiosInstance from '../../../helper/axiosInstance';
import url from '../../../helper/backendUrl';
import { produce } from 'immer';

interface BlogFormProps {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  blog?: blogProps; // Optional for editing an existing blog
  method?:string
  setBlogs:Dispatch<SetStateAction<blogProps[]>>
}

export default function BlogForm({
  dialogRef,
  closeHandler,
  blog,
  method,
  setBlogs
}: BlogFormProps): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    heading: string;
    article: string;
  }>(
    {
      defaultValues:{
        heading:blog?.heading,
        article:blog?.article
      }
    }
  );

  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onSubmit = async (data: { heading: string; article: string }) => {
    if (fileRef.current?.files?.length === 0  && !method) {
      toast.error('please select a file');
      
      return;
    } else {
      console.log(data);
      const formData = new FormData();
      formData.append('article', data.article);
      formData.append('heading', data.heading);
      if (fileRef.current?.files)
        formData.append('file', fileRef.current.files[0]);
      if(method){
        try{
          const response=(
            await axiosInstance.put(`/user/blog/${blog?._id}`,
              formData,
              {
                headers:{
                  "Content-Type":"multipart/form-data"
                }
              }
            )
          ).data
          if(response.message==="success"){
            toast.success("updated successfully")
            //include image update here
            setBlogs(produce((draft)=>{
              draft.forEach((d)=>{
                if(d._id===blog?._id){
                  Object.assign(d,response.blog)
                }
              })
            }))
            closeHandler()            
            // setTimeout(()=>window.location.reload(),1000)
            return
          }else{
            toast.error(response.message)
            return
          }
  
        }catch(error){
          console.log(error)
          toast.error("error updating")
          return
        }
      }
      const response = (
        await axiosInstance.post('/user/blog', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).data;
      if (response.message === 'success') {
        toast.success('blog posted');
        setBlogs(produce((draft)=>{
          draft.push(response.blog)
        }))
        closeHandler()
      } else {
        toast(response.message);
      }
    }

    // Handle form submission, e.g., make an API call
  };

  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      // Validate file type and size
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        fileRef.current!.value = ''; // Reset file input
      } else if (
        !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      ) {
        toast.error('Only JPEG, PNG, and GIF files are allowed');
        fileRef.current!.value = ''; // Reset file input
      } else {
        toast.success('File accepted');
        const reader = new FileReader();
        reader.onloadend = () => {
          if (imageRef.current) {
            imageRef.current.src = reader.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <dialog
      style={{ height: '60vh', width: '40vw' }}
      ref={dialogRef}
      className="rounded-lg shadow-lg p-6"
    >
      <button
        onClick={closeHandler}
        className="absolute top-2 right-2 text-lg text-gray-600 hover:text-gray-800"
      >
        x
      </button>
      <h2 className="text-2xl font-bold mb-4 text-center">
        {blog ? 'Edit Blog' : 'Create Blog'}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full space-y-4 items-center justify-start"
      >
        <div
          onClick={() => fileRef.current?.click()}
          className="h-64 w-64 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer transition duration-200 hover:bg-gray-100"
        >
          <img
            ref={imageRef}
            className="h-full w-full object-cover rounded-lg"
            src={`${blog?.articleImage ? `${url}/blog/${blog.articleImage}` :  "/form/add.png"}`}
            alt="Add"
          />
          <input
            type="file"
            onChange={fileHandler}
            ref={fileRef}
            className="hidden"
          />
        </div>

        <div>
          <label htmlFor="heading" className="block text-sm font-medium mb-1">
            Heading
          </label>
          <input
            id="heading"
            {...register('heading', {
              required: 'Heading is required',
              minLength: {
                value: 5,
                message: 'Heading must be at least 5 characters long',
              },
              maxLength: {
                value: 100,
                message: 'Heading must be no more than 100 characters long',
              },
              validate: {
                noWhitespace: (value) =>
                  value.trim() !== '' || 'Heading cannot be just whitespace',
                noSpecialChars: (value) =>
                  /^[a-zA-Z0-9\s]*$/.test(value) ||
                  'Heading cannot contain special characters',
              },
            })}
            className={`mt-1 p-2 w-96 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.heading ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.heading && (
            <p className="text-red-500 text-sm mt-1">
              {errors.heading.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="article" className="block text-sm font-medium mb-1">
            Article
          </label>
          <textarea
            id="article"
            {...register('article', {
              required: 'Article content is required',
              minLength: {
                value: 10,
                message: 'Article must be at least 10 characters long',
              },
              validate: (value) => {
                return (
                  value.trim().length > 0 || 'Article cannot be just whitespace'
                );
              },
            })}
            className={`mt-1 w-96 p-2 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.article ? 'border-red-500' : 'border-gray-300'
            }`}
          />

          {errors.article && (
            <p className="text-red-500 text-sm mt-1">
              {errors.article.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          {blog ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>
    </dialog>
  );
}
