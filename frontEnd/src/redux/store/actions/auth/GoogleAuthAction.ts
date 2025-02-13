import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/Axios";
import { CredentialResponse } from "@react-oauth/google";

export const googleAuthAction = createAsyncThunk(
    'auth/google',
    async ({credentials, userRole}:{ credentials:CredentialResponse; userRole: string}, {rejectWithValue})=>{
        try {
            const payload = { credentials, userRole}
            const response = await CLIENT_API.post('/googleAuth', payload)
            if(response.data.success){
                console.log('data',response)
                  return response.data
              }else{
                console.log('error',response)
                  return rejectWithValue(response.data)
              }
        } catch (error) {
            const e: AxiosError = error as AxiosError;
            console.error("Error from backend:", e.response?.data || e.message);
            return rejectWithValue(e.response?.data || e.message);
        }
    }
)