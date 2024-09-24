import { Request, Response } from "express";
import axios from "axios";
import User from "../../model/User";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { hashPassword } from "../../helper/bcryptHelper";
import Wallet from "../../model/Wallet";
import { addValueToCache } from "../../helper/redisHelper";
import { randomUUID } from "crypto";
dotenv.config();
interface responseProps {
  email: string;
  id: string;
  name: string;
  picture: string;
}

const getUserdata = async (userToken: string) => {
  const data: responseProps = (
    await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userToken}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: "application/json",
        },
      }
    )
  ).data;
  return data;
};

const GoogleLogin = async (req: Request, res: Response) => {
  try {
    const userToken = req.body.userToken;

    let data = await getUserdata(userToken);
    let userData = data;
    const checkUser = await User.findOne({ email: userData.email });
    if (checkUser) {
      const token = jwt.sign(
        {
          id: checkUser.id,
          email: checkUser.email,
        },
        process.env.SECRET_KEY as string,
        { expiresIn: "5m" } //dont forget to decrease in production
      );
      const refresh_token= jwt.sign(
        {
          id:checkUser.id,
          email:checkUser.email,
          random:randomUUID()

        },
        process.env.REFRESH_SECRET_KEY as string,
        {expiresIn:"7d"}
      ) 
      addValueToCache(`refresh-${checkUser.email}`,refresh_token,10000)

      res.status(200).json({ message: "success", token: token, refresh_token:refresh_token });
    } else {
      res.status(404).json({ message: "user doesnt exist" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "server error occured" });
  }
};

//dont forget to hash the password first
const GoogleSignup = async (req: Request, res: Response) => {
  try {
    const {userToken,role} = req.body;
    
    let data = await getUserdata(userToken);
    let userData = data;
    const checkUser = await User.findOne({ email: userData.email });
    if (checkUser) {
      res.status(200).json({ message: "user already exists" });
    } else {
      //registering new user here
      let newUser = new User({
        email: userData.email,
        password: await hashPassword(userData.id),
        profileImage: userData.picture,
        verified:true,
        authorization:role
      });
      const createdUser=await newUser.save();
      const newWallet=new Wallet(
        {
          userId:createdUser.id
        }
      )  
      const createdWallet=await newWallet.save()
      createdUser.walletId=createdWallet.id
      await createdUser.save()

      res.status(201).json({ message: "success" });
    }
  } catch (error) {
    console.log(error)
    res.status(501).json({ message: "server error occured" });
  }
};

export default {
  GoogleLogin,
  GoogleSignup,
};
