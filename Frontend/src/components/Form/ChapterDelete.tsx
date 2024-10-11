import { Dispatch, ReactElement, Ref, SetStateAction } from 'react';
import { chapterProps } from '../../types/courseProps';
import { toast } from 'react-toastify';
import axiosInstance from '../../helper/axiosInstance';
import { produce } from 'immer';

export default function ChapterDelete({
  dialogRef,
  closeForm,
  chapter,
  setChapters,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeForm: VoidFunction;
  chapter: chapterProps | undefined;
  setChapters: Dispatch<SetStateAction<chapterProps[]>>;
}): ReactElement {
  const deleteHandler = async () => {
    try {
      const response = (
        await axiosInstance.delete(`/admin/chapter/${chapter?._id}`)
      ).data;

      if (response.message === 'success') {
        toast.success('Deleted successfully');
        setChapters(
          produce((draft) => {
            draft.forEach((d, index) => {
              if (d._id === chapter?._id) {
                draft.splice(index, 1);
              }
            });
          })
        );
        closeForm();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Please try again');
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center"
    >
      <button
        onClick={closeForm}
        className="self-end bg-transparent text-gray-500 hover:text-gray-700"
      >
        <i className="fas fa-times text-xl"></i>
      </button>
      <p className="text-gray-800 font-semibold text-lg mt-4 text-center">
        Are you sure you want to delete this chapter?
      </p>
      <span className="font-bold text-gray-900 text-md mt-2">
        {chapter?.chapterName}
      </span>

      <div className="flex items-center space-x-4 mt-6">
        <button
          onClick={deleteHandler}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
        >
          <i className="fas fa-trash-alt mr-2"></i> Delete
        </button>
        <button
          onClick={closeForm}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </dialog>
  );
}
