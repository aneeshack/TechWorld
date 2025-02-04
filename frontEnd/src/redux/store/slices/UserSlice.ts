import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SignupFormData, Response } from "../../../types/IForm";
import { signupAction } from "../actions/auth/SignupAction";
import { otpAction } from "../actions/auth/OtpAction";

export interface userState{
    loading: boolean;
    data: SignupFormData|null;
    error: string | null;
}

const initialState: userState= {
    loading: false,
    data: null,
    error: null
}

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        storeUserData: (
            state: userState,
            action: PayloadAction<SignupFormData>
        ) => {
            state.data = action.payload
        }
    },
    extraReducers: (builder) => {
        builder

            // Register_form
            .addCase(signupAction.pending, 
                (state: userState)=>{
                state.loading =true;
                state.error = null;
            })
            .addCase(signupAction.fulfilled, 
                (state: userState, action: PayloadAction<Response>)=>{
                state.loading =false;
                state.data = action.payload.data || null;
                state.error = null;
            })
            .addCase(signupAction.rejected, 
                (state: userState, action)=>{
                state.loading =false;
                state.error = action.payload as string || 'Signup failed';
                state.data = null;
            })

            // Handle Otp verification
            .addCase(otpAction.pending,
                (state: userState)=>{
                    state.loading = true;
                    state.error = null
            })
            .addCase(otpAction.fulfilled, 
                (state: userState, action: PayloadAction<Response>)=>{
                state.loading =false;
                state.data = action.payload.data || null;
                state.error = null;
            })
            .addCase(otpAction.rejected, 
                (state: userState, action)=>{
                state.loading =false;
                state.error = action.payload as string || 'otp verification failed';
                state.data = null;
            })
    }
})

export const { storeUserData } = userSlice.actions;
export const userReducer = userSlice.reducer;
