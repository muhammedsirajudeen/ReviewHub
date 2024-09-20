interface HistoryProps {
  paymentDate: string;
  type: string;
  amount: number;
}

interface walletProps {
  userId?: string;
  redeemable?: number;
  balance?: number;
  history?: HistoryProps[];
}
export default interface userProps {
  email: string;
  profileImage: string;
  _id: string;
  authorization: string;
  address:string,
  phone:string,
  walletId:walletProps;

}