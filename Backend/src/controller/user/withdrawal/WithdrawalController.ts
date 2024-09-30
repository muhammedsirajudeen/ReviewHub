import {Request,Response} from "express"
import { IUser } from "../../../model/User";
import Wallet from "../../../model/Wallet";
import Withdrawal from "../../../model/Withdrawal";

const WithdrawalController=async (req:Request,res:Response)=>{
  try {
    const user=req.user as IUser
    const {amount,bankaccount,ifsc,holdername}=req.body

    const checkWallet=await Wallet.findOne({userId:user.id})
    if(checkWallet){
    
      //also write the logic for existing withdrawal request too
        console.log(checkWallet)
        const existingWithdrawals=await Withdrawal.find({userId:user.id})
        let withdrawalsAmount=0
        if(existingWithdrawals){
          existingWithdrawals.map((withdrawal)=>{
            if(withdrawal.completed!==true){
              withdrawalsAmount+=withdrawal.amount
            }
          })
        }
        console.log(withdrawalsAmount)
        if(checkWallet.redeemable>=parseInt(amount) && checkWallet.redeemable-withdrawalsAmount>=parseInt(amount) ){

            const newWithdrawal=new Withdrawal(
                {
                    userId:user.id,
                    amount:amount,
                    status:"pending",
                    paymentMethod:{
                      bankaccount,
                      ifsc,
                      holdername
                    }
                }
            )

            checkWallet.history.push(
                {
                    amount:parseInt(amount as string),
                    type:"withdrawal requested",
                    paymentDate:new Date(),
                    status:false,
                    withdrawalId:newWithdrawal.id
                }
            )
            await newWithdrawal.save()
            await checkWallet.save()    
            let flag=false
            user.paymentMethod.forEach((paymentMethod)=>{
              if(paymentMethod.bankaccount===bankaccount){
                flag=true
              }
            })        
            if(!flag){
              user.paymentMethod.push(
                {
                  bankaccount:bankaccount,
                  ifsc:ifsc,
                  holdername:holdername
                }
              )
            }
            await user.save()
            res.status(200).json({ message: 'success' });
        }else{
            res.status(400).json({message:"Insufficient funds"})
        }
    }else{
        res.status(404).json({message:"wallet not found"})
    }
  }catch(error){
    console.log(error)
    res.status(500).json({message:"server error occured"})
  }
}


export default {
  WithdrawalController
}
