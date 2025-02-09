import { createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../../../types/IForm";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/Axios";


export const RequestApprovalAction = createAsyncThunk<Response, string>(
    'auth/request/approval',
    async(userId: string, {rejectWithValue})=>{
        try {
            console.log('inside approval action')
            const response = await CLIENT_API.patch(`/admin/request/approve/${userId}`)
            console.log('response from approval action',response)
            if(response.data.success){
                return response.data
            }else{
                return rejectWithValue(response.data)
            }
        } catch (error) {
            const e: AxiosError = error as AxiosError;
                  console.error("Error from backend:", e.response?.data || e.message);
                  return rejectWithValue(e.response?.data || e.message);
        }
    }
)