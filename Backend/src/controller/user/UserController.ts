import { Request,Response } from "express"
import User from "../../model/User"
interface userProps{
    email:string,
    password:string,
    profileImage:string
}
const backendUrl="http://localhost:3000/"

const UserUpdate=async (req:Request,res:Response)=>{
    try{
        const user=req.user as userProps
        const {phone,address,profileImage,email}=req.body
        const checkUser=await User.findOne({email})
        let filename;
        if(req.file?.filename){
            filename=backendUrl+req.file.filename
        }else if(checkUser?.profileImage){
            filename=checkUser.profileImage
        }
        const updateUser=await User.updateOne(
            {
                email:user.email
            },
            {
                phone:phone,
                address:address,
                profileImage:filename ?? "https://img.icons8.com/ios-glyphs/30/1A1A1A/user--v1.png"
            }
        )
        res.status(200).json({message:"success"})
    
    }catch(error){
        console.log(error)
        res.status(501).json({message:"server error"})
    }
}



export default {
    UserUpdate
}