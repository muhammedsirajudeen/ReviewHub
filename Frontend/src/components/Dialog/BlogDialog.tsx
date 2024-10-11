import { Ref } from 'react';
import { blogProps } from '../../types/blogProps';
import url from '../../helper/backendUrl';

export default function BlogDialog({
  dialogRef,
  closeHandler,
  blog,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  blog: blogProps | undefined;
}) {
  return (
    <dialog
      style={{
        minHeight: '80vh',
        minWidth: '800px',
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
      }}
      className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-auto flex items-start justify-center p-2 md:p-8"
      ref={dialogRef}
    >
      <div className="w-full max-w-2xl bg-white rounded-lg overflow-hidden">
        <button
          onClick={closeHandler}
          className="absolute top-right text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close dialog"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {blog?.articleImage && (
          <img
            src={`${url}/blog/${blog.articleImage}`}
            alt={blog.heading}
            className="w-full h-auto rounded-lg object-cover"
            // Add an error boundary for graceful handling of missing images
          />
        )}

        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold mb-2">{blog?.heading}</h1>

          <div className="flex items-center mb-4">
            <p className="text-gray-500 text-sm mr-2">
              By {blog?.userId.email}
            </p>
            <p className="text-gray-500 text-sm">- {blog?.postedDate}</p>
          </div>

          <p className="text-gray-700 leading-relaxed">{blog?.article}</p>
        </div>
      </div>
    </dialog>
  );
}
