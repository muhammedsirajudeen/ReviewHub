import { ReactElement } from "react";
import { ErrorResponse, useRouteError } from "react-router";
import Navbar from "../components/SideBar";

export default function ErrorElement(): ReactElement {
  const error=useRouteError() as ErrorResponse
  console.log(error)
  return (
    <>
      <Navbar/>
      <div className="flex items-center justify-center flex-col">
        <p className="text-3xl font-bold mt-10">{error.status}</p>
        <p className="text-sm font-light mt-5">{error.statusText}</p>
        <p className="text-xs font-normal mt-5">{error.data}</p>
      {/* {error.data} */}

      </div>
      {/* {error.status} */}
    </>
  );
}
