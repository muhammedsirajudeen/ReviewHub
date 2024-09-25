import userProps from "./userProps";

export default interface paymentProps {
  amount: number;
  status: boolean;
  orderId: string;
  userId: userProps;
  type: string;
  _id: string;
}
