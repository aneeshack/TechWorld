import { createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../../../types/IForm";
import { CLIENT_API } from "../../../../utilities/axios/Axios";
import { AxiosError } from "axios";

export interface OtpPayload{
    otp: string,
    email: string
}

export const otpAction = createAsyncThunk <Response, OtpPayload> (

    'auth/verifyOtp',
    async (data:OtpPayload, {rejectWithValue} )=> {
        try {
            console.log('inside otp action')
            const response = await CLIENT_API.post('/verifyOtp', data)
            console.log('response',response);

            if(response.data.success){
                return response.data
            }else{
                return rejectWithValue(response.data)
            }

        } catch (error) {
            const e: AxiosError = error as AxiosError;
            console.error('Error from backend:', e.response?.data || e.message);
            return rejectWithValue(e.response?.data ||e.message)
        }
    }
)
