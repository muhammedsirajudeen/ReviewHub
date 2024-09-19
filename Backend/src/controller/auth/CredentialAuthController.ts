import { Request, Response } from "express";
import User from "../../model/User";
import jwt from "jsonwebtoken";
const backendUrl="http://localhost:3000/"

import { hashPassword,comparePasswords } from "../../helper/bcryptHelper";
import { randomUUID } from "crypto";
import transporter from "../../config/nodemailerConfig";
import Wallet from "../../model/Wallet";

//storing it in dict
let UuidMapping:Map<string,string>=new Map()

//dont forget to hash the password being stored
const CredentialSignup = async (req: Request, res: Response) => {
  try {
    const { email, password,phone,address } = req.body;
    const checkUser = await User.findOne({ email: email });
    let filename;
    if(req.file?.filename){
        filename=backendUrl+req.file.filename
    }else if(checkUser?.profileImage){
        filename=checkUser.profileImage
    }
    
    if (checkUser) {
      res.status(200).json({ message: "user already exists" });
    } else {
      let hashedPassword=await hashPassword(password)
      const newUser = new User({
        email: email,
        password: hashedPassword,
        phone,
        address,
        profileImage:filename ?? "https://img.icons8.com/ios-glyphs/30/1A1A1A/user--v1.png",

      });
      const createdUser=await newUser.save();
      const newWallet=new Wallet(
        {
          userId:createdUser.id
        }
      )
      //referencing it the other way too  
      const createdWallet=await newWallet.save()
      createdUser.walletId=createdWallet.id
      await createdUser.save()
      res.status(201).json({ message: "success" });
    }

  } catch (error) {
    // console.log(error);
    res.status(501).json({ message: "server error occured" });
  }
};

const CredentialSignin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      
      if (checkUser.email === email && await comparePasswords(password,checkUser.password)) {
        const token = jwt.sign(
          {
            id: checkUser.id,
            email: checkUser.email,
            password: checkUser.password,
          },
          process.env.SECRET_KEY ?? "",
          { expiresIn: "1h" }
        );
        res.status(200).json({ message: "success", token: token });
      } else {
        res.status(200).json({ message: "invalid credentials" });
      }
    } else {
      res.status(200).json({ message: "please signup first" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "server error occured" });
  }
};

const CredentialForgot=async (req:Request,res:Response)=>{
  const {email}=req.body
  const uuid=randomUUID()
  UuidMapping.set(email,uuid)
  try{
    if(await User.findOne({email})){
      let mailOptions = {
        from: 'muhammedsirajudeen29@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: `Reset Password using this link <a href="http://localhost:5173/forgot?token=${uuid}`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('Error occurred:', error);
          res.status(500).json({message:"success"})
    
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({message:"success"})
          
        }
      });
    } else{
      res.status(200).json({message:"User not found"})
    }
  }catch(error){
    res.status(500).json({message:"server error"})
  }

}

const CredentialPasswordChange=async (req:Request,res:Response)=>{
  let {password,email}=req.body
  let {id}=req.query
  let uuid=UuidMapping.get(email)
  console.log(UuidMapping,email)
  console.log(id,uuid)
  try{
    if(id===uuid){
      let updateUser=await User.findOne({email:email})
      if(updateUser){

        updateUser.password=await hashPassword(password)
        await updateUser.save()
        res.status(200).json({message:"success"})
      }else{
        res.status(401).json({message:"unauthorized"})
      }
    }else{
      res.json({message:"invalid"})
    }
  }catch(error){
    res.status(500).json({message:"server error occured"})
  }

}



export default {
  CredentialSignup,
  CredentialSignin,
  CredentialForgot,
  CredentialPasswordChange
};
