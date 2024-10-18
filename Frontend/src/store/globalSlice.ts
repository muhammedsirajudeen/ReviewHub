import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  history: HistoryProps[];
}
interface paymentMethodprops {
  bankaccount: string;
  ifsc: string;
  holdername: string;
  _id?: string;
}

interface userProps {
  email?: string;
  password?: string;
  profileImage?: string;
  _id?: string;
  authorization?: string;
  address?: string;
  phone?: string;
  walletId: walletProps;
  reviewerApproval?: boolean;
  premiumMember?: boolean;
  favoriteCourses: string[];
  verified?: boolean;
  paymentMethod: paymentMethodprops[];
  lastSeen?: string;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
interface filterProps {
  date: Value | Date | null;
  status: boolean | null;
}
export interface GlobalState {
  authenticated: boolean;
  user: userProps;
  page: string;
  filterProps: filterProps;
}

//here do jwt authentication
const initialState: GlobalState = {
  authenticated: false,
  page: '',
  user: {
    paymentMethod: [],
    favoriteCourses: [],
    walletId: {
      history: [],
      userId: '',
      balance: 0,
      redeemable: 0,
    },
  },
  filterProps: {
    date: null,
    status: null,
  },
};

export const globalSlice = createSlice({
  name: 'global',
  initialState: initialState,
  reducers: {
    setAuthenticated: (state) => {
      state.authenticated = true;
    },
    clearAuthenticated: (state) => {
      state.authenticated = false;
      state.user = {
        paymentMethod: [],
        favoriteCourses: [],
        walletId: { history: [], balance: 0, redeemable: 0 },
      };
    },
    setUser: (state, action: PayloadAction<userProps>) => {
      state.user = action.payload;
    },
    setPage: (state, action: PayloadAction<string>) => {
      state.page = action.payload;
    },
    setDateSlice: (state, action: PayloadAction<Value | Date>) => {
      state.filterProps.date = action.payload;
    },
    setStatus: (state, action: PayloadAction<boolean>) => {
      state.filterProps.status = action.payload;
    },
    addWithdrawal: (state, action: PayloadAction<HistoryProps>) => {
      state.user.walletId?.history?.push(action.payload);
    },
    setPaymentMethod: (state, action: PayloadAction<paymentMethodprops>) => {
      state.user.paymentMethod.push(action.payload);
    },
    setFavorite: (state, action: PayloadAction<string>) => {
      const flag = state.user.favoriteCourses.some(
        (id) => id === action.payload
      );
      if (flag) {
        state.user.favoriteCourses.splice(
          state.user.favoriteCourses.indexOf(action.payload),
          1
        );
        return;
      }
      state.user.favoriteCourses.push(action.payload);
    },
    setUpdatedWallet: (state, action: PayloadAction<number>) => {

    if (state.user.walletId && typeof state.user.walletId.redeemable === 'number' && state.user.walletId.redeemable >= 0) {
      // Update the redeemable balance
      state.user.walletId.redeemable += action.payload;
  
      // Log the payment history
      state.user.walletId.history.push({
          type: 'payment',
          status: true,
          amount: action.payload,
          paymentDate: new Date().toISOString(),
      });
      
      }else{
        state.user['walletId']={
          redeemable:action.payload,
          history:[
            {
              type:'payment',
              status:true,
              amount:action.payload,
              paymentDate:new Date().toISOString()
            }
          ]
        }
      }
    },
    setFailedPayment: (state, action: PayloadAction<number>) => {
      state.user.walletId.history.push({
        type: 'payment',
        status: false,
        amount: action.payload,
        paymentDate: new Date().toISOString(),
      });
    },
    setPremium: (state, action: PayloadAction<boolean>) => {
      state.user.premiumMember = action.payload;
    },
    setReviewerApproval:(state,action:PayloadAction<boolean>)=>{
      state.user.reviewerApproval=action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  setAuthenticated,
  clearAuthenticated,
  setUser,
  setPage,
  setDateSlice,
  setStatus,
  addWithdrawal,
  setPaymentMethod,
  setFavorite,
  setUpdatedWallet,
  setFailedPayment,
  setPremium,
  setReviewerApproval
} = globalSlice.actions;

export default globalSlice.reducer;
