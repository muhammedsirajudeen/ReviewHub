import { Request,Response } from "express";
import Withdrawal from "../../model/Withdrawal";
import User, { IUser } from "../../model/User";
import Wallet from "../../model/Wallet";


const Withdrawals=async (req:Request,res:Response)=>{
    try{
        const withdrawals=await Withdrawal.find().populate('userId','email profileImage')
        
        res.status(200).json({message:"success",withdrawals:withdrawals})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}


const ApproveWithdrawal=async (req:Request,res:Response)=>{
    try{
        const {withdrawalId}=req.params
        const {approval}=req.body
        const approveWithdrawal=await Withdrawal.findById(withdrawalId)
        if(approveWithdrawal){
            approveWithdrawal.status=true
            const wallet=await Wallet.findOne({userId:approveWithdrawal.userId})
            wallet?.history.map((history)=>{
                console.log(history)
                if(history?.withdrawalId?.toHexString()===approveWithdrawal.id){
                    history.status=true
                    history.type="withdrawal succeeded"
                }
            })
            await approveWithdrawal.save()
            await wallet?.save()
            res.status(200).json({message:"success"})
        }else{
            res.status(404).json({message:"requested resource not found"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:"success"})
    }
}


export default {
    Withdrawals,
    ApproveWithdrawal
}
