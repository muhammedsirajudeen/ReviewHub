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

}

export interface GlobalState {
  authenticated: boolean;
  user: userProps;
  page: string;
}

//here do jwt authentication
const initialState: GlobalState = {
  authenticated: false,
  page: "",
  user: {},
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
      state.user={}
    },
    setUser: (state, action: PayloadAction<userProps>) => {
      state.user = action.payload;
    },
    setPage: (state, action: PayloadAction<string>) => {
      state.page = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuthenticated, clearAuthenticated, setUser, setPage } =
  globalSlice.actions;

export default globalSlice.reducer;
