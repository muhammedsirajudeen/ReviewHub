import { ReactElement } from 'react';
import { ErrorResponse, useRouteError } from 'react-router';
import SideBar from '../components/SideBar';

export default function ErrorElement(): ReactElement {
  const error = useRouteError() as ErrorResponse;
  
  return (
    <>
      <SideBar />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        {/* <h1 className="text-4xl font-bold text-center text-red-600 mt-10">
          Application Error
        </h1> */}
        <img
          className="mt-10 w-96 h-96 rounded-xl object-cover"
          src="/error/error.jpg"
          alt="Error illustration"
        />
        <div className="mt-6 bg-white shadow-lg rounded-lg p-6 text-center w-full max-w-md">
          <p className="text-5xl font-extrabold text-gray-800">{error.status}</p>
          <p className="text-lg font-semibold text-gray-600 mt-2">{error.statusText}</p>
          {error.data && (
            <p className="text-sm text-gray-500 mt-4">{error.data}</p>
          )}
        </div>
        <p className="text-sm font-light text-gray-500 mt-5">
          Something went wrong. Please try again later.
        </p>
      </div>
    </>
  );
}
