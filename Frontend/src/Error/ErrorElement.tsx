import { ReactElement } from 'react';
import { ErrorResponse, useRouteError } from 'react-router';
import Navbar from '../components/SideBar';

export default function ErrorElement(): ReactElement {
  const error = useRouteError() as ErrorResponse;
  console.log(error);
  return (
    <>
      <Navbar />
      <div className="flex ml-36 items-center justify-center flex-col">
        <h1 className="w-full text-center text-3xl mt-10 font-bold">
          APPLICATION ERROR
        </h1>
        <img className="mt-20 scale-150" src="/error/error.gif" />
        <p className="text-3xl ml-36 font-bold mt-10">{error.status}</p>
        <p className="text-sm font-light mt-5">{error.statusText}</p>
        <p className="text-xs font-normal mt-5">{error.data}</p>
        {/* {error.data} */}
      </div>
      {/* {error.status} */}
    </>
  );
}
