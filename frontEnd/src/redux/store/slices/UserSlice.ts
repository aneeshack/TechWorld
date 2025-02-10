import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SignupFormData, Response, RequestStatus } from "../../../types/IForm";
import { signupAction } from "../actions/auth/SignupAction";
import { otpAction } from "../actions/auth/OtpAction";
import { logoutAction } from "../actions/auth/LogoutAction";
import { loginAction } from "../actions/auth/LoginAction";
import { RegisterAction } from "../actions/instructor/RegisterAction";
import { fetchUserAction } from "../actions/auth/fetchUserAction";

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
        },

        updateRequestStatus: (state: userState, action: PayloadAction<RequestStatus>) => {
            if (state.data) {
                state.data.requestStatus = action.payload; // Ensure requestStatus exists in SignupFormData
            }
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
                state.error = action.payload  as string|| 'Signup failed';
                state.data = null;
            })

            // fetch user data
            .addCase(fetchUserAction.pending, 
                (state: userState)=>{
                state.loading =true;
                state.error = null;
            })
            .addCase(fetchUserAction.fulfilled, 
                (state: userState, action)=>{
                state.loading =false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchUserAction.rejected, 
                (state: userState, action)=>{
                state.loading =false;
                state.error = action.payload  as string|| 'Fetching user data failed'
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

            // handle logout 
            .addCase(logoutAction.pending,
                (state: userState)=>{
                    state.loading = true;
                    state.error = null
            })
            .addCase(logoutAction.fulfilled, 
                (state: userState, action: PayloadAction<Response>)=>{
                state.loading =false;
                state.data = action.payload.data || null;
                state.error = null;
            })
            .addCase(logoutAction.rejected, 
                (state: userState, action)=>{
                state.loading =false;
                state.error = action.payload as string || 'logout action failed';
                state.data = null;
            })

            // handle login action
            .addCase(loginAction.pending, 
                (state: userState)=>{
                state.loading =true;
                state.error = null;
            })
            .addCase(loginAction.fulfilled, 
                (state: userState, action: PayloadAction<Response>)=>{
                state.loading =false;
                state.data = action.payload.data || null;
                state.error = null;
            })
            .addCase(loginAction.rejected, 
                (state: userState, action)=>{
                state.loading =false;
                state.error = action.payload  as string|| 'Login failed';
                state.data = null;
            })

             // Register_form for instructor
             .addCase(RegisterAction.pending, 
                (state: userState)=>{
                state.loading =true;
                state.error = null;
            })
            .addCase(RegisterAction.fulfilled, 
                (state: userState, action: PayloadAction<Response>)=>{
                state.loading =false;
                state.data = action.payload.data || null;
                state.error = null;
            })
            .addCase(RegisterAction.rejected, 
                (state: userState, action)=>{
                state.loading =false;
                state.error = action.payload  as string|| 'instructor registration failed';
                state.data = null;
            })

     
    }
})

export const { storeUserData, updateRequestStatus } = userSlice.actions;
export const userReducer = userSlice.reducer;
