import { Request, Response } from "express";
import User from "../../model/User";
import { IUser } from "../../model/User";

const backendUrl="http://localhost:3000/"

const AllUsers = async (req: Request, res: Response) => {
  try {
    let user = req.user as IUser;
    if (user.authorization !== "admin") {
      return res.status(403).json({ message: "insufficient permissions" });
    }
    const users = await User.find();
    const excludeUsers = users.filter((user) => user.authorization !== "admin");
    res.status(200).json({ message: "success", users: excludeUsers });
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "server error occured" });
  }
};

const DeleteUser = async (req: Request, res: Response) => {
  try {
    let user = req.user as IUser;
    if (user.authorization !== "admin") {
      return res.status(403).json({ message: "insufficient permissions" });
    }
    const { email } = req.params;
    await User.findOneAndDelete({ email: email });
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "server error occured" });
  }
};

const UpdateUser = async (req: Request, res: Response) => {
  try {
    let userhere = req.user as IUser;

    if (userhere.authorization !== "admin") {
      return res.status(403).json({ message: "insufficient permissions" });
    }
    const { email,currentemail, phone, address, profileImage } = req.body;
    const checkUser=await User.findOne({email:currentemail})
    let filename;
    if(req.file?.filename){
        filename=backendUrl+req.file.filename
    }else if(checkUser?.profileImage){
        filename=checkUser.profileImage
    }
    const user=await User.findByIdAndUpdate(
      { _id: checkUser?._id },
      {
        email,
        phone,
        address,
        profileImage:filename ?? "https://img.icons8.com/ios-glyphs/30/1A1A1A/user--v1.png",
      }
    );
    
    res.status(200).json({message:"success"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error occured" });
  }
};

export default {
  AllUsers,
  DeleteUser,
  UpdateUser
};
