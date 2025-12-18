import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


interface UserAuthData {
    name: string;
    email: string;
    phone?: string;
    isActive: boolean;
    role: string;
    updatedAt?: string;
    accessToken: string;
    verificationCheck: boolean;
    userProfileCompleted: boolean;
}

const initialState: UserAuthData = {
    name: "",
    email: "",
    phone: "",
    isActive: true,
    role: "",
    updatedAt: "",
    accessToken: "",
    verificationCheck: false,
    userProfileCompleted: false,
};

const userAuthDataSlice = createSlice({
    name: 'authData',
    initialState,
    reducers: {
      setData: (state, action: PayloadAction<UserAuthData>) => {
        return {...action.payload};
      },
      clearData: ()=> initialState,
    },    
});

export const { setData,clearData } = userAuthDataSlice.actions;
export default userAuthDataSlice.reducer;
