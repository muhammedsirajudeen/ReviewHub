import { ReactElement } from "react";
import { useLocation } from "react-router";

export default function Roadmap(): ReactElement {

  const location = useLocation();
  
  //in useffect we have to check existing roadmap
  console.log(location.state.id);
  const formHandler=()=>{
    alert("clicked")
  }

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
    </div>
  );
}
