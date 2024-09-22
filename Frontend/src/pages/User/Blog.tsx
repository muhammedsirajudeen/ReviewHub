import { ReactElement, useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setPage } from "../../store/globalSlice";
import { blogProps } from "../../types/blogProps";
import axiosInstance from "../../helper/axiosInstance";
import url from "../../helper/backendUrl";

export default function Blog(): ReactElement {
    const [blogs, setBlogs] = useState<Array<blogProps>>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setPage('blog'));
        async function dataWrapper() {
            try {
                const response = (await axiosInstance.get('/user/blog')).data;
                if (response.message === "success") {
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-start my-6  w-full">BLOG</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {
                    blogs.map((blog) => (
                        <div key={blog._id} className="bg-gradient-to-r w-3/4 from-blue-100 to-blue-100 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
                            <img 
                                src={`${url}/blog/${blog.articleImage}`} 
                                alt={blog.heading} 
                                className="w-full h-48 object-cover" 
                            />
                            <div className="p-4">
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{blog.heading}</h2>
                                <p className="text-gray-600 text-sm mb-2">{new Date(blog.postedDate).toLocaleDateString()}</p>
                                <p className="h-24 overflow-hidden text-gray-700 text-sm">{blog.article}</p>
                                <p className="text-gray-500 text-xs mt-2">{blog.userId.email}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
