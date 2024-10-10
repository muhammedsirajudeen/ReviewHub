import { Request, Response } from "express";

const GetReviewerDashboard=(req:Request, res: Response)=>{
    try {
        //pending reviews
        //successful reviews
        //wallet balance
        // and also some feedbacks to show if you can
        res.status(200).json({message:'success'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'server error occured'})
    }
}


export default {
    GetReviewerDashboard
}