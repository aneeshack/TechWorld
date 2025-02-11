import { createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../../../types/IForm";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/Axios";


export const resendOtpAction = createAsyncThunk<Response, {email: string}>(
    'auth/resendOtp',
    async(data, {rejectWithValue})=>{
        try {
            const response = await CLIENT_API.post('/resendOtp',data)
            if(response.data.success){
                console.log('response from resend otp',response.data)
                return response.data as Response
            }else{
                return rejectWithValue(response.data)
            }
        } catch (error) {
            const e: AxiosError = error as AxiosError;
            console.error('Error from backend:', e.response?.data || e.message);
            return rejectWithValue(e.response?.data ||e)
        }
    }
)