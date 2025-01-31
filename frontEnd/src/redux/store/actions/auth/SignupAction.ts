import { createAsyncThunk } from "@reduxjs/toolkit";
import { SignupFormData,Response } from "../../../../types/IForm";
import { CLIENT_API } from "../../../../utilities/axios/Axios";
// import { config } from "../../../../common/Config";
import { AxiosError } from "axios";

export const signupAction = createAsyncThunk <Response, SignupFormData>(
    'auth/signup',
    async(data: SignupFormData, {rejectWithValue} )=> {
        try {
            console.log('client api',CLIENT_API)
            const response = await CLIENT_API.post('/signup',data)
            console.log('response',response)
            if(response.data.success){
                console.log('success',response)
                return response.data
            }else{
                console.log('failure',response)
                return rejectWithValue(response.data)
            }
        } catch (error) {
            const e: AxiosError = error as AxiosError;
            console.error('Error from backend:', e.response?.data || e.message);
            return rejectWithValue(e.response?.data || e.message)
        }
    }
)