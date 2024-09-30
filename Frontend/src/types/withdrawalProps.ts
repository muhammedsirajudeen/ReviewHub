import userProps from "./userProps";

export interface paymentMethodprops {
    bankaccount: string;
    ifsc: string;
    holdername: string;
  }
  

export default interface withdrawalProps {
    userId:userProps,
    amount:number,
    date?:Date
    _id:string
    status:string
    paymentMethod:paymentMethodprops[]

}