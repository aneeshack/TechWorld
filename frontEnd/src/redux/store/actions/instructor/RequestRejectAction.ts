import { createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../../../types/IForm";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/Axios";


export const RequestRejectAction = createAsyncThunk<Response, string>(
    'auth/request/reject',
    async(userId: string, {rejectWithValue})=>{
        try {
            const response = await CLIENT_API.patch(`/admin/request/reject/${userId}`)
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