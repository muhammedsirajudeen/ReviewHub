import userProps from "./userProps";

export default interface withdrawalProps {
    userId:userProps,
    amount:number,
    date?:Date
    _id:string
    status:string
}