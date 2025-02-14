import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/Axios";

export const fetchUserAction= createAsyncThunk(
    'auth/fetchUserData',
    async(_, {rejectWithValue})=>{
        try {
            const response = await CLIENT_API.get('/fetchUser')

            if(!response.data.success){
                console.log('error in fetch user', response)
                return rejectWithValue(response.data)
            }
            return response.data

        } catch (error) {
            const e: AxiosError = error as AxiosError;
            console.error("Error from backend:", e.response?.data || e.message);
            return rejectWithValue(e.response?.data || e.message);
        }
    }
)