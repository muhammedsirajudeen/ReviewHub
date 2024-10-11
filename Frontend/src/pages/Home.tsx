import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { AuthPath } from "../types/pathNames";


export default function Home(): ReactElement {
  return (
    <>
      <div className="flex items-center justify-end mt-2">
        <a href={AuthPath.signin} className=" text-navbar border border-b-navbar mr-10">
          Login
        </a>
        <h1 className="text-3xl text-navbar mr-10">ReviewHub.</h1>
      </div>
      <div className="flex w-full items-center justify-start mt-40">
        <div className="flex w-1/2 items-start ml-20 flex-col justify-center">
          <h1 className="text-4xl text-gray-500 text-start ">
            Lessons and insights <br />
            <span className="text-green-500">from 8 years</span>
          </h1>
          <h1 className="text-xs text-gray-500 text-start mt-4">
            Where to learn and excel at your field.
          </h1>
          <button className="bg-navbar text-white text-xs p-2 mt-10">
            Signin
          </button>
          <Link to={AuthPath.signup} state={{role:"reviewer"}} className="text-green-500 mt-4">
            Become A Reviewer
          </Link>
        </div>
        <div className="flex w-1/2 items-center mr-20 justify-center">
          <img src="/home/illustration.png" />
        </div>
      </div>
      <h1 className="text-center text-gray-500 text-3xl">
        Manage Your entire Learning <br /> in a Single System
      </h1>
      <div className="flex items-center justify-evenly">
        <div className="flex items-center justify-center w-60 mt-10 flex-col">
          <img src="/home/person.png" />
          <h1 className="text-xl font-bold text-gray-500 mt-5">
            Tailored Learning
          </h1>
          <p className="text-sm w-50 text-center text-gray-500">
            Our membership management software provides full automation of
            membership renewals and payments
          </p>
        </div>
        <div className="flex items-center justify-center w-60 mt-10 flex-col">
          <img src="/home/building.png" />
          <h1 className="text-xl font-bold text-gray-500 mt-5">
            Top Notch Reviewers
          </h1>
          <p className="text-sm w-50 text-center text-gray-500">
            Our membership management software provides full automation of
            membership renewals and payments
          </p>
        </div>
        <div className="flex items-center justify-center w-60 mt-10 flex-col">
          <img src="/home/peer.png" />
          <h1 className="text-xl font-bold text-gray-500 mt-5">
            Peer Learning
          </h1>
          <p className="text-sm w-50 text-center text-gray-500">
            Our membership management software provides full automation of
            membership renewals and payments
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center mt-20">
        <div className="w-1/2  flex items-center justify-end">
          <img className="w-40 h-40" src="/home/pana.jpg" />
        </div>
        <div className="w-1/2 flex  flex-col items-start justify-center">
          <h1 className="text-3xl text-gray-600 text-start">
            Learn More About Us.
          </h1>
          <p className="text-xs text-start w-96 text-gray-400">
            Donec a eros justo. Fusce egestas tristique ultrices. Nam tempor,
            augue nec tincidunt molestie, massa nunc varius arcu, at scelerisque
            elit erat a magna.
          </p>
          <button className="bg-green-500 text-white text-xs p-2 mt-2">
            Learn More
          </button>
        </div>
      </div>
    </>
  );
}
