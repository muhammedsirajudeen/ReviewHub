interface HistoryProps {
  paymentDate: string;
  type: string;
  amount: number;
  status: boolean;
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
  address: string;
  phone: string;
  walletId: walletProps;
  reviewerApproval: boolean;
}

export interface approvalProps {
  _id: string;
  userId: string;
  experience: number;
  domain: string;
  comment: string;
  resumeFile: string;
  approvalStatus: boolean;
}
