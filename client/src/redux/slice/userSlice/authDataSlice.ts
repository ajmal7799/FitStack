import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


interface UserAuthData {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    isActive: boolean;
    role: string;
    updatedAt?: string;
    accessToken: string;
    verificationCheck: boolean;
    userProfileCompleted: boolean;
    hasActiveSubscription: boolean;
}

const initialState: UserAuthData = {
  _id: '',
  name: '',
  email: '',
  phone: '',
  isActive: true,
  role: '',
  updatedAt: '',
  accessToken: '',
  verificationCheck: false,
  userProfileCompleted: false,
  hasActiveSubscription: false,
};

const userAuthDataSlice = createSlice({
  name: 'authData',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<UserAuthData>) => {
      return {...action.payload};
    },
    updateHasActiveSubscription: (state, action: PayloadAction<boolean>) => {
      state.hasActiveSubscription = action.payload;
    },
    clearData: ()=> initialState,
  },    
});

export const { setData,clearData, updateHasActiveSubscription } = userAuthDataSlice.actions;
export default userAuthDataSlice.reducer;
