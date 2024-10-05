import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface HistoryProps {
  paymentDate: string;
  type: string;
  amount: number;
  status:boolean
}

interface walletProps {
  userId?: string;
  redeemable?: number;
  balance?: number;
  history?: HistoryProps[];
}
interface paymentMethodprops{
  bankaccount:string,
  ifsc:string,
  holdername:string,
  _id?:string
}

interface userProps {
  email?: string;
  password?: string;
  profileImage?: string;
  _id?: string;
  authorization?: string;
  address?:string,
  phone?:string,
  walletId?:walletProps;
  reviewerApproval?:boolean
  premiumMember?:boolean;
  favoriteCourses?:string[]
  verified?:boolean
  paymentMethod?:paymentMethodprops[]

}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
interface filterProps{
  date:Value | Date | null,
  status:boolean | null
}
export interface GlobalState {
  authenticated: boolean;
  user: userProps;
  page: string;
  filterProps:filterProps

}


//here do jwt authentication
const initialState: GlobalState = {
  authenticated: false,
  page: "",
  user: {paymentMethod:[]},
  filterProps:{
    date:null,
    status:null
  },
};

export const globalSlice = createSlice({
  name: "global",
  initialState: initialState,
  reducers: {
    setAuthenticated: (state) => {
      state.authenticated = true;
    },
    clearAuthenticated: (state) => {
      state.authenticated = false;
      state.user={paymentMethod:[]}
    },
    setUser: (state, action: PayloadAction<userProps>) => {
      state.user = action.payload;
    },
    setPage: (state, action: PayloadAction<string>) => {
      state.page = action.payload;
    },
    setDateSlice:(state, action: PayloadAction<Value | Date> )=>{
      state.filterProps.date=action.payload
    },
    setStatus:(state,action: PayloadAction<boolean>)=>{
      state.filterProps.status=action.payload
    },
    addWithdrawal:(state,action:PayloadAction<HistoryProps>)=>{
      state.user.walletId?.history?.push(action.payload)
    },
    setPaymentMethod:(state,action:PayloadAction<paymentMethodprops>)=>{
      state.user.paymentMethod?.push(action.payload)
    }
  },
});

// Action creators are generated for each case reducer function
export const { setAuthenticated, clearAuthenticated, setUser, setPage, setDateSlice, setStatus, addWithdrawal, setPaymentMethod } = globalSlice.actions;

export default globalSlice.reducer;
