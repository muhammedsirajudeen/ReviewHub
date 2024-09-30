import { Request,Response } from "express";
import Withdrawal from "../../model/Withdrawal";
import User, { IUser } from "../../model/User";
import Wallet from "../../model/Wallet";
import { PAGE_LIMIT } from "../user/CourseController";


const Withdrawals=async (req:Request,res:Response)=>{
    try{
        let { page } = req.query ?? '1';
        const pageLength=(await Withdrawal.find()).length
        const withdrawals=await Withdrawal.find().populate('userId','email profileImage').skip((parseInt(page as string) - 1) * PAGE_LIMIT)
        .limit(PAGE_LIMIT);
        
        res.status(200).json({message:"success",withdrawals:withdrawals,pageLength})
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
            approveWithdrawal.status=approval ? "approved" : "rejected"
            approveWithdrawal.completed=approval
            const wallet=await Wallet.findOne({userId:approveWithdrawal.userId})
            if(approval && wallet ){
                wallet.redeemable-=approveWithdrawal.amount
                wallet.balance-=approveWithdrawal.amount
            }
            wallet?.history.map((history)=>{
                console.log(history)
                if(history?.withdrawalId?.toHexString()===approveWithdrawal.id){
                    history.status=approval
                    history.type= approval ?  "withdrawal succeeded" : "withdrawal rejected"
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
