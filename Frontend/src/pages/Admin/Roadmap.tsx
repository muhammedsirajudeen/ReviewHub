import { ReactElement, useRef, useState } from "react";
import { useLocation } from "react-router";
import RoadmapForm from "../../components/Form/RoadmapForm";
import { flushSync } from "react-dom";

export default function Roadmap(): ReactElement {

  const location = useLocation();
  const [open,setOpen]=useState<boolean>(false)
  const dialogRef=useRef<HTMLDialogElement>(null)
  //in useffect we have to check existing roadmap
  const formHandler=()=>{
    flushSync(()=>{
      setOpen(true)
    })
    dialogRef.current?.showModal()

  }
  const closeForm = () => {
    setOpen(false);
    dialogRef.current?.close();
  };

  return (
    <div className="ml-36 mt-10">
      <div className="flex h-72 w-80 shadow-xl items-center flex-col justify-center">
        <button
          onClick={formHandler}
          style={{ fontSize: "4vw" }}
          className="flex items-center justify-center text-4xl font-light rounded-lg"
        >
          +
        </button>
        <p className="text-sm mt-10 text-gray-500">Add Roadmap...</p>
      </div>
      {open && (
        <dialog
          ref={dialogRef}
          className="flex items-center justify-center flex-col w-96  p-2"
        >
          <RoadmapForm id={location.state.id} closeForm={closeForm} />
        </dialog>
      )}
    </div>
  );
}
