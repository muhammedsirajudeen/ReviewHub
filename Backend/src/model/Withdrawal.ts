import mongoose from "mongoose";

interface IWithdrawal extends Document{
    userId:mongoose.Types.ObjectId,
    amount:number,
    date?:Date
}

const WithdrawalSchema=new mongoose.Schema<IWithdrawal>(
    {
        userId:{
            type:mongoose.Schema.ObjectId,
            required:true,
            ref:'User'
        },
        amount:{
            type:Number,
            required:true,
        },
        date:{
            type:Date,
            required:false,
            default:new Date()
        }
    }
)

const Withdrawal=mongoose.model<IWithdrawal>('withdrawal',WithdrawalSchema)
export default Withdrawal