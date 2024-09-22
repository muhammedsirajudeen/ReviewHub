import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import { blogProps } from '../../types/blogProps';
import axiosInstance from '../../helper/axiosInstance';
import url from '../../helper/backendUrl';
import BlogForm from '../../components/Form/Blog/BlogForm';
import { flushSync } from 'react-dom';
import { ToastContainer } from 'react-toastify';
import BlogDialog from '../../components/Dialog/BlogDialog';

export default function Blog(): ReactElement {
  const [blogs, setBlogs] = useState<Array<blogProps>>([]);
  const [viewblog, setViewblog] = useState<boolean>(false);
  const [blog, setBlog] = useState<blogProps | undefined>();
  const [createblog, setEditblog] = useState<boolean>(false);
  const createDialogRef = useRef<HTMLDialogElement>(null);
  const viewDialogRef = useRef<HTMLDialogElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPage('blog'));
    async function dataWrapper() {
      try {
        const response = (await axiosInstance.get('/user/blog')).data;
        if (response.message === 'success') {
          setBlogs(response.blogs);
        } else {
          console.log(response.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
    dataWrapper();
  }, [dispatch]);

  const createHandler = () => {
    flushSync(() => {
      setEditblog(true);
    });
    createDialogRef.current?.showModal();
  };

  const createCloseHandler = () => {
    createDialogRef.current?.close();
    setEditblog(false);
  };

  const viewCloseHandler = () => {
    viewDialogRef.current?.close();
    setViewblog(false);
  };

  const viewBlogHandler = (blog: blogProps) => {
    flushSync(() => {
      setBlog(blog);
      setViewblog(true);
    });
    viewDialogRef.current?.showModal();
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className='flex w-full justify-between items-center'>
          <h1 className="text-4xl font-bold text-start my-6 w-full">BLOG</h1>
          <a className='text-nowrap text-black border-b-black border-t-white border-l-white border-r-white border hover:underline' href='/user/blog/manage'>Your Blogs</a>
        </div>
        <button
          className="bg-black text-white p-2 rounded-lg font-normal mb-2 hover:bg-gray-800 transition duration-200"
          onClick={createHandler}
        >
          Post
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              onClick={() => viewBlogHandler(blog)}
              key={blog._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
            >
              <img
                src={`${url}/blog/${blog.articleImage}`}
                alt={blog.heading}
                className="w-full h-36 object-cover object-center"
              />
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{blog.heading}</h2>
                <p className="text-gray-500 text-sm mb-2">{new Date(blog.postedDate).toLocaleDateString()}</p>
                <p className="h-12 overflow-hidden text-gray-700 text-sm">{blog.article}</p>
                <p className="text-gray-500 text-xs mt-2">{blog.userId.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {createblog && (
        <BlogForm
          blog={undefined}
          dialogRef={createDialogRef}
          closeHandler={createCloseHandler}
        />
      )}
      {viewblog && (
        <BlogDialog blog={blog} dialogRef={viewDialogRef} closeHandler={viewCloseHandler} />
      )}
      <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
    </>
  );
}
