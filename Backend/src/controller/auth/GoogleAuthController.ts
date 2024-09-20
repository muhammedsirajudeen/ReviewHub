import { Request, Response } from "express";
import axios from "axios";
import User from "../../model/User";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { hashPassword } from "../../helper/bcryptHelper";
import Wallet from "../../model/Wallet";
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
      if(checkUser.authorization==="admin"){
        const token = jwt.sign(
          {
            id: checkUser.id,
            email: checkUser.email,
            password: checkUser.password,
            admin:true
          },
          process.env.SECRET_KEY ?? "",
          { expiresIn: "12h" } //decresae in production
        );
        //temporary solution thinking of better approaches
        return res.status(200).json({ message: "success", token: token ,admin:true});
      }
      const token = jwt.sign(
        {
          id: checkUser.id,
          email: checkUser.email,
          password: checkUser.password,
        },
        process.env.SECRET_KEY ?? "",
        { expiresIn: "12h" } //dont forget to decrease in production
      );
      res.status(200).json({ message: "success", token: token });
    } else {
      res.status(200).json({ message: "user doesnt exist" });
    }
  } catch (error) {
    res.status(501).json({ message: "server error occured" });
  }
};

//dont forget to hash the password first
const GoogleSignup = async (req: Request, res: Response) => {
  try {
    const userToken = req.body.userToken;

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
        verified:true
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
