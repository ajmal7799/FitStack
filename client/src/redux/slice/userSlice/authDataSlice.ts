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
    profileImage?: string
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
  profileImage: ''
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
    setAccessToken: (state, action) => {
    state.accessToken = action.payload;
  },

    clearData: ()=> initialState,
  },    
});

export const { setData,clearData, updateHasActiveSubscription, setAccessToken } = userAuthDataSlice.actions;
export default userAuthDataSlice.reducer;
