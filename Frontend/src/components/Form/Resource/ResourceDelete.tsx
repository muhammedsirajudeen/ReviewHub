import { Dispatch, ReactElement, Ref, SetStateAction } from 'react';
import { resourceProps, sectionProps } from '../../../types/courseProps';
import { toast, ToastContainer } from 'react-toastify';
import url from '../../../helper/backendUrl';
import axios from 'axios';

export default function ResourceDelete({
  deleteDialogRef,
  section,
  closeHandler,
  resourceId,
  setActive,
  setActiveResource,
  setResource
}: {
  deleteDialogRef: Ref<HTMLDialogElement>;
  section: sectionProps | undefined;
  closeHandler: VoidFunction;
  setActive: Dispatch<SetStateAction<string>>
  setResource: Dispatch<SetStateAction<resourceProps | undefined>>
  setActiveResource: Dispatch<SetStateAction<sectionProps | undefined>>
  resourceId: string | undefined;
}): ReactElement {
  const handleDelete = async () => {
    const response = (
      await axios.delete(
        `${url}/admin/resource/${resourceId}/${section?._id}`,
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
          },
        }
      )
    ).data;
    if (response.message === 'success') {
      toast.success('deleted successfully');
      setActive('')
      setActiveResource(undefined)
      setResource(response.resource)
      closeHandler()
    } else {
      toast(response.message);
    }
  };
  return (
    <>
      <dialog
        className="w-96 h-96 p-6 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg"
        ref={deleteDialogRef}
      >
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          onClick={closeHandler}
          aria-label="Close dialog"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold">Confirm Deletion</h2>
        <p className="mt-4 text-xs">
          Are you sure you want to delete this section?
        </p>
        <span className="text-lg font-bold mt-2 text-gray-800">
          {section?.sectionName}
        </span>
        <div className="mt-6 flex space-x-4">
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-200"
            onClick={handleDelete}
          >
            <img
              className="h-5 w-5 inline-block mr-1"
              src="/delete.png"
              alt="Delete"
            />
            Delete
          </button>
          <button
            className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
            onClick={closeHandler}
          >
            Cancel
          </button>
        </div>
      </dialog>

      <ToastContainer />
    </>
  );
}
