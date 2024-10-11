import { Dispatch, ReactElement, Ref, SetStateAction } from 'react';
import { roadmapProps } from '../../types/courseProps';
import { toast } from 'react-toastify';
import axiosInstance from '../../helper/axiosInstance';
import { produce } from 'immer';

export default function RoadmapDeleteForm({
  deletedialogRef,
  closeDeleteHandler,
  roadmap,
  setRoadmaps
}: {
  deletedialogRef: Ref<HTMLDialogElement>;
  closeDeleteHandler: VoidFunction;
  roadmap: roadmapProps | undefined;
  setRoadmaps:Dispatch<SetStateAction<roadmapProps[]>>
}): ReactElement {

  const deleteHandler = async () => {
    const response = (
      await axiosInstance.delete(`/admin/roadmap/${roadmap?._id}`)
    ).data;
    if (response.message === 'success') {
      toast.success('Deleted successfully');
      setRoadmaps(produce((draft)=>{
        draft.forEach((d)=>{
          if(d._id===roadmap?._id){
            d.unlistStatus=true
          }
        })
      }))
      closeDeleteHandler()
      
      // setTimeout(() => window.location.reload(), 1000);
    } else {
      toast(response.message);
    }
  };

  return (
    <>
      <dialog
        ref={deletedialogRef}
        className="flex flex-col items-center justify-center w-96 h-52 p-6 bg-white border rounded-lg shadow-lg"
      >
        <button
          onClick={closeDeleteHandler}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times text-lg"></i>
        </button>
        <p className="text-gray-700 font-medium text-sm mb-2">Are you sure you want to delete this roadmap?</p>
        <p className="text-gray-900 font-semibold text-md mb-4">{roadmap?.roadmapName}</p>
        <div className="flex items-center space-x-4">
          <button
            onClick={deleteHandler}
            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
          >
            <i className="fas fa-trash-alt mr-2"></i> Delete
          </button>
          <button
            onClick={closeDeleteHandler}
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </dialog>
    </>
  );
}
