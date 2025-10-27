import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


interface UserAuthData {
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    role: string;
    updatedAt: string;
    accessToken: string;
}

const initialState: UserAuthData = {
    name: "",
    email: "",
    phone: "",
    isActive: true,
    role: "User",
    updatedAt: new Date().toISOString(),
    accessToken: ""
};

const userAuthDataSlice = createSlice({
    name: 'UserAuthData',
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
