import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import axiosInstance from '../../helper/axiosInstance';
import { blogProps } from '../../types/blogProps';
import url from '../../helper/backendUrl';
import BlogForm from '../../components/Form/Blog/BlogForm';
import { flushSync } from 'react-dom';
import { ToastContainer } from 'react-toastify';
import BlogDelete from '../../components/Form/Blog/BlogDelete';
import { FaRegSadCry } from "react-icons/fa"; // Importing a sad icon from react-icons

export default function ManageBlog(): ReactElement {
  const dispatch = useAppDispatch();
  const [blogs, setBlogs] = useState<Array<blogProps>>([]);
  const [blog, setBlog] = useState<blogProps>();
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const [editdialog, setEditdialog] = useState<boolean>(false);
  const [deletedialog, setDeletedialog] = useState<boolean>(false);
  useEffect(() => {
    dispatch(setPage('blog'));
    async function dataWrapper() {
      try {
        const response = (await axiosInstance.get('/user/blog/manage')).data;
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
  const editHandler = (blog: blogProps) => {
    flushSync(() => {
      setBlog(blog);
      setEditdialog(true);
    });
    editDialogRef.current?.showModal();
  };
  const deleteHandler=(blog:blogProps)=>{
      flushSync(()=>{
        setBlog(blog)
        setDeletedialog(true)
    })
    deleteDialogRef.current?.showModal()
  }
  const editCloseHandler = () => {
    setEditdialog(false);
    editDialogRef.current?.close();
  };
  const deleteCloseHandler=()=>{
    setDeletedialog(false)
    deleteDialogRef.current?.close()
  }
  
  return (
    <>
      <div className="ml-36 flex flex-col items-center justify-center">
        <h1 className="text-4xl w-full mb-6 mt-4">YOUR BLOGS</h1>
        <div className="w-full max-w-4xl space-y-4">
          {blogs.length === 0 && (
            <div className="flex flex-col items-center p-6 border rounded-lg shadow-lg bg-gray-100">
              <FaRegSadCry className="text-6xl text-gray-400 mb-4" />
              <p className="font-semibold text-lg text-gray-700">
                No Blogs to show for now...
              </p>
              <p className="text-gray-500">Start writing your first blog!</p>
            </div>
          )}
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={`${url}/blog/${blog.articleImage}`}
                className="w-32 h-32 rounded-full object-cover"
                alt={blog.heading}
              />
              <div className="flex-1 mx-4">
                <h2 className="text-xl font-semibold">{blog.heading}</h2>
                <p className="text-gray-500">{blog.postedDate}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editHandler(blog)}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteHandler(blog)}
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {editdialog && (
        <BlogForm
          method="put"
          blog={blog}
          dialogRef={editDialogRef}
          closeHandler={editCloseHandler}
        />
      )}
      {deletedialog && (
        <BlogDelete
          dialogRef={deleteDialogRef}
          closeHandler={deleteCloseHandler}
          blog={blog}
        />
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
