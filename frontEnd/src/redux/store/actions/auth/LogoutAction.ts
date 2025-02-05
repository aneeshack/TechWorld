import { createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../../../types/IForm";
import { CLIENT_API } from "../../../../utilities/axios/Axios";
import { AxiosError } from "axios";



export const logoutAction = createAsyncThunk<Response>(
    'auth/logout',
    async(_, {rejectWithValue})=>{
        try {
            const response = await CLIENT_API.delete('/logout')

            if(response.data.success){
                return response.data as Response
            }else{
                return rejectWithValue(response.data)
            }

        } catch (error) {
            const e:AxiosError = error as AxiosError;
            console.error('Error from backend:',e.response?.data || e.message)
            return rejectWithValue(e.response?.data || e)
        }
    }
)