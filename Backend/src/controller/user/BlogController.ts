import { Request,Response } from "express";
import Blog, { IBlog } from "../../model/Blog";
import { IUser } from "../../model/User";

const AllBlog=async (req:Request,res:Response)=>{
    try{
        const Blogs=await Blog.find().populate('userId','email -_id')
        res.status(200).json({message:"success",blogs:Blogs})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}


const AddBlog=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        const blogBody=req.body as IBlog
        const newBlog=new Blog(
            {
                userId:user.id,
                heading:blogBody.heading,
                article:blogBody.article,
                articleImage:req.file?.filename
            }
        ) 
        await newBlog.save()
        res.status(201).json({message:"success"})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

const UpdateBlog=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        const {blogId}=req.params
        const blogBody=req.body as IBlog
        const updateBlog=await Blog.findById(blogId as string)
        if(updateBlog){
            if(updateBlog.userId.toHexString() !== user.id){
                res.status(403).json({message:"user does not have permission"})
                return
            }
            updateBlog.heading=blogBody.heading ?? updateBlog.heading
            updateBlog.article=blogBody.article ?? updateBlog.article
            updateBlog.articleImage=req.file?.filename ?? updateBlog.articleImage
            await updateBlog.save() 
            res.status(200).json({message:"success"})
        }else{
            res.status(404).json({message:"requested blog not found"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

const DeleteBlog=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        const {blogId}=req.params
        const deleteBlog=await Blog.findById(blogId)
        if(deleteBlog){
            if(deleteBlog.userId.toHexString() === user.id){
                await deleteBlog.deleteOne()
                res.status(200).json({message:"success"})
            }else{
                res.status(403).json({message:"user does not have permission to perform this"})
            }
        }else{
            res.status(404).json({message:"requested blog not found"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}
export default {
    AllBlog,
    AddBlog,
    UpdateBlog,
    DeleteBlog
}