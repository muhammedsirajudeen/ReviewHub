import { Dispatch, ReactElement, Ref, SetStateAction } from 'react';
import { blogProps } from '../../../types/blogProps';
import { toast } from 'react-toastify';
import axiosInstance from '../../../helper/axiosInstance';
import { produce } from 'immer';

export default function BlogDelete({
  dialogRef,
  closeHandler,
  blog,
  setBlogs,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  blog?: blogProps;
  setBlogs: Dispatch<SetStateAction<blogProps[]>>;
}): ReactElement {
  const deleteHandler = async () => {
    try {
      const response = (await axiosInstance.delete(`/user/blog/${blog?._id}`))
        .data;
      if (response.message === 'success') {
        toast.success('deleted successfully');
        setBlogs(
          produce((draft) => {
            return draft.filter((d) => d._id !== blog?._id);
          })
        );
        closeHandler();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('error deleting');
    }
  };
  return (
    <dialog
      ref={dialogRef}
      className="h-72 w-80 flex flex-col items-center justify-center p-6 rounded-lg shadow-lg bg-white"
    >
      <button
        onClick={closeHandler}
        className="self-end text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <h2 className="font-bold text-lg text-center">Confirm Deletion</h2>
      <p className="text-gray-700 mt-2">Are you sure you want to delete?</p>
      <p className="font-semibold text-md text-center mt-4">{blog?.heading}</p>
      <div className="flex justify-around mt-6 w-full">
        <button
          onClick={closeHandler}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
          onClick={deleteHandler}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Delete
        </button>
      </div>
    </dialog>
  );
}
